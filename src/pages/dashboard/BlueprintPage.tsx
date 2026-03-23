import { useState, useEffect } from "react";
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
    id: "unfair_advantage",
    question: "Foso Defensivo (Unfair Advantage)",
    description: "¿Qué componente de tu operación o producto es casi imposible de colar o replicar por un competidor que tenga 10x más presupuesto que tú?",
    ai_suggestion: "Mi ventaja radica en la propiedad exclusiva sobre la distribución de contenido en un nicho altamente fragmentado, permitiendo costo de adquisición cero."
  },
  {
    id: "unit_economics",
    question: "Límites de Viabilidad",
    description: "Si ignoramos el 'costo de desarrollo', ¿cuánto te cuenta servir a UN cliente adicional (Cost of Delivery)?",
    ai_suggestion: "El costo marginal de servir a un cliente nuevo es de $0 (puro software), pero el soporte manual representa $50 por mes por usuario activo."
  },
  {
    id: "bottleneck",
    question: "Escalabilidad Cuántica",
    description: "Si multiplicaras tus ventas x10 mañana por un efecto viral, ¿qué área exacta de tu operación se rompería primero?",
    ai_suggestion: "Definitivamente el Onboarding manual y la etapa de Customer Success. La tecnología aguanta, pero no tenemos capacidad para incorporar 100 usuarios diarios de forma personalizada."
  },
  {
    id: "anti_segment",
    question: "Anti-Segmento (Focus Láser)",
    description: "Define a tu anti-cliente. ¿A quién NO le venderías jamás tu producto o servicio, aunque tuviera el dinero en la mano para pagarlo de contado?",
    ai_suggestion: "A emprendedores que buscan una 'solución mágica' sin tener siquiera un MVP validado o ingresos primarios. Solo trabajamos con negocios en marcha que buscan optimización."
  }
];

export default function BlueprintWizard() {
  const { profile } = useAuth();
  
  // State Machine
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data
  const [leads, setLeads] = useState<any[]>([]);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  
  // Form State
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedFormat, setSelectedFormat] = useState<string>("");

  useEffect(() => {
    fetchInitialState();
  }, [profile]);

  const fetchInitialState = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      
      // 1. Revisar si ya hay un request activo
      const { data: requestData, error: reqError } = await supabase
        .from('blueprint_requests')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (requestData) {
        setExistingRequest(requestData);
        // Si ya hay un request, saltar a Dashboard (Step 4)
        setStep(4);
        return;
      }

      // 2. Si no hay, buscar sus leads (ideas previas del Radar 1)
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('email', profile.email)
        .order('created_at', { ascending: false });

      if (leadsData && leadsData.length > 0) {
        setLeads(leadsData);
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
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
      setExistingRequest(data);
      setStep(4);
      
      // Simular trigger n8n a futuro (Añadir un delay artificial y avanzar UI sería opcional)
    } catch (err) {
      console.error(err);
      toast.error("Error al despachar el Blueprint.");
    } finally {
      setSubmitting(false);
    }
  };

  const simulateProgress = async () => {
    // Solo para propositos de demo
    if (!existingRequest) return;
    const nextDay = (existingRequest.progress_day || 1) + 2;
    const nextStatus = nextDay >= 7 ? 'delivered' : existingRequest.status;
    
    const { data } = await supabase
      .from('blueprint_requests')
      .update({ progress_day: nextDay, status: nextStatus })
      .eq('id', existingRequest.id)
      .select()
      .single();
      
    if (data) setExistingRequest(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header General */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blueprint Operativo</h1>
        <p className="text-muted-foreground">
          {step < 4 
            ? "Elevaremos tu diagnóstico cero a un nivel de consultoría Big-6 para estructurar tu negocio."
            : "Monitorea la producción algorítmica de tu plano táctico."}
        </p>
      </div>

      {/* STEP 1: Selección de Idea */}
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
                {leads.map(lead => (
                  <div 
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedLeadId === lead.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <h3 className="font-semibold text-lg">{lead.business_name || "Proyecto Sin Nombre"}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {lead.idea_description || "Descrito en tu diagnóstico inicial."}
                    </p>
                  </div>
                ))}
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

      {/* STEP 2: Deep Diagnostic Big-6 */}
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
                      <Wand2 className="w-3 h-3" /> Asistente IA
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

      {/* STEP 3: Selector de Formato */}
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

      {/* STEP 4/5: Dashboard de Rastreo (Timeline) */}
      {step === 4 && existingRequest && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="bg-card/30 border border-primary/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Construyendo tu Imperio Lógico</h2>
              <p className="text-muted-foreground mb-10 max-w-xl">
                Nuestro sistema distribuido de IA (N8N Cluster) está ensamblando tu Blueprint de Negocio. Este proceso involucra análisis de datos cruzados y auditoría de viabilidad a 7 días.
              </p>

              {/* TIMELINE HORIZONTAL */}
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
              
              {/* ACCIÓN (DEBUG TEMP) */}
              {existingRequest.progress_day < 7 && (
                <div className="flex justify-end mt-12 pt-6">
                   <Button variant="outline" size="sm" onClick={simulateProgress} className="text-xs opacity-50 hover:opacity-100">
                     Avanzar Timeline (Dev Mode)
                   </Button>
                </div>
              )}
            </div>
          </div>

          {/* SKELETON MOCK / REAL DELIVERY VIEW */}
          {existingRequest.progress_day < 7 ? (
            <div className="border border-border/50 rounded-2xl p-8 bg-card shadow-sm relative overflow-hidden h-[400px]">
               <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50 mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">En Elaboración (Cascarón)</p>
               </div>
               
               <div className="grid grid-cols-3 gap-4 opacity-20 grayscale pointer-events-none mb-6">
                 <div className="h-20 bg-muted rounded-xl"></div>
                 <div className="h-20 bg-muted rounded-xl"></div>
                 <div className="h-20 bg-muted rounded-xl"></div>
               </div>
               
               <div className="grid grid-cols-5 gap-4 opacity-20 grayscale pointer-events-none">
                 <div className="h-64 bg-muted rounded-xl col-span-1"></div>
                 <div className="h-64 bg-muted rounded-xl col-span-1"></div>
                 <div className="h-64 bg-muted rounded-xl col-span-1"></div>
                 <div className="h-64 bg-muted rounded-xl col-span-1"></div>
                 <div className="h-64 bg-muted rounded-xl col-span-1"></div>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-primary/20 rounded-2xl p-8 bg-card shadow-lg bg-gradient-to-b from-primary/5 to-transparent">
                 <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                       <CheckCircle2 className="w-6 h-6" /> Blueprint Entregado
                     </h3>
                     <p className="text-muted-foreground text-sm mt-1">El modelo está listo para descargar en los formatos seleccionados.</p>
                   </div>
                   <div className="flex gap-3">
                      {existingRequest.format_pdf && (
                        <Button variant="outline" className="gap-2">
                          <FileDown className="w-4 h-4" /> PDF
                        </Button>
                      )}
                      {existingRequest.format_presentation && (
                        <Button variant="outline" className="gap-2">
                          <Presentation className="w-4 h-4" /> Pitch
                        </Button>
                      )}
                      {existingRequest.format_infographic && (
                        <Button variant="outline" className="gap-2">
                          <Aperture className="w-4 h-4" /> Infografía
                        </Button>
                      )}
                   </div>
                 </div>

                 {/* VISUAL CASCARON YA LLENO (Simulado para fines visuales en MVP) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background border border-border/50 p-6 rounded-xl">
                      <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Propuesta de Valor Core</p>
                      <p className="text-sm font-medium">Ofrecemos a los líderes una salida estructurada de la esclavitud operativa en 90 días mediante automatización garantizada.</p>
                    </div>
                    <div className="bg-background border border-border/50 p-6 rounded-xl">
                      <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Anti-Focus Segment</p>
                      <p className="text-sm font-medium">Jamás trabajaremos con freelancers sin equipo o soñadores que no tienen tracción monetaria previa comprobable.</p>
                    </div>
                 </div>
              </div>

              {/* STEP 6: FEEDBACK & QA */}
              <div className="bg-muted/30 border border-border/50 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12">
                 <h4 className="font-bold text-lg mb-2">Aseguramiento de Calidad (QA)</h4>
                 <p className="text-sm text-muted-foreground mb-6">
                   Como firma boutique, nuestro equipo de soporte prioriza resultados por encima del protocolo. ¿El Blueprint superó tus expectativas operativas?
                 </p>
                 <div className="flex justify-center gap-4">
                   <Button variant="secondary" className="bg-background">¡Mente Volada! (Satisfecho)</Button>
                   <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border border-red-500/20">Requiero Aclaración Operacional</Button>
                 </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
