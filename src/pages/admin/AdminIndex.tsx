import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Target, Zap, Activity, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AdminIndex = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProfiles: 0,
    avgScore: 0,
    totalBlueprints: 0,
  });
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    // Para efectos del MVP, sacamos conteos brutos. En Fase >3 usaremos una RPC analítica.
    const [leadsRes, profilesRes, leadsDataRes, blueprintsRes] = await Promise.all([
      supabase.from("leads").select("score", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("blueprint_requests").select("id", { count: "exact" })
    ]);

    let avg = 0;
    if (leadsRes.data && leadsRes.data.length > 0) {
      const totalScore = leadsRes.data.reduce((acc, curr) => acc + (curr.score || 0), 0);
      avg = Math.round(totalScore / leadsRes.data.length);
    }

    setStats({
      totalLeads: leadsRes.count || 0,
      totalProfiles: profilesRes.count || 0,
      avgScore: avg,
      totalBlueprints: blueprintsRes.count || 0,
    });
    setLeadsList(leadsDataRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este prospecto y su análisis? Esto no se puede deshacer.")) return;
    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
      toast.success("Prospecto eliminado correctamente.");
      setExpandedLead(null);
      loadStats();
    } catch (error: any) {
      toast.error("Error al eliminar: " + error.message);
    }
  };

  const toggleFlag = async (id: string, field: 'is_analysis_generated' | 'is_analysis_sent', currentValue: boolean) => {
    try {
      const { error } = await supabase.from("leads").update({ [field]: !currentValue }).eq("id", id);
      if (error) throw error;
      setLeadsList(prev => prev.map(l => l.id === id ? { ...l, [field]: !currentValue } : l));
      toast.success("Estado actualizado");
    } catch (error: any) {
      toast.error("Error al actualizar: " + error.message);
    }
  };

  const downloadJson = (lead: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lead.diagnostic_answers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analisis_${lead.email}_${lead.id.substring(0,8)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const metricCards = [
    { title: "Diagnósticos (Leads)", value: stats.totalLeads, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Usuarios Registrados", value: stats.totalProfiles, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Viabilidad Promedio", value: stats.avgScore, icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", suffix: "/100" },
    { title: "Proyectos Activos", value: stats.totalBlueprints, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Status Global</h1>
        <p className="text-muted-foreground mt-1">Métricas en tiempo real de Bloque Cero.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((c, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${c.bg}`}>
              <c.icon className={`w-6 h-6 ${c.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{c.title}</p>
              <h3 className="text-3xl font-black">
                {loading ? "-" : c.value}{c.suffix || ""}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla detallada de diagnósticos (leads) */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm mt-8">
        <div className="p-6 border-b border-border/50 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Diagnósticos Recientes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Listado de evaluaciones realizadas por los usuarios.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Detalles</th>
                <th className="px-6 py-4 font-semibold text-center">Score de Viabilidad</th>
                <th className="px-6 py-4 font-semibold text-right">Agregado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Cargando diagnósticos...
                  </td>
                </tr>
              ) : leadsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Aún no hay diagnósticos registrados.
                  </td>
                </tr>
              ) : (
                leadsList.map((lead: any) => (
                  <React.Fragment key={lead.id}>
                    <tr 
                      className="border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer"
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{lead.name}</p>
                        <p className="text-muted-foreground">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {lead.whatsapp && <p>WA: {lead.whatsapp}</p>}
                        <p className="capitalize text-xs mt-1 px-2 py-0.5 bg-muted rounded-full inline-block">
                          Status: {lead.status}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-lg ${
                          (lead.score || 0) >= 75 ? "bg-green-500/10 text-green-500" :
                          (lead.score || 0) >= 50 ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-red-500/10 text-red-500"
                        }`}>
                          {lead.score || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground flex flex-col items-end gap-1">
                        <span>{new Date(lead.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}</span>
                        <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-70">
                          {expandedLead === lead.id ? "Ocultar Evaluación ▲" : "Ver Evaluación a 48H ▼"}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Fila expandida con detalles completos */}
                    {expandedLead === lead.id && (
                      <tr className="bg-muted/5 border-b border-border/50 shadow-inner">
                        <td colSpan={4} className="px-6 py-8">
                          
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Panel de Análisis de Emprendedor 
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadJson(lead);
                                }}
                                className="text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                              >
                                Descargar JSON
                              </button>
                            </div>
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleDelete(lead.id);
                              }}
                              className="text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4 cursor-pointer" />
                              Eliminar Prospecto
                            </button>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            
                            {/* Inputs del Usuario */}
                            <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm">
                              <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" /> 1. Parámetros Ingresados (Inputs)
                              </h4>
                              {lead.diagnostic_answers?.n8n_payload?.business_profile ? (
                                <ul className="space-y-4 text-sm">
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">País:</span> 
                                    <span className="font-medium text-foreground col-span-2">{lead.diagnostic_answers.n8n_payload.country}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Tipo de Negocio:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.type}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Audiencia:</span> 
                                    <span className="font-medium text-foreground uppercase col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.audience}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Canal de Venta:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.channel}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Ticket Estimado:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.ticket}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 pb-2">
                                    <span className="text-muted-foreground col-span-1">Etapa Actual:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.etapa}</span>
                                  </li>
                                  
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Tiempo Disponible:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.tiempo}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Dependencia Logística:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.logistics_dependency}</span>
                                  </li>
                                  <li className="grid grid-cols-3 gap-2 border-b border-border/20 pb-2">
                                    <span className="text-muted-foreground col-span-1">Dependencia Pagos:</span> 
                                    <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.payments_dependency}</span>
                                  </li>
                                  <li className="grid grid-cols-1 gap-2 pb-2 mt-4">
                                    <span className="text-muted-foreground font-semibold block mb-1">Dolores Principales:</span> 
                                    <div className="flex flex-wrap gap-2">
                                      {(lead.diagnostic_answers.n8n_payload.business_profile.dolores || []).map((pain: string, idx: number) => (
                                        <span key={idx} className="bg-muted px-2 py-1 rounded-md text-xs font-medium text-foreground/80 capitalize">{pain.replace(/_/g, ' ')}</span>
                                      ))}
                                    </div>
                                  </li>
                                  
                                  <li className="pt-4 mt-4 border-t border-border/50">
                                    <span className="text-primary font-semibold block mb-2">💡 Idea a Evaluar:</span>
                                    <p className="p-4 bg-muted/30 rounded-xl border border-border/50 text-foreground/90 italic leading-relaxed">
                                      "{lead.diagnostic_answers.n8n_payload.business_profile.business_idea}"
                                    </p>
                                  </li>

                                  {/* Checkboxes Administrativos */}
                                  <li className="pt-4 mt-4 border-t border-border/50 flex flex-col gap-3">
                                    <span className="text-primary font-semibold block mb-2">⚙️ Controles de Operación (48h):</span>
                                    
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${lead.is_analysis_generated ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background group-hover:border-primary/50'}`}>
                                        {lead.is_analysis_generated && <CheckCircle className="w-3.5 h-3.5" />}
                                      </div>
                                      <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={lead.is_analysis_generated} 
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          toggleFlag(lead.id, 'is_analysis_generated', lead.is_analysis_generated);
                                        }} 
                                      />
                                      <span className="text-sm font-medium text-foreground select-none">Análisis Generado por el Coach</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${lead.is_analysis_sent ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background group-hover:border-primary/50'}`}>
                                        {lead.is_analysis_sent && <CheckCircle className="w-3.5 h-3.5" />}
                                      </div>
                                      <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={lead.is_analysis_sent} 
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          toggleFlag(lead.id, 'is_analysis_sent', lead.is_analysis_sent);
                                        }} 
                                      />
                                      <span className="text-sm font-medium text-foreground select-none">Análisis Enviado al Prospecto</span>
                                    </label>
                                  </li>
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No hay detalles de inputs resguardados para este usuario (Lead antiguo).</p>
                              )}
                            </div>

                            {/* Outputs del Scoring */}
                            <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden">
                              <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> 2. Resultado de Evaluación: Métrica Big 6
                              </h4>
                              
                              <div className="flex gap-4 mb-6">
                                <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold shadow-sm">
                                  Recomienda: {lead.diagnostic_answers?.recommended_block || "N/A"}
                                </span>
                                {lead.diagnostic_answers?.verdict && (
                                  <span className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-foreground shadow-sm">
                                    Dictamen: {lead.diagnostic_answers.verdict}
                                  </span>
                                )}
                              </div>

                              {lead.diagnostic_answers?.big6 ? (
                                <div className="space-y-4">
                                  {lead.diagnostic_answers.big6.map((m: any, idx: number) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:items-start text-sm p-4 bg-muted/10 rounded-xl border border-border/50">
                                      <div className="flex items-center gap-2 min-w-[200px]">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                            m.signal === 'Alto' ? 'bg-green-500' :
                                            m.signal === 'Medio' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                          }`} />
                                        <span className="font-bold text-foreground tracking-tight">{m.name}</span>
                                        <span className="text-xs font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded-md border border-border/50">
                                          {m.score}/5
                                        </span>
                                      </div>
                                      <span className="text-muted-foreground text-xs leading-relaxed flex-1 pt-1 sm:pt-0 sm:pl-4 sm:border-l sm:border-border/50">
                                        {m.rationale}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 border border-dashed border-red-500/50 bg-red-500/5 rounded-xl text-red-500/80 text-sm">
                                  ⚠️ Faltan Respuestas de los Big 6. Este diagnóstico fue generado en una versión anterior al Motor McKinsey/BCG o no completó la sincronización.
                                </div>
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminIndex;
