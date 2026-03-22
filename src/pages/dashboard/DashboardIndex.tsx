import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Target, AlertTriangle, Zap, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// --- Helpers para el score visual ---
const SCORE_COLOR = (s: number) =>
  s >= 75 ? "text-green-500" : s >= 50 ? "text-yellow-500" : "text-red-500";

const SCORE_BG = (s: number) =>
  s >= 75 ? "bg-green-500/10 border-green-500/25" : s >= 50 ? "bg-yellow-500/10 border-yellow-500/25" : "bg-red-500/10 border-red-500/25";

const DashboardIndex = () => {
  const { profile } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserDiagnostic = async () => {
    if (!profile?.email) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("email", profile.email)
      .order("created_at", { ascending: false });
      
    if (!error && data) {
      setLeads(data);
      if (data.length > 0) {
        setExpandedLead(data[0].id); // Auto-expandir el más reciente
      }
    } else {
      setLeads([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserDiagnostic();
  }, [profile]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Estás seguro de que deseas eliminar este análisis? Esto no se puede deshacer.")) return;

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Análisis eliminado correctamente");
      setLeads(prev => prev.filter(l => l.id !== id));
      if (expandedLead === id) setExpandedLead(null);
    } catch (error: any) {
      toast.error("Error al eliminar el análisis: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {profile?.full_name?.split(" ")[0] || "Emprendedor"}</h1>
          <p className="text-muted-foreground mt-1">
            Aquí podrás consultar y gestionar tu historial de análisis y diagnósticos.
          </p>
        </div>
        <a href="/diagnostico" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          + Nuevo Diagnóstico
        </a>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Mi Historial de Ideas (Diagnósticos)
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Consulta las evaluaciones previas y la factibilidad calculada por nuestro motor especializado. Dale clic a cualquiera para ver los detalles.
        </p>
        
        {loading ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border/50">
            <p className="text-sm text-muted-foreground animate-pulse">Sincronizando tu historial de diagnósticos...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Aún no has completado tu diagnóstico inicial.
            </p>
            <a href="/diagnostico" className="text-primary hover:underline text-sm font-bold">
              Iniciar Diagnóstico Gratis →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const isExpanded = expandedLead === lead.id;
              const createdAt = new Date(lead.created_at).toLocaleDateString("es-MX", {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={lead.id} className="border border-border/50 rounded-2xl overflow-hidden transition-all bg-background">
                  {/* HEADER (Resumen) */}
                  <div 
                    onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {createdAt}
                        </span>
                        {lead.status === "new" ? (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Reciente</span>
                        ) : null}
                      </div>
                      <h3 className="text-base font-bold text-foreground line-clamp-1">
                        Idea: {lead.diagnostic_answers?.n8n_payload?.business_profile?.business_idea || "Diagnóstico sin idea registrada"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Recomendado: {lead.diagnostic_answers?.recommended_block}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Score</p>
                        <p className={`text-2xl font-black leading-none ${SCORE_COLOR(lead.score || 0)}`}>
                          {lead.score || 0}<span className="text-sm opacity-50">/100</span>
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* CUERPO EXPANDIDO (Detalle) */}
                  {isExpanded && (
                    <div className="p-6 border-t border-border/50 bg-muted/5 animate-in slide-in-from-top-2 fade-in duration-200">
                      
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" onClick={(e) => handleDelete(lead.id, e)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar Variante
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Score principal */}
                        <div className={`rounded-xl border p-6 flex flex-col items-center justify-center text-center shadow-sm ${SCORE_BG(lead.score || 0)}`}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Score de Viabilidad</p>
                          <p className={`text-6xl font-black mb-1 ${SCORE_COLOR(lead.score || 0)}`}>
                            {lead.score || 0}<span className="text-3xl opacity-50">/100</span>
                          </p>
                          <div className="mt-4 px-4 py-2 bg-background/50 rounded-full text-xs font-semibold text-foreground border border-border/50 shadow-sm">
                            ⭐ Recomendado: {lead.diagnostic_answers?.recommended_block}
                          </div>
                          {lead.diagnostic_answers?.verdict && (
                            <div className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold border border-primary/20 shadow-sm">
                              Veredicto: {lead.diagnostic_answers.verdict}
                            </div>
                          )}
                        </div>

                        {/* Detalles (Riesgos y Wins) */}
                        <div className="space-y-4">
                          {(lead.diagnostic_answers?.key_risks || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" /> Riesgos Pendientes
                              </p>
                              {(lead.diagnostic_answers?.key_risks || []).slice(0, 2).map((r: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-background/80 border border-border/50 rounded-xl px-3 py-2 shadow-sm">
                                  <span className="text-yellow-400 flex-shrink-0 mt-0.5 text-xs">⚠</span>
                                  {r}
                                </div>
                              ))}
                            </div>
                          )}

                          {(lead.diagnostic_answers?.quick_wins || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                                <Zap className="w-3 h-3 text-green-500" /> Próximos Pasos (Quick Wins)
                              </p>
                              {(lead.diagnostic_answers?.quick_wins || []).slice(0, 2).map((w: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-background/80 border border-border/50 rounded-xl px-3 py-2 shadow-sm">
                                  <span className="text-green-400 flex-shrink-0 mt-0.5 text-xs">✓</span>
                                  {w}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BIG 6 METRICS */}
                      {lead.diagnostic_answers?.big6 && (
                        <div className="mt-8 pt-6 border-t border-border/50">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Evaluación de Ejes Estratégicos (Big 6)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lead.diagnostic_answers.big6.map((metric: any, idx: number) => (
                              <div key={idx} className="bg-background border border-border/50 rounded-xl p-4 flex flex-col justify-between hover:border-primary/30 transition-colors shadow-sm">
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold text-foreground leading-tight">{metric.name}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                      metric.signal === 'Alto' ? 'bg-green-500/10 text-green-500' :
                                      metric.signal === 'Medio' ? 'bg-yellow-500/10 text-yellow-500' :
                                      'bg-red-500/10 text-red-500'
                                    }`}>
                                      {metric.signal}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                                    {metric.rationale}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                  <span className="text-xs text-muted-foreground/70 font-medium tracking-wide">PUNTUACIÓN</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <div key={star} className={`w-2 h-2 rounded-full ${star <= metric.score ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardIndex;
