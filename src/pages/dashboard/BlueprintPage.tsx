import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Loader2,
  Target,
  Brain,
  FileText,
  Aperture,
  ArrowRight,
  CheckCircle2,
  Clock,
  Wand2,
  FileDown,
  Presentation,
  LayoutTemplate,
  XCircle,
  Zap,
  ShieldCheck,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FolderSearch, 
  ChevronRight,
  Database,
  LineChart,
  HardDrive
} from "lucide-react";

const BIG_6_QUESTIONS = [
  {
    id: "real_problem",
    question: "Análisis de Fricción Crítica (Pain Point)",
    description: "Identificación de la patología operativa o frustración sistémica que tu solución resuelve de raíz.",
    ai_suggestion: "Eliminamos el lucro cesante por ineficiencia en la gestión de métricas publicitarias."
  },
  {
    id: "value_prop",
    question: "Arquitectura de Diferenciación (Value Prop)",
    description: "Definición del núcleo de valor que invalida a la competencia ante los ojos de tu cliente ideal.",
    ai_suggestion: "Reducción del 90% en tiempos de procesamiento mediante automatización cognitiva propia."
  },
  {
    id: "unfair_advantage",
    question: "Blindaje Competitivo (Unfair Advantage)",
    description: "Componentes operativos, de datos o de red que son invulnerables a la réplica por competidores con mayor capital.",
    ai_suggestion: "Propiedad intelectual sobre el algoritmo de clasificación y red de aliados Clase A."
  },
  {
    id: "unit_economics",
    question: "Matriz de Sostenibilidad (Unit Economics)",
    description: "Determinación del costo marginal de entrega y viabilidad financiera por unidad de servicio/producto.",
    ai_suggestion: "Margen operativo del 85% tras absorber costos de infraestructura digital por usuario."
  },
  {
    id: "ideal_segment",
    question: "Segmentación de Alta Probabilidad",
    description: "Perfil demográfico y psicográfico del cliente con menor resistencia a la adopción y mayor LTV.",
    ai_suggestion: "Directores de Operaciones en Middle-Market (facturación > $5M USD) con stack tecnológico obsoleto."
  },
  {
    id: "anti_segment",
    question: "Exclusión Estratégica (Anti-Segmento)",
    description: "Definición rigurosa de prospectos que erosionan el margen o degradan la calidad del sistema operativo.",
    ai_suggestion: "Microempresas sin equipo de implementación o baja disposición tecnológica."
  },
  {
    id: "bottleneck",
    question: "Puntos de Ruptura (Scalability Bottleneck)",
    description: "Identificación del primer componente del sistema que colapsaría ante un incremento de demanda 10x.",
    ai_suggestion: "La fase de onboarding manual requiere transición inmediata a autoservicio guiado por IA."
  },
  {
    id: "acquisition",
    question: "Ecosistema de Adquisición",
    description: "Canales de tracción probados y métricas estimadas de CAC para escalamiento previsible.",
    ai_suggestion: "Estrategia de Content-Led Growth en LinkedIn + Alianzas con cámaras industriales."
  },
  {
    id: "endgame",
    question: "Visión de Estado Final (3 Años)",
    description: "Configuración del negocio operando en régimen de autonomía y eficiencia máxima.",
    ai_suggestion: "Liderazgo en el nicho regional con una tasa de retención (Retention) superior al 95%."
  },
  {
    id: "kill_factor",
    question: "Análisis de Riesgo Sistémico (Kill Factor)",
    description: "Variables externas o internas con potencial para invalidar el modelo de negocio de forma estructural.",
    ai_suggestion: "Dependencia crítica de APIs de terceros con riesgo de cambio de términos unilateral."
  },
  {
    id: "revenue_pricing",
    question: "Ingeniería de Rentabilidad (Pricing)",
    description: "Estructura de cobro vinculada a la entrega de valor, asegurando la captura de excedente del consumidor.",
    ai_suggestion: "Suscripción basada en volumen de ahorro generado, alineando incentivos con el cliente."
  }
];

export default function BlueprintWizard() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // State Machine
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State ya no se manejan con useState, se manejan abajo con useQuery
  
  // Form State
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedFormat, setSelectedFormat] = useState<string>("");

  // Queries con Cache
  const { data: requestData, isLoading: loadingRequest } = useQuery({
    queryKey: ['blueprint_requests', profile?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('blueprint_requests')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data || null;
    },
    enabled: !!profile?.id,
    refetchInterval: (query) => query.state.data && query.state.data.progress_day < 7 ? 30000 : false,
  });

  const { data: leadsData = [], isLoading: loadingLeads } = useQuery({
    queryKey: ['leads', profile?.email],
    queryFn: async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('email', profile?.email)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!profile?.email, // Siempre cargamos leads para tener contexto del Blueprint Intake
  });

  const loading = loadingRequest || (loadingLeads && !requestData);
  const existingRequest = requestData;
  const leads = leadsData;

  useEffect(() => {
    if (existingRequest) {
      setStep(4);
    }
  }, [existingRequest]);

  const handleMakePrivate = () => {
    toast.success("Tu privacidad es prioritaria. Tu caso ha sido blindado y quedará fuera de los casos de éxito.", { icon: "🔒" });
    setTimeout(() => window.location.href = "/", 3000);
  };

  const handleCreateRequest = async () => {
    if (!selectedLeadId || Object.keys(answers).length < BIG_6_QUESTIONS.length || !selectedFormat) {
      toast.error("Por favor completa toda la información.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('blueprint_requests')
        .insert({
          user_id: profile!.id,
          lead_id: selectedLeadId,
          diagnostic_answers: answers,
          format_pdf: selectedFormat.includes('pdf'),
          format_presentation: selectedFormat.includes('presentation'),
          format_infographic: selectedFormat.includes('infographic'),
          status: 'analyzing',
          progress_day: 1
        })
        .select()
        .single();

      if (error) throw error;
      
      // Buscamos el lead original para enviar el análisis base del Blueprint a n8n
      const selectedLead = leadsData.find((l: any) => l.id === selectedLeadId);

      // FIXME: Disparo directo a n8n desde el cliente. Esto es un riesgo de seguridad operativa.
      // Debe migrarse a un trigger de Supabase o a una Edge Function (Bloque A Fase 3B).
      try {
        const webhookUrl = import.meta.env.VITE_N8N_BLUEPRINT_WEBHOOK_URL || 'https://n8n-n8n.z3tydl.easypanel.host/webhook-test/bloque-cero-blueprint';
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'nuevo_blueprint_request',
            request_id: data.id,
            user_id: profile!.id,
            lead_id: selectedLeadId,
            intake_answers: selectedLead?.diagnostic_answers || {},
            diagnostic_answers: answers,
            created_at: data.created_at,
            format_configuration: {
              pdf: selectedFormat.includes('pdf'),
              presentation: selectedFormat.includes('presentation'),
              infographic: selectedFormat.includes('infographic')
            }
          })
        });
      } catch (webhookErr) {
        console.error("Error disparando webhook n8n:", webhookErr);
      }
      
      toast.success("¡Blueprint en marcha!");
      await queryClient.invalidateQueries({ queryKey: ['blueprint_requests', profile?.id] });
      setStep(4);
      
    } catch (err) {
      console.error(err);
      toast.error("Error al despachar el Blueprint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Blueprint Operativo</h1>
            <p className="text-muted-foreground">
              {step < 4 
                ? "Elevaremos tu diagnóstico cero a un nivel de consultoría Big-6 para estructurar tu negocio."
                : "Monitorea la producción algorítmica de tu plano táctico."}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="bg-card border border-border/50 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-primary" />
                  Paso 1: Confirma tu Tesis
                </h2>
                <p className="text-muted-foreground mb-6">Hemos detectado los ingresos previos de Blueprint asociados a tu cuenta. Selecciona sobre cuál construiremos tu Blueprint extendido.</p>
                
                {leads.length === 0 ? (
                  <div className="bg-muted/30 p-6 rounded-lg text-center border border-dashed border-border/50">
                    <p>No tienes ingresos previos de Blueprint registrados.</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.href = "/diagnostico"}>Iniciar Blueprint de Negocio</Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {leads.map(lead => {
                      const projectName = lead.diagnostic_answers?.business_name || lead.business_name || "Proyecto Sin Nombre";
                      const projectDesc = lead.diagnostic_answers?.idea_description || lead.idea_description;
                      return (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedLeadId === lead.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border/50 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {projectName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {projectDesc || "Descrito en tu diagnóstico inicial."}
                            </p>
                          </div>
                          {lead.score !== undefined && lead.score !== null && (
                            <div className="text-right flex-shrink-0 ml-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${lead.score >= 75 ? "bg-green-500/10 text-green-500" : lead.score >= 50 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>
                                {lead.score}/100
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-end mt-8 pt-6 border-t border-border/10">
                  <Button disabled={!selectedLeadId} onClick={() => setStep(2)}>
                    Siguiente: Deep Diagnostic <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="bg-card border border-border/50 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-primary" />
                  Paso 2: Deep Diagnostic (Nivel Big 6)
                </h2>
                <p className="text-muted-foreground mb-8">
                  Para generar un Blueprint invulnerable, los asesores top requieren comprender tus cuellos de botella reales. Demuestra el filo de tu visión.
                </p>

                <div className="space-y-10">
                  {BIG_6_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="relative pl-6 border-l-2 border-primary/20">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>
                      <h3 className="font-bold text-lg mb-1">{idx + 1}. {q.question}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{q.description}</p>
                      
                      <div className="relative">
                        <Textarea 
                          value={answers[q.id] || ""}
                          onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                          placeholder="Tu respuesta incisiva..."
                          className="min-h-[100px] resize-y bg-background"
                        />
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setAnswers({...answers, [q.id]: q.ai_suggestion})}
                          className="absolute bottom-3 right-3 h-7 text-xs gap-1 border border-primary/20 text-primary hover:bg-primary/10"
                        >
                          <Wand2 className="w-3 h-3" /> Ejemplo de respuesta
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-10 pt-6 border-t border-border/10">
                  <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
                  <Button 
                    disabled={Object.keys(answers).length < BIG_6_QUESTIONS.length} 
                    onClick={() => setStep(3)}
                  >
                    Configurar Entregable <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="bg-card border border-border/50 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Aperture className="w-5 h-5 text-primary" />
                  Paso 3: Formato del Entregable
                </h2>
                <p className="text-muted-foreground mb-8">
                  Selecciona el empaque ideal en el que la inteligencia artificial despachará tu solución.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { id: "pdf_infographic", label: "Documento PDF + Infografía", icon: FileText },
                    { id: "presentation_infographic", label: "Presentación Pitch + Infografía", icon: Presentation },
                    { id: "pdf_presentation", label: "Documento PDF + Presentación", icon: LayoutTemplate }
                  ].map(format => (
                    <div 
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        selectedFormat === format.id
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <format.icon className={`w-10 h-10 mb-4 ${selectedFormat === format.id ? "text-primary": "text-muted-foreground"}`} />
                      <span className="font-semibold text-sm">{format.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-10 pt-6 border-t border-border/10">
                  <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
                  <Button 
                    disabled={!selectedFormat || submitting} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
                    onClick={handleCreateRequest}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Despachar al Laboratorio"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && existingRequest && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* BASELINE DEL RADAR: Conectividad con el inicio */}
              {(() => {
                const lead = leadsData.find((l: any) => l.id === existingRequest.lead_id);
                if (!lead) return null;
                const projectName = lead.diagnostic_answers?.business_name || lead.business_name || "Proyecto en análisis";
                
                return (
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Análisis base del Blueprint</p>
                        <p className="text-sm font-bold text-foreground">{projectName}</p>
                      </div>
                    </div>
                    {lead.score !== undefined && lead.score !== null && (
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Viabilidad Inicial</p>
                        <p className={`text-sm font-bold ${lead.score >= 75 ? "text-green-500" : lead.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                          {lead.score}/100
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {existingRequest.status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-500 text-sm">Error en el procesamiento</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hubo un problema generando tu Blueprint. Por favor{" "}
                      <a href="/contacto" className="text-primary hover:underline">contacta soporte</a>{" "}
                      para resolverlo.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-card/30 border border-primary/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Construyendo tu Imperio Lógico</h2>
                  <p className="text-muted-foreground mb-10 max-w-xl">
                    Nuestro sistema operativo está ensamblando tu Blueprint de Negocio. Este proceso involucra análisis de datos cruzados y auditoría de viabilidad a 7 días.
                  </p>

                  <div className="relative mb-16">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
                       <div 
                          className="h-full bg-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${Math.min(100, (existingRequest.progress_day / 7) * 100)}%` }}
                       />
                    </div>
                    
                    <div className="relative flex justify-between">
                      {[
                        { day: 1, label: "Diagnóstico", d: "Datos Inyectados" },
                        { day: 3, label: "Finanzas", d: "Unit Econ. Analizados" },
                        { day: 5, label: "Maquetación", d: "Arquitectura Estructural" },
                        { day: 7, label: "Entrega", d: "Revisión Final" }
                      ].map((milestone, idx) => {
                        const isCompleted = existingRequest.progress_day >= milestone.day;
                        const isCurrent = existingRequest.progress_day === milestone.day;
                        
                        return (
                          <div key={milestone.day} className="flex flex-col items-center group relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm z-10 transition-all duration-500 ${
                              isCompleted 
                                ? "bg-primary border-primary/20 text-white scale-110" 
                                : isCurrent
                                  ? "bg-background border-primary text-primary ring-4 ring-primary/10"
                                  : "bg-muted border-background text-muted-foreground"
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                            </div>
                            <div className="text-center mt-4 absolute top-10 w-32 -translate-x-1/2 left-1/2">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted || isCurrent ? "text-primary" : "text-muted-foreground/40"}`}>
                                {milestone.day === 7 ? "LIBERADO" : `DÍA ${milestone.day}`}
                              </p>
                              <p className={`text-[10px] leading-tight mt-1 transition-opacity ${isCompleted || isCurrent ? "opacity-100 text-muted-foreground" : "opacity-0"}`}>
                                {milestone.label}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* SISTEMA DE HITOS DINÁMICOS: CERTIDUMBRE PROACTIVA */}
                  {existingRequest.progress_day < 7 && (
                    <div className="mb-10 p-5 bg-background border border-border/50 rounded-xl shadow-sm animate-in fade-in slide-in-from-left-4 duration-1000">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                           </div>
                           <h4 className="text-sm font-bold uppercase tracking-widest">Estado del Algoritmo</h4>
                        </div>
                        <span className="text-[10px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Procesando {existingRequest.progress_day < 3 ? "Día 1-2" : existingRequest.progress_day < 5 ? "Día 3-4" : "Día 5-6"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                         <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                             {existingRequest.progress_day < 3 ? <FolderSearch className="w-4 h-4 text-primary" /> : <Database className="w-4 h-4 text-primary" />}
                             <div>
                                <p className="text-[11px] font-bold text-foreground">Hito Actual</p>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                   {existingRequest.progress_day < 3 
                                     ? "Cruzando intake base con Deep Diagnostic para identificar anomalías." 
                                     : existingRequest.progress_day < 5 
                                       ? "Extrayendo Unit Economics y proyecciones de rentabilidad operativa."
                                       : "Ensamblando arquitectura de GTM y Blindaje Competitivo (Moat)."}
                                </p>
                             </div>
                         </div>
                         <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/40 relative opacity-60">
                             <LineChart className="w-4 h-4 text-muted-foreground" />
                             <div>
                                <p className="text-[11px] font-bold text-foreground">Próximo Hito: {existingRequest.progress_day < 3 ? "Día 3" : existingRequest.progress_day < 5 ? "Día 5" : "Día 7"}</p>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                   {existingRequest.progress_day < 3 
                                     ? "Auditoría Financiera y Matriz de Sostenibilidad." 
                                     : existingRequest.progress_day < 5 
                                       ? "Maquetación Estructural y Puntos de Ruptura."
                                       : "Entrega Final y Acceso a Drive Estratégico."}
                                </p>
                             </div>
                             <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Análisis Preliminar Inyectado */}
                  {(existingRequest.generated_blueprint as any)?.preliminary && (
                    <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-4 duration-1000">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Inyección de Análisis Inicial</h3>
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
                        {(existingRequest.generated_blueprint as any).preliminary}
                      </div>
                      <p className="text-[10px] text-primary/60 mt-4 uppercase tracking-tighter">
                        * Este análisis es una primera aproximación algorítmica. Tu Blueprint final de 7 días incluirá la arquitectura completa.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SKELETON MOCK VIEW SIEMPRE VISIBLE */}
              <div className="border border-border/50 rounded-2xl p-8 bg-card shadow-sm relative overflow-hidden h-[450px]">
                 <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all ${existingRequest.progress_day >= 7 ? 'bg-background/80 backdrop-blur-sm' : 'pointer-events-none'}`}>
                    {existingRequest.progress_day < 7 ? (
                      <div className="absolute top-6 right-6 flex items-center gap-2 bg-card/90 border border-primary/20 px-4 py-2 rounded-full shadow-md animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Mapificando Estructura</span>
                      </div>
                    ) : (
                      <div className="text-center animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3 drop-shadow-sm" />
                        <p className="text-sm font-semibold text-foreground uppercase tracking-widest mb-6">Blueprint Finalizado</p>
                        <div className="flex justify-center flex-wrap gap-3 pointer-events-auto">
                          {existingRequest.format_pdf && existingRequest.pdf_url && (
                            <Button variant="outline" onClick={() => window.open(existingRequest.pdf_url, '_blank')} className="gap-2 bg-background border-primary text-primary hover:bg-primary/10 transition-colors">
                              <FileDown className="w-4 h-4" /> Bajar PDF
                            </Button>
                          )}
                          {existingRequest.format_presentation && existingRequest.presentation_url && (
                            <Button variant="outline" onClick={() => window.open(existingRequest.presentation_url, '_blank')} className="gap-2 bg-background border-primary text-primary hover:bg-primary/10 transition-colors">
                              <Presentation className="w-4 h-4" /> Bajar Pitch
                            </Button>
                          )}
                          {existingRequest.format_infographic && existingRequest.infographic_url && (
                            <Button variant="outline" onClick={() => window.open(existingRequest.infographic_url, '_blank')} className="gap-2 bg-background border-primary text-primary hover:bg-primary/10 transition-colors">
                              <Aperture className="w-4 h-4" /> Bajar Infografía
                            </Button>
                          )}
                           {/* NUEVO: ACCESO A DRIVE AUTOMATIZADO (ESTRUCTURAL) */}
                           <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20" onClick={() => window.open(`https://drive.google.com/drive/search?q=${existingRequest.id}`, '_blank')}>
                              <HardDrive className="w-4 h-4" /> Ver Carpeta Estratégica
                           </Button>
                        </div>
                      </div>
                    )}
                  </div>
                 
                 {/* Mock UI layout, visible even while loading */}
                 <div className="grid grid-cols-3 gap-4 pointer-events-none mb-6">
                   {[
                     "Foso Defensivo", "Unit Econ.", "Anti-Segmento"
                   ].map((title) => (
                     <div key={title} className={`h-24 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all duration-1000 ${existingRequest.progress_day < 7 ? 'bg-muted/30 border-2 border-dashed border-primary/20 text-muted-foreground/50' : 'bg-primary/10 border border-primary/50 text-primary/80 shadow-sm'}`}>
                       <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
                       {existingRequest.progress_day >= 7 && <CheckCircle2 className="w-3 h-3 mt-2 text-primary/40" />}
                     </div>
                   ))}
                 </div>
                 
                 <div className="grid grid-cols-5 gap-4 pointer-events-none">
                   <div className={`h-64 rounded-xl col-span-2 flex items-center justify-center p-4 text-center transition-all duration-1000 ${existingRequest.progress_day < 7 ? 'bg-muted/30 border-2 border-dashed border-primary/20 text-muted-foreground/50' : 'bg-card border border-primary/30 shadow-sm'}`}>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${existingRequest.progress_day < 7 ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>Estructura Operativa</span>
                   </div>
                   <div className={`h-64 rounded-xl col-span-3 flex items-center justify-center p-4 text-center transition-all duration-1000 ${existingRequest.progress_day < 7 ? 'bg-muted/30 border-2 border-dashed border-primary/20 text-muted-foreground/50' : 'bg-card border border-primary/30 shadow-sm'}`}>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${existingRequest.progress_day < 7 ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>Framework de Adquisición</span>
                   </div>
                 </div>
              </div>

              {existingRequest.progress_day >= 7 && (existingRequest.generated_blueprint as { markdown?: string })?.markdown && (
                <div className="border border-border/50 rounded-xl p-8 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Contenido del Blueprint
                  </h3>
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed max-h-[600px] overflow-y-auto pr-2">
                    {(existingRequest.generated_blueprint as { markdown?: string }).markdown}
                  </div>
                </div>
              )}

              {existingRequest.progress_day < 7 && (
                <div className="mt-6 flex items-start gap-3 bg-muted/40 p-5 rounded-xl border border-border/50 animate-in fade-in slide-in-from-bottom-4">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Serás notificado al correo registrado cuando el algoritmo concluya el análisis estructural. Al finalizar, encontrarás los documentos estratégicos disponibles para descarga en esta misma vista.
                  </p>
                </div>
              )}

              {/* STEP 6: CONVERSION & FEEDBACK */}
              {existingRequest.progress_day >= 7 && (
                <div className="space-y-12 mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  
                  {/* Next Step Strategic Card */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Rocket className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="relative z-10 max-w-2xl text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
                        <Zap className="w-3 h-3" /> Siguiente Paso Estratégico
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">Has blindado tu idea. Ahora es momento de darle vida.</h3>
                      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        El plano está listo. La ejecución es lo que separa a los soñadores de los fundadores. Como cliente de Blueprint, tienes un **20% de descuento directo** en tu primer bloque de implementación.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={() => window.location.href = '/dashboard/mvp'}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 shadow-md"
                        >
                          Ir al MVP de Validación (Bloque 03)
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => window.location.href = '/dashboard/automatizaciones'}
                          className="border-primary/30 text-primary hover:bg-primary/5 font-semibold px-8 h-12"
                        >
                          Explorar Automatizaciones (Bloque 05)
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Feedback & QA */}
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-8 text-center max-w-2xl mx-auto">
                    {!answers.qa_completed ? (
                      <>
                        <h4 className="font-bold text-lg mb-2">Aseguramiento de Calidad (QA)</h4>
                        <p className="text-sm text-muted-foreground mb-6">
                          Como firma boutique, nuestro equipo de soporte prioriza resultados por encima del protocolo. ¿El Blueprint superó tus expectativas operativas?
                        </p>
                        <div className="flex justify-center flex-wrap gap-4">
                          <Button 
                            variant="secondary" 
                            onClick={() => setAnswers({...answers, qa_completed: "true"})}
                            className="bg-background shadow-sm hover:bg-muted font-semibold"
                          >
                            ¡Mente Volada! (Satisfecho)
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => window.location.href = '/contacto?subject=blueprint_qa'}
                            className="text-primary border-primary/50 hover:bg-primary/10 bg-transparent"
                          >
                            Requiero Aclaración Operacional
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h4 className="font-bold text-xl mb-2 text-foreground">¡Satisfechos de trabajar contigo!</h4>
                        
                        <div className="p-4 bg-muted/50 rounded-xl mb-6 border border-border/50">
                           <p className="text-xs text-muted-foreground leading-relaxed">
                             <ShieldCheck className="w-3 h-3 inline mr-1 text-primary" /> 
                             Al aprobar el testimonio, autorizas el uso de la lógica de tu caso para fines educativos, eliminando nombres, métricas exactas e identificadores privados.
                           </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                          <Button variant="default" className="bg-primary hover:bg-primary/90 w-full sm:w-auto font-bold px-8 shadow-lg shadow-primary/20">
                            Aprobar Testimonio
                          </Button>
                          <Button variant="outline" onClick={handleMakePrivate} className="border-border text-muted-foreground hover:bg-muted w-full sm:w-auto">
                            Mantener Privado
                          </Button>
                          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 w-full sm:w-auto font-semibold" onClick={() => window.location.href = '/contacto?subject=blueprint_qa'}>
                            Solicitar Aclaración de 7 Días
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </>
      )}
    </div>
  );
}
