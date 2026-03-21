import { useState } from "react";
import { supabase, Database } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

// ─── Tipos del formulario ───────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  etapa: "" | "idea" | "validando" | "operando" | "escalando";
  dolores: string[];
  otroDetalle: string; // campo libre cuando se selecciona "otro"
  tiempo: "" | "dias" | "semanas" | "meses";
}

const STEPS = ["Contacto", "Negocio", "Dolor", "Tiempo", "Resultado"];
const DOLORES_OPTIONS = [
  { value: "caos_operativo", label: "Caos operativo — todo en mi cabeza" },
  { value: "sin_sistema", label: "Sin sistema — hago todo manual" },
  { value: "sin_automatizacion", label: "Sin automatización — pierdo tiempo en tareas repetitivas" },
  { value: "sin_ventas", label: "Sin ventas consistentes — el flujo es irregular" },
  { value: "otro", label: "Otro" },
];

// Calcular score según respuestas
function calcularScore(data: FormData): number {
  let score = 50;
  if (data.etapa === "validando") score += 15;
  if (data.etapa === "operando") score += 20;
  if (data.etapa === "escalando") score += 25;
  if (data.dolores.length >= 2) score += 10;
  if (data.tiempo === "dias" || data.tiempo === "semanas") score += 15;
  return Math.min(score, 100);
}

// ─── Componente principal ────────────────────────────────────────
const DiagnosticForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    etapa: "",
    dolores: [],
    otroDetalle: "",
    tiempo: "",
  });

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDolor = (value: string) => {
    setForm((prev) => ({
      ...prev,
      dolores: prev.dolores.includes(value)
        ? prev.dolores.filter((d) => d !== value)
        : [...prev.dolores, value],
      // Si se deselecciona "otro", limpia el detalle
      otroDetalle: value === "otro" && prev.dolores.includes(value) ? "" : prev.otroDetalle,
    }));
  };

  const canContinue = () => {
    if (currentStep === 0) {
      // Nombre, email válido y WhatsApp obligatorio (mín. 8 chars)
      return (
        form.name.trim().length > 0 &&
        form.email.includes("@") &&
        form.whatsapp.trim().length >= 8
      );
    }
    if (currentStep === 1) return Boolean(form.etapa);
    if (currentStep === 2) {
      if (form.dolores.length === 0) return false;
      // Si seleccionó "otro", el detalle es obligatorio (mín. 5 chars)
      if (form.dolores.includes("otro") && form.otroDetalle.trim().length < 5) return false;
      return true;
    }
    if (currentStep === 3) return Boolean(form.tiempo);
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const calculatedScore = calcularScore(form);

    const leadData: LeadInsert = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp: form.whatsapp.trim() || null,
      diagnostic_answers: {
        etapa: form.etapa,
        dolores: form.dolores,
        otro_detalle: form.dolores.includes("otro") ? form.otroDetalle.trim() : null,
        tiempo: form.tiempo,
      },
      status: "new",
      score: calculatedScore,
      notes: null,
      converted_to: null,
    };

    const { error } = await supabase.from("leads").insert(leadData);

    setIsSubmitting(false);

    if (error) {
      console.error("Supabase insert error:", error);
      toast.error("Hubo un error al enviar tu diagnóstico. Intenta de nuevo.");
      return;
    }

    setScore(calculatedScore);
    setIsCompleted(true);
  };

  // ─── Resultado ─────────────────────────────────────────────────
  if (isCompleted) {
    const bloque = score >= 80 ? "Bloque 2 — Blueprint de Negocio" : "Bloque 1 — Radar de Idea";
    return (
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">¡Diagnóstico completado!</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Tu puntuación de alineación es{" "}
            <span className="font-bold text-primary">{score}/100</span>
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 w-full text-left">
          <p className="text-xs text-muted-foreground mb-1">Tu próximo paso sugerido:</p>
          <p className="font-semibold text-foreground">{bloque}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Te contactaremos en las próximas 24h al correo{" "}
          <span className="font-medium text-foreground">{form.email}</span>
          {form.whatsapp && (
            <> y por WhatsApp al <span className="font-medium text-foreground">{form.whatsapp}</span></>
          )}
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/"} className="rounded-full">
          Volver al inicio
        </Button>
      </div>
    );
  }

  // ─── Progress bar ───────────────────────────────────────────────
  const progress = ((currentStep) / (STEPS.length - 2)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Paso {currentStep + 1} de 4
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {STEPS[currentStep]}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress + 25, 100)}%` }}
          />
        </div>
      </div>

      {/* Paso 1: Contacto */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">¿Cómo te llamamos?</h3>
            <p className="text-sm text-muted-foreground mt-1">Datos de contacto para enviarte tu diagnóstico.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="diag-name">Nombre completo *</Label>
              <Input
                id="diag-name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="diag-email">Email *</Label>
              <Input
                id="diag-email"
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="diag-whatsapp">
                WhatsApp <span className="text-xs text-muted-foreground">(requerido para enviarte el diagnóstico)</span>
              </Label>
              <Input
                id="diag-whatsapp"
                placeholder="+52 55 0000 0000"
                value={form.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                className={`h-11 ${
                  form.whatsapp.trim().length > 0 && form.whatsapp.trim().length < 8
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : ""
                }`}
              />
              {form.whatsapp.trim().length > 0 && form.whatsapp.trim().length < 8 && (
                <p className="text-xs text-destructive">
                  Ingresa un número de WhatsApp válido (mínimo 8 dígitos).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Paso 2: Etapa del negocio */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">¿En qué etapa está tu negocio?</h3>
            <p className="text-sm text-muted-foreground mt-1">Selecciona la que mejor te describe hoy.</p>
          </div>
          <div className="grid gap-2">
            {(["idea", "validando", "operando", "escalando"] as const).map((etapa) => {
              const labels = {
                idea: "💡 Tengo la idea pero aún no arranco",
                validando: "🧪 Estoy probando con los primeros clientes",
                operando: "⚙️ Ya opero pero sin procesos claros",
                escalando: "🚀 Opero y quiero escalar con orden",
              };
              return (
                <button
                  key={etapa}
                  onClick={() => updateField("etapa", etapa)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.etapa === etapa
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {labels[etapa]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Paso 3: Dolores */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">¿Cuál es tu mayor dolor hoy?</h3>
            <p className="text-sm text-muted-foreground mt-1">Puedes seleccionar más de uno.</p>
          </div>
          <div className="grid gap-2">
            {DOLORES_OPTIONS.map((opt) => {
              const selected = form.dolores.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleDolor(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                    selected ? "bg-primary border-primary" : "border-muted-foreground"
                  }`}>
                    {selected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Campo libre para "Otro" */}
          {form.dolores.includes("otro") && (
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="diag-otro-detalle">
                ¿Cuál es tu dolor específico? *
              </Label>
              <textarea
                id="diag-otro-detalle"
                placeholder="Descríbelo brevemente..."
                value={form.otroDetalle}
                onChange={(e) => updateField("otroDetalle", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              {form.otroDetalle.trim().length > 0 && form.otroDetalle.trim().length < 5 && (
                <p className="text-xs text-destructive">Por favor describe tu dolor con más detalle.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Paso 4: Tiempo */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">¿Cuánto tiempo tienes para implementar?</h3>
            <p className="text-sm text-muted-foreground mt-1">Esto nos ayuda a calibrar el ritmo del bloque.</p>
          </div>
          <div className="grid gap-2">
            {(["dias", "semanas", "meses"] as const).map((t) => {
              const labels = {
                dias: "⚡ Días — necesito algo ya",
                semanas: "📅 Semanas — tengo algo de tiempo",
                meses: "📆 Meses — puedo hacer esto con calma",
              };
              return (
                <button
                  key={t}
                  onClick={() => updateField("tiempo", t)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.tiempo === t
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2">
        {currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
        ) : (
          <div />
        )}
        <Button
          onClick={handleNext}
          disabled={!canContinue() || isSubmitting}
          className="rounded-full px-6 font-medium"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>
          ) : currentStep === 3 ? (
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
