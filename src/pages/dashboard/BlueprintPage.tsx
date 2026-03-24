import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BIG_6_QUESTIONS = [
  {
    id: "real_problem",
    question: "El Dolor Real",
    description: "Más allá de lo obvio, ¿cuál es ese dolor de cabeza o frustración que realmente le quitas a tu cliente?",
    ai_suggestion: "Les quito la frustración de perder dinero y tiempo lidiando con agencias que no entregan métricas claras."
  },
  {
    id: "value_prop",
    question: "Propuesta de Valor (Sin paja)",
    description: "Si tuvieras que explicarle a un niño de 10 años por qué eres mejor que tu competencia, ¿qué le dirías?",
    ai_suggestion: "Nosotros hacemos en 5 minutos lo que a otros les toma una semana entera, y sin cobrarte por adelantado."
  },
  {
    id: "unfair_advantage",
    question: "Foso Defensivo (Unfair Advantage)",
    description: "¿Qué componente de tu operación es casi imposible de copiar, incluso si alguien llega con muchísimo más presupuesto (lana)?",
    ai_suggestion: "Nuestra red de contactos exclusiva en la industria que construimos durante 15 años."
  },
  {
    id: "unit_economics",
    question: "Límites de Viabilidad",
    description: "Ignorando lo que te costó arrancar, ¿cuánto te cuesta de tu bolsa entregarle tu servicio/producto a *un cliente nuevo*?",
    ai_suggestion: "$0 pesos extra porque es puro software, pero le dedico unas 2 horas a la semana a soporte por cliente."
  },
  {
    id: "ideal_segment",
    question: "Segmento Láser",
    description: "Describe a tu cliente ideal, ese que te compra rápido porque entiende el valor y no te da lata.",
    ai_suggestion: "Directores de operaciones en empresas manufactureras de entre 50 y 200 empleados que odian usar Excel."
  },
  {
    id: "anti_segment",
    question: "Anti-Segmento (Focus Láser)",
    description: "¿A quién NO le venderías jamás tu producto o servicio, aunque trajera el dinero en la bolsa?",
    ai_suggestion: "A 'solopreneurs' o freelancers que no tienen un equipo, porque mi herramienta es para colaboración."
  },
  {
    id: "bottleneck",
    question: "El Tronadero (Cuello de Botella)",
    description: "Si multiplicaras tus ventas x10 mañana por pura suerte, ¿qué área exacta de tu operación tronaría primero?",
    ai_suggestion: "El proceso de onboarding manual tronaría enseguida. No tenemos personal para dar de alta a 100 clientes de golpe."
  },
  {
    id: "acquisition",
    question: "Estrategia de Adquisición",
    description: "¿Cuál es tu canal principal para jalar clientes hoy y cuánto te cuesta traer uno nuevo en promedio?",
    ai_suggestion: "Casi todo llega orgánico por LinkedIn y referencias. Me sale 'gratis' en lana, pero me cuesta 5 horas a la semana de networking."
  },
  {
    id: "endgame",
    question: "La Visión a 3 Años (Endgame)",
    description: "Si todo sale a la perfección, ¿cómo se ve tu negocio operando en piloto automático en 3 años?",
    ai_suggestion: "Cobrando suscripciones mensuales recurrentes con un equipo de 3 personas gestionando la plataforma desde cualquier lado."
  },
  {
    id: "kill_factor",
    question: "El Riesgo Mortal (Kill Factor)",
    description: "¿Qué es lo peor que podría pasar en el mercado o en tu operación que te obligaría a bajar la cortina mañana?",
    ai_suggestion: "Si Google o Facebook cambian sus políticas de privacidad y ya no podemos conectarnos a sus APIs, el negocio muere."
  },
  {
    id: "revenue_pricing",
    question: "Motor de Rentabilidad (Pricing)",
    description: "¿Cómo cobras exactamente y por qué tu cliente siente que está ganando dinero o tiempo al pagarte ese precio?",
    ai_suggestion: "Cobramos un fee mensual de $500 USD, pero les ahorramos $2000 USD en multas y horas de sus contadores."
  }
];

export default function BlueprintWizard() {
  const { profile } = useAuth();
  
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
    enabled: !!profile?.email && !requestData, // No cargamos leads si ya hay request
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
      
      toast.success("¡Blueprint en marcha!");
      setStep(4);
      // Forzamos un recargo de la ventana para reiniciar las queries limpiamente 
      // y visualizar la nueva request si no queremos inyectar el queryClient aquí.
      window.location.reload();
      
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
                <p className="text-muted-foreground mb-6">Hemos detectado las siguientes ideas que analizaste en tu Radar. Selecciona sobre cuál de ellas construiremos tu Blueprint arquitectónico.</p>
                
                {leads.length === 0 ? (
                  <div className="bg-muted/30 p-6 rounded-lg text-center border border-dashed border-border/50">
                    <p>No tienes análisis previos en tu radar.</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.href = "/diagnostico"}>Ir al Radar de Idea</Button>
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
                        { day: 1, label: "Diagnóstico", d: "Dato Inyectados" },
                        { day: 3, label: "Finanzas", d: "Unit Econ. Analizados" },
                        { day: 5, label: "Maquetación", d: "Arquitectura Estructural" },
                        { day: 7, label: "Entrega", d: "Revisión Final" }
                      ].map((milestone) => {
                        const isCompleted = existingRequest.progress_day >= milestone.day;
                        const isCurrent = existingRequest.progress_day === milestone.day;
                        
                        return (
                          <div key={milestone.day} className="flex flex-col items-center group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 shadow-sm z-10 transition-colors ${
                              isCompleted 
                                ? "bg-primary border-primary/20 text-white" 
                                : isCurrent
                                  ? "bg-background border-primary text-primary"
                                  : "bg-muted border-background text-muted-foreground"
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3 h-3" />}
                            </div>
                            <div className="text-center mt-3 absolute top-10 w-32 -translate-x-1/2 left-1/2">
                              <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted || isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                                Día {milestone.day}
                              </p>
                              <p className="text-[10px] text-muted-foreground leading-tight mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {milestone.label}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SKELETON MOCK VIEW SIEMPRE VISIBLE */}
              <div className="border border-border/50 rounded-2xl p-8 bg-card shadow-sm relative overflow-hidden h-[400px]">
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
                        </div>
                      </div>
                    )}
                 </div>
                 
                 {/* Mock UI layout, visible even while loading */}
                 <div className="grid grid-cols-3 gap-4 pointer-events-none mb-6">
                   {[
                     "Foso Defensivo", "Unit Econ.", "Anti-Segmento"
                   ].map((title) => (
                     <div key={title} className={`h-20 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all duration-1000 ${existingRequest.progress_day < 7 ? 'bg-muted/30 border-2 border-dashed border-primary/20 text-muted-foreground/50' : 'bg-primary/10 border border-primary/50 text-primary/80 shadow-sm'}`}>
                       <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="grid grid-cols-5 gap-4 pointer-events-none">
                   <div className={`h-64 rounded-xl col-span-2 flex items-center justify-center p-4 text-center transition-all duration-1000 ${existingRequest.progress_day < 7 ? 'bg-muted/30 border-2 border-dashed border-primary/20 text-muted-foreground/50' : 'bg-card border border-primary/30 shadow-sm'}`}>
                     <span className={`text-sm font-semibold uppercase tracking-widest ${existingRequest.progress_day < 7 ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>Estructura Operativa</span>
                   </div>
                   <div className={`h-64 rounded-xl col-span-3 flex items-center justify-center p-4 text-center transition-all duration-1000 ${existingRequest.progress_day < 7 ? 'bg-muted/30 border-2 border-dashed border-primary/20 text-muted-foreground/50' : 'bg-card border border-primary/30 shadow-sm'}`}>
                     <span className={`text-sm font-semibold uppercase tracking-widest ${existingRequest.progress_day < 7 ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>Framework de Adquisición</span>
                   </div>
                 </div>
              </div>

              {existingRequest.progress_day < 7 && (
                <div className="mt-6 flex items-start gap-3 bg-muted/40 p-5 rounded-xl border border-border/50 animate-in fade-in slide-in-from-bottom-4">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Serás notificado al correo registrado cuando el algoritmo concluya el análisis estructural. Al finalizar, encontrarás los documentos estratégicos disponibles para descarga en esta misma vista.
                  </p>
                </div>
              )}

              {/* STEP 6: FEEDBACK & QA */}
              {existingRequest.progress_day >= 7 && (
                <div className="bg-muted/30 border border-border/50 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   {!answers.qa_completed ? (
                     <>
                       <h4 className="font-bold text-lg mb-2">Aseguramiento de Calidad (QA)</h4>
                       <p className="text-sm text-muted-foreground mb-6">
                         Como firma boutique, nuestro equipo de soporte prioriza resultados por encima del protocolo. ¿El Blueprint superó tus expectativas operativas?
                       </p>
                       <div className="flex justify-center gap-4">
                         <Button 
                           variant="secondary" 
                           onClick={() => setAnswers({...answers, qa_completed: "true"})}
                           className="bg-background shadow-sm hover:bg-muted font-semibold"
                         >
                           ¡Mente Volada! (Satisfecho)
                         </Button>
                         <Button 
                           variant="outline" 
                           onClick={() => window.open('/contacto', '_blank')}
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
                       <p className="text-sm text-muted-foreground mb-6">
                         Tu confirmación cierra este proceso formalmente. Nos encantaría solicitar tu visto bueno para publicar tu historia en nuestro portal (eliminando datos confidenciales).
                       </p>
                       <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                         <Button variant="default" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                           Aprobar Testimonio
                         </Button>
                         <Button variant="outline" onClick={handleMakePrivate} className="border-border/50 text-muted-foreground hover:bg-muted w-full sm:w-auto">
                           Prefiero Mantenerlo Privado
                         </Button>
                         <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 w-full sm:w-auto" onClick={() => window.open('/diamantes', '_blank')}>
                           Solicitar Nuevo Análisis Único
                         </Button>
                       </div>
                     </div>
                   )}
                </div>
              )}

            </div>
          )}
        </>
      )}
    </div>
  );
}
