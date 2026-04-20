import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { mapRowToBusinessBlueprint } from "@/types/businessBlueprints";
import { Target, AlertTriangle, Zap, Trash2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// --- Helpers para el score visual ---
const SCORE_COLOR = (s: number) =>
  s >= 75 ? "text-green-500" : s >= 50 ? "text-yellow-500" : "text-red-500";

const SCORE_BG = (s: number) =>
  s >= 75 ? "bg-green-500/10 border-green-500/25" : s >= 50 ? "bg-yellow-500/10 border-yellow-500/25" : "bg-red-500/10 border-red-500/25";

const DashboardIndex = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: blueprints = [], isLoading: loading } = useQuery({
    queryKey: ['business-blueprints-dashboard', profile?.email, profile?.id],
    queryFn: async () => {
      // Consultamos la tabla unificada que es la fuente de verdad ahora
      const { data, error } = await supabase
        .from("business_blueprints")
        .select("*")
        .or(`user_id.eq.${profile?.id},client_email.eq.${profile?.email}`)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error al cargar historial: " + error.message);
        return [];
      }

      return (data || []).map(mapRowToBusinessBlueprint);
    },
    enabled: !!profile?.email,
    staleTime: 1000 * 60 * 5,
  });

  // Auto-expandir el más reciente en la carga inicial
  useEffect(() => {
    if (blueprints.length > 0 && !expandedId) {
      setExpandedId(blueprints[0].id);
    }
  }, [blueprints]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Estás seguro de que deseas eliminar este análisis? Esto no se puede deshacer.")) return;

    try {
      // 1. Obtener lead asociado
      const { data: bp } = await supabase
        .from("business_blueprints")
        .select("source_lead_id")
        .eq("id", id)
        .single();

      // 2. Borrar blueprint
      const { error: bpError } = await supabase
        .from("business_blueprints")
        .delete()
        .eq("id", id);

      if (bpError) throw bpError;

      // 3. Borrar lead si existe
      if (bp?.source_lead_id) {
        await supabase.from("leads").delete().eq("id", bp.source_lead_id);
      }

      toast.success("Análisis eliminado correctamente");
      // Actualizar la caché en lugar de hacer refetch
      queryClient.setQueryData(['business-blueprints-dashboard', profile?.email, profile?.id], (oldData: any[]) => 
        oldData ? oldData.filter(b => b.id !== id) : []
      );
      if (expandedId === id) setExpandedId(null);
    } catch (error: any) {
      toast.error("Error al eliminar el análisis: " + error.message);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cabina de Mando, {profile?.full_name?.split(" ")[0] || "Fundador"}</h1>
          <p className="text-muted-foreground mt-1">
            El sistema de diseño para tu Imperio Lógico. Destruye la ineficiencia. Escala con arquitectura operativa.
          </p>
        </div>
        <a href="/diagnostico" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          + Nuevo Blueprint
        </a>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Bóveda Estratégica (Blueprints Activos)
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Auditoría en tiempo real de tu Perímetro Operativo. Revisa aquí la viabilidad estructural calculada por nuestro motor de inteligencia.
        </p>
        
        {loading ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border/50">
            <p className="text-sm text-muted-foreground animate-pulse">Sincronizando tu historial de Blueprints...</p>
          </div>
        ) : blueprints.length === 0 ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border/50">
            <p className="text-sm text-foreground mb-2 font-semibold">
              El miedo paraliza. La arquitectura libera.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Aún no has trazado tu plano operativo. No hay nada escalar si no hay cimientos que soportar.
            </p>
            <a href="/diagnostico" className="text-primary hover:underline text-sm font-bold uppercase tracking-wider">
              Trazar Perímetro Operativo →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {blueprints.map((bp) => {
              const isExpanded = expandedId === bp.id;
              const createdAt = new Date(bp.createdAt).toLocaleDateString("es-MX", {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={bp.id} className="border border-border/50 rounded-2xl overflow-hidden transition-all bg-background">
                  {/* HEADER (Resumen) */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : bp.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {createdAt}
                        </span>
                        {new Date().getTime() - new Date(bp.createdAt).getTime() < 1000 * 60 * 60 * 24 ? (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Reciente</span>
                        ) : null}
                      </div>
                      <h3 className="text-base font-bold text-foreground line-clamp-1">
                        Operación: {bp.businessName || "Blueprint sin núcleo registrado"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Recomendado: {bp.intakeRecommendation || "Pendiente de análisis"}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tensión Operativa</p>
                        <p className={`text-2xl font-black leading-none ${SCORE_COLOR(bp.intakeScore || 0)}`}>
                          {bp.intakeScore || 0}<span className="text-sm opacity-50">/100</span>
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
                      
                      <div className="flex justify-between items-center mb-4 gap-2">
                        <a 
                          href={`/dashboard/blueprint?id=${bp.publicId}`} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-bold border border-primary/20 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Ingresar a Bóveda de Rediseño
                        </a>
                        <Button variant="outline" size="sm" onClick={(e) => handleDelete(bp.id, e)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                          <Trash2 className="w-4 h-4 mr-2" /> Purgar Variante
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Score principal */}
                        <div className={`rounded-xl border p-6 flex flex-col items-center justify-center text-center shadow-sm ${SCORE_BG(bp.intakeScore || 0)}`}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Índice de Viabilidad</p>
                          <p className={`text-6xl font-black mb-1 ${SCORE_COLOR(bp.intakeScore || 0)}`}>
                            {bp.intakeScore || 0}<span className="text-3xl opacity-50">/100</span>
                          </p>
                          <div className="mt-4 px-4 py-2 bg-background/50 rounded-full text-xs font-semibold text-foreground border border-border/50 shadow-sm uppercase tracking-wider">
                            Veredicto: {bp.intakeRecommendation || "Sin dictamen"}
                          </div>
                        </div>

                        {/* Detalles (Riesgos y Wins) */}
                        <div className="space-y-4">
                          {(bp.intakePayload?.key_risks || bp.intakePayload?.n8n_payload?.diagnostic_results?.key_risks || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" /> Riesgos Pendientes
                              </p>
                              {(bp.intakePayload?.key_risks || bp.intakePayload?.n8n_payload?.diagnostic_results?.key_risks || []).slice(0, 2).map((r: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-background/80 border border-border/50 rounded-xl px-3 py-2 shadow-sm">
                                  <span className="text-yellow-400 flex-shrink-0 mt-0.5 text-xs">⚠</span>
                                  {r}
                                </div>
                              ))}
                            </div>
                          )}

                          {(bp.intakePayload?.quick_wins || bp.intakePayload?.n8n_payload?.diagnostic_results?.quick_wins || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                                <Zap className="w-3 h-3 text-green-500" /> Próximos Pasos (Quick Wins)
                              </p>
                              {(bp.intakePayload?.quick_wins || bp.intakePayload?.n8n_payload?.diagnostic_results?.quick_wins || []).slice(0, 2).map((w: string, i: number) => (
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
                      {(bp.intakePayload?.big6 || bp.intakePayload?.n8n_payload?.diagnostic_results?.big6) && (
                        <div className="mt-8 pt-6 border-t border-border/50">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Evaluación de Ejes Estratégicos (Big 6)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(bp.intakePayload?.big6 || bp.intakePayload?.n8n_payload?.diagnostic_results?.big6 || []).map((metric: any, idx: number) => (
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
                                    {metric.rationale || metric.logic}
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
