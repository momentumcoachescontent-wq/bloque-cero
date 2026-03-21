import { useState } from "react";
import { supabase, Database } from "@/lib/supabase";
import {
  BusinessType, Audience, TicketLevel, SalesChannel, Etapa, TiempoDisponible,
  buildBusinessProfile, scoreBusinessProfile, ScoringResult,
} from "@/lib/diagnosticScoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertTriangle, Zap } from "lucide-react";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

// ─── Tipos del formulario ────────────────────────────────────────────────────
interface FormData {
  // Paso 1: Contacto
  name: string;
  email: string;
  whatsapp: string;
  // Paso 2: Negocio
  businessIdea: string;
  type: BusinessType | "";
  audience: Audience | "";
  // Paso 3: Mercado
  country: string;
  ticket: TicketLevel | "";
  channel: SalesChannel | "";
  // Paso 4: Operación
  needs_logistics: boolean | null;
  needs_special_payments: boolean | null;
  // Paso 5: Etapa y Dolores
  etapa: Etapa | "";
  dolores: string[];
  otroDetalle: string;
  // Paso 6: Tiempo
  tiempo: TiempoDisponible | "";
}

// ─── Opciones ────────────────────────────────────────────────────────────────
const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string }[] = [
  { value: "saas",           label: "SaaS / Software",    icon: "💻" },
  { value: "ecommerce",      label: "E-commerce",         icon: "🛒" },
  { value: "marketplace",    label: "Marketplace",        icon: "🔗" },
  { value: "servicio_local", label: "Servicio local",     icon: "📍" },
  { value: "educacion",      label: "Educación",          icon: "📚" },
  { value: "fintech",        label: "Fintech",            icon: "💳" },
  { value: "logistica",      label: "Logística",          icon: "📦" },
  { value: "contenido",      label: "Contenido / Media",  icon: "🎬" },
];

const LATAM_COUNTRIES = [
  { code: "MX", name: "México" }, { code: "CO", name: "Colombia" },
  { code: "AR", name: "Argentina" }, { code: "BR", name: "Brasil" },
  { code: "CL", name: "Chile" }, { code: "PE", name: "Perú" },
  { code: "EC", name: "Ecuador" }, { code: "UY", name: "Uruguay" },
  { code: "BO", name: "Bolivia" }, { code: "PY", name: "Paraguay" },
  { code: "GT", name: "Guatemala" }, { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panamá" }, { code: "DO", name: "Rep. Dominicana" },
  { code: "VE", name: "Venezuela" }, { code: "OTHER", name: "Otro país" },
];

const DOLORES_OPTIONS = [
  { value: "caos_operativo",      label: "Caos operativo — todo en mi cabeza" },
  { value: "sin_sistema",         label: "Sin sistema — hago todo manual" },
  { value: "sin_automatizacion",  label: "Sin automatización — pierdo tiempo" },
  { value: "sin_ventas",          label: "Sin ventas consistentes — flujo irregular" },
  { value: "otro",                label: "Otro" },
];

const STEPS = [
  "Contacto", "Tu negocio", "Tu mercado", "Operación", "Tu momento", "Tu tiempo"
];

// ─── Helper UI ───────────────────────────────────────────────────────────────
const SCORE_COLOR = (s: number) =>
  s >= 75 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400";

const SCORE_BG = (s: number) =>
  s >= 75 ? "bg-green-500/10 border-green-500/25" : s >= 50 ? "bg-yellow-500/10 border-yellow-500/25" : "bg-red-500/10 border-red-500/25";

function Option({
  selected, onClick, children, id,
}: { selected: boolean; onClick: () => void; children: React.ReactNode; id?: string }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
const DiagnosticForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", whatsapp: "",
    businessIdea: "",
    type: "", audience: "",
    country: "", ticket: "", channel: "",
    needs_logistics: null, needs_special_payments: null,
    etapa: "", dolores: [], otroDetalle: "",
    tiempo: "",
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const toggleDolor = (value: string) =>
    setForm((prev) => ({
      ...prev,
      dolores: prev.dolores.includes(value)
        ? prev.dolores.filter((d) => d !== value)
        : [...prev.dolores, value],
      otroDetalle: value === "otro" && prev.dolores.includes(value) ? "" : prev.otroDetalle,
    }));

  // ─── Validación por paso ─────────────────────────────────────
  const canContinue = (): boolean => {
    switch (currentStep) {
      case 0:
        return (
          form.name.trim().length > 0 &&
          form.email.includes("@") &&
          form.whatsapp.trim().length >= 8
        );
      case 1:
        return Boolean(form.businessIdea.trim().length >= 10) && Boolean(form.type) && Boolean(form.audience);
      case 2:
        return Boolean(form.country) && Boolean(form.ticket) && Boolean(form.channel);
      case 3:
        return form.needs_logistics !== null && form.needs_special_payments !== null;
      case 4:
        if (form.dolores.length === 0 || !form.etapa) return false;
        if (form.dolores.includes("otro") && form.otroDetalle.trim().length < 5) return false;
        return true;
      case 5:
        return Boolean(form.tiempo);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Build profile y score
    const profile = buildBusinessProfile({
      country: form.country,
      business_idea: form.businessIdea.trim(),
      type: form.type as BusinessType,
      audience: form.audience as Audience,
      ticket: form.ticket as TicketLevel,
      channel: form.channel as SalesChannel,
      needs_logistics: form.needs_logistics!,
      needs_special_payments: form.needs_special_payments!,
      etapa: form.etapa as Etapa,
      dolores: form.dolores,
      otro_detalle: form.dolores.includes("otro") ? form.otroDetalle.trim() : null,
      tiempo: form.tiempo as TiempoDisponible,
    });

    const scoring = scoreBusinessProfile(profile);

    const leadData: LeadInsert = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp: form.whatsapp.trim() || null,
      diagnostic_answers: {
        // Perfil completo
        business_profile: scoring.n8n_payload.business_profile,
        scores: scoring.n8n_payload.scores,
        // Detalle
        etapa: form.etapa,
        dolores: form.dolores,
        otro_detalle: form.dolores.includes("otro") ? form.otroDetalle.trim() : null,
        tiempo: form.tiempo,
        // Recomendación inmediata
        recommended_block: scoring.recommended_block,
        recommended_block_num: scoring.recommended_block_num,
      },
      status: "new",
      score: scoring.viability_score,
      notes: null,
      converted_to: null,
    };

    const { error } = await supabase.from("leads").insert(leadData);
    setIsSubmitting(false);

    if (error) {
      console.error("Supabase insert error:", JSON.stringify(error, null, 2));
      toast.error("Error al enviar el diagnóstico. Intenta de nuevo.");
      return;
    }

    setResult(scoring);
  };

  // ─── Pantalla de resultado ───────────────────────────────────
  if (result) {
    return (
      <div className="space-y-6 py-2">
        {/* Score principal */}
        <div className={`rounded-2xl border p-5 text-center ${SCORE_BG(result.viability_score)}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Score de Viabilidad
          </p>
          <p className={`text-5xl font-black mb-1 ${SCORE_COLOR(result.viability_score)}`}>
            {result.viability_score}
            <span className="text-2xl">/100</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Complejidad: <span className="font-semibold text-foreground capitalize">{result.complexity_level}</span>
            {" · "}Riesgo regulatorio: <span className="font-semibold text-foreground capitalize">{result.regulatory_risk}</span>
          </p>
        </div>

        {/* Bloque recomendado */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Próximo paso recomendado</p>
          <p className="text-lg font-bold text-foreground mb-2">
            Bloque {result.recommended_block_num} — {result.recommended_block}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.rationale}</p>
        </div>

        {/* Riesgos */}
        {result.key_risks.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Riesgos clave a atender
            </p>
            {result.key_risks.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-card border border-border/50 rounded-xl px-4 py-3">
                <span className="text-yellow-400 flex-shrink-0 mt-0.5">⚠</span>
                {r}
              </div>
            ))}
          </div>
        )}

        {/* Quick wins */}
        {result.quick_wins.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3" /> Quick wins para esta semana
            </p>
            {result.quick_wins.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-card border border-border/50 rounded-xl px-4 py-3">
                <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                {w}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Te contactaremos en las próximas 24h al correo <span className="font-medium text-foreground">{form.email}</span>
          {form.whatsapp && <> y WhatsApp <span className="font-medium text-foreground">{form.whatsapp}</span></>}
        </p>

        <Button variant="outline" size="sm" onClick={() => window.location.href = "/"} className="w-full rounded-full">
          Volver al inicio
        </Button>
      </div>
    );
  }

  // ─── Progress bar ────────────────────────────────────────────
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Paso {currentStep + 1} de {STEPS.length}</span>
          <span className="text-xs text-muted-foreground font-medium">{STEPS[currentStep]}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Paso 1: Contacto ────────────────────────────────── */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">¿Cómo te llamamos?</h3>
            <p className="text-sm text-muted-foreground mt-1">Datos de contacto para enviarte tu diagnóstico.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="diag-name">Nombre completo *</Label>
              <Input id="diag-name" placeholder="Tu nombre" value={form.name}
                onChange={(e) => update("name", e.target.value)} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="diag-email">Email *</Label>
              <Input id="diag-email" type="email" placeholder="tu@correo.com" value={form.email}
                onChange={(e) => update("email", e.target.value)} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="diag-whatsapp">
                WhatsApp * <span className="text-xs text-muted-foreground font-normal">(te enviamos el diagnóstico aquí)</span>
              </Label>
              <Input id="diag-whatsapp" placeholder="+52 55 0000 0000" value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                className={`h-11 ${form.whatsapp.length > 0 && form.whatsapp.trim().length < 8 ? "border-destructive" : ""}`} />
              {form.whatsapp.length > 0 && form.whatsapp.trim().length < 8 && (
                <p className="text-xs text-destructive">Número muy corto — incluye código de país.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Paso 2: Tipo de negocio ─────────────────────────── */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Pregunta Abierta */}
          <div className="space-y-1.5 pt-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">Tu Idea / Negocio</h3>
              <p className="text-sm text-muted-foreground mt-1">Cuéntanos brevemente de qué trata (mínimo 10 caracteres).</p>
            </div>
            <textarea
              id="diag-business-idea"
              placeholder="Ej. Una app que conecta nutriólogos con clientes ocupados..."
              value={form.businessIdea}
              onChange={(e) => update("businessIdea", e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">¿Qué tipo de negocio es?</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BUSINESS_TYPES.map((bt) => (
              <button
                key={bt.value}
                id={`type-${bt.value}`}
                onClick={() => update("type", bt.value)}
                className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  form.type === bt.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span className="mr-2">{bt.icon}</span>{bt.label}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">¿Es B2B, B2C o mixto?</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["b2b", "b2c", "mixto"] as Audience[]).map((a) => (
                <Option key={a} id={`audience-${a}`} selected={form.audience === a} onClick={() => update("audience", a)}>
                  <span className="block text-center font-bold uppercase text-xs tracking-wide">
                    {a === "b2b" ? "🏢 B2B" : a === "b2c" ? "👤 B2C" : "🔄 Mixto"}
                  </span>
                </Option>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Paso 3: Mercado ─────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">Tu mercado objetivo</h3>
            <p className="text-sm text-muted-foreground mt-1">Estos datos calibran el score de viabilidad.</p>
          </div>

          {/* País */}
          <div className="space-y-1.5">
            <Label htmlFor="diag-country">¿País objetivo?</Label>
            <select
              id="diag-country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            >
              <option value="">Selecciona un país...</option>
              {LATAM_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Ticket */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">¿Ticket de venta?</p>
            <div className="grid grid-cols-3 gap-2">
              {(["bajo", "medio", "alto"] as TicketLevel[]).map((t) => {
                const labels = { bajo: "💲 Bajo\n< $50 USD", medio: "💲💲 Medio\n$50–500 USD", alto: "💲💲💲 Alto\n> $500 USD" };
                return (
                  <Option key={t} id={`ticket-${t}`} selected={form.ticket === t} onClick={() => update("ticket", t)}>
                    <span className="block text-center text-xs leading-snug whitespace-pre-line">{labels[t]}</span>
                  </Option>
                );
              })}
            </div>
          </div>

          {/* Canal */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">¿Canal de venta?</p>
            <div className="grid grid-cols-3 gap-2">
              {(["digital", "fisica", "hibrida"] as SalesChannel[]).map((c) => {
                const labels = { digital: "🌐 Digital", fisica: "🏪 Física", hibrida: "🔄 Híbrida" };
                return (
                  <Option key={c} id={`channel-${c}`} selected={form.channel === c} onClick={() => update("channel", c)}>
                    <span className="block text-center text-xs font-bold">{labels[c]}</span>
                  </Option>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Paso 4: Operación ───────────────────────────────── */}
      {currentStep === 3 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">Dependencias operacionales</h3>
            <p className="text-sm text-muted-foreground mt-1">Dos preguntas que determinan la complejidad de implementación.</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-foreground mb-2">¿Necesita logística física?</p>
              <p className="text-xs text-muted-foreground mb-3">Entregas, almacenaje, última milla.</p>
              <div className="grid grid-cols-2 gap-3">
                <Option id="logistics-si" selected={form.needs_logistics === true} onClick={() => update("needs_logistics", true)}>
                  <span className="text-center block">📦 Sí, necesito</span>
                </Option>
                <Option id="logistics-no" selected={form.needs_logistics === false} onClick={() => update("needs_logistics", false)}>
                  <span className="text-center block">✅ No necesito</span>
                </Option>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            <div>
              <p className="text-sm font-bold text-foreground mb-2">¿Necesita pagos o regulación especial?</p>
              <p className="text-xs text-muted-foreground mb-3">Licencias financieras, SAT/DIAN/SRI especial, pasarelas reguladas, cripto, etc.</p>
              <div className="grid grid-cols-2 gap-3">
                <Option id="payments-si" selected={form.needs_special_payments === true} onClick={() => update("needs_special_payments", true)}>
                  <span className="text-center block">💳 Sí, necesito</span>
                </Option>
                <Option id="payments-no" selected={form.needs_special_payments === false} onClick={() => update("needs_special_payments", false)}>
                  <span className="text-center block">✅ No necesito</span>
                </Option>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Paso 5: Etapa + Dolores ─────────────────────────── */}
      {currentStep === 4 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">Tu momento actual</h3>
            <p className="text-sm text-muted-foreground mt-1">Etapa del negocio y principales fricciones.</p>
          </div>

          {/* Etapa */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">¿En qué etapa está tu negocio?</p>
            <div className="grid gap-2">
              {(["idea", "validando", "operando", "escalando"] as Etapa[]).map((etapa) => {
                const labels = {
                  idea: "💡 Tengo la idea pero aún no arranco",
                  validando: "🧪 Probando con los primeros clientes",
                  operando: "⚙️ Ya opero pero sin procesos claros",
                  escalando: "🚀 Opero y quiero escalar con orden",
                };
                return (
                  <Option key={etapa} id={`etapa-${etapa}`} selected={form.etapa === etapa} onClick={() => update("etapa", etapa)}>
                    {labels[etapa]}
                  </Option>
                );
              })}
            </div>
          </div>

          {/* Dolores */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">¿Cuál es tu mayor dolor hoy? <span className="text-xs font-normal text-muted-foreground">(puedes seleccionar varios)</span></p>
            <div className="grid gap-2">
              {DOLORES_OPTIONS.map((opt) => {
                const selected = form.dolores.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    id={`dolor-${opt.value}`}
                    onClick={() => toggleDolor(opt.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      selected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                      {selected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Campo libre "otro" */}
            {form.dolores.includes("otro") && (
              <div className="space-y-1.5 mt-3">
                <Label htmlFor="diag-otro">¿Cuál es tu dolor específico? *</Label>
                <textarea
                  id="diag-otro"
                  placeholder="Descríbelo brevemente..."
                  value={form.otroDetalle}
                  onChange={(e) => update("otroDetalle", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
                {form.otroDetalle.length > 0 && form.otroDetalle.trim().length < 5 && (
                  <p className="text-xs text-destructive">Describe con más detalle.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Paso 6: Tiempo ──────────────────────────────────── */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">¿Cuánto tiempo tienes para implementar?</h3>
            <p className="text-sm text-muted-foreground mt-1">Esto calibra el ritmo y complejidad del bloque recomendado.</p>
          </div>
          <div className="grid gap-2">
            {(["dias", "semanas", "meses"] as TiempoDisponible[]).map((t) => {
              const labels = {
                dias: "⚡ Días — necesito resultados ya",
                semanas: "📅 Semanas — tengo algo de tiempo",
                meses: "📆 Meses — puedo hacer esto con calma",
              };
              return (
                <Option key={t} id={`tiempo-${t}`} selected={form.tiempo === t} onClick={() => update("tiempo", t)}>
                  {labels[t]}
                </Option>
              );
            })}
          </div>
          <div className="bg-muted/30 rounded-xl p-4 mt-2">
            <p className="text-xs text-muted-foreground">
              Al continuar calcularemos tu <span className="font-semibold text-foreground">Score de Viabilidad</span> con{" "}
              datos de mercado LATAM (WDI, CEPAL, UNCTAD) y te daremos una recomendación concreta.
            </p>
          </div>
        </div>
      )}

      {/* ── Navegación ──────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        {currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Atrás
          </button>
        ) : <div />}
        <Button
          id="diag-next"
          onClick={handleNext}
          disabled={!canContinue() || isSubmitting}
          className="rounded-full px-6 font-medium"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Calculando...</>
          ) : currentStep === STEPS.length - 1 ? (
            "Ver mi diagnóstico →"
          ) : (
            <>Continuar <ArrowRight className="w-4 h-4 ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticForm;
