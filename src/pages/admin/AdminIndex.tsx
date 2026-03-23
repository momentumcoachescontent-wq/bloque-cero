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
    const [leadsRes, profilesRes, leadsDataRes, blueprintsRes, blueprintsDataRes] = await Promise.all([
      supabase.from("leads").select("score", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("blueprint_requests").select("id", { count: "exact" }),
      supabase.from("blueprint_requests").select("*").order("created_at", { ascending: false })
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
    
    // Unificar eventos cronológicamente (Omnichannel log feed)
    const radarItems = (leadsDataRes.data || []).map(r => ({ ...r, event_type: 'radar', event_date: r.created_at }));
    const blueprintItems = (blueprintsDataRes.data || []).map(b => {
      // Intentar extraer datos del cliente del lead original si existen en leadsDataRes
      const originalLead = leadsDataRes.data?.find(l => l.id === b.lead_id) || {};
      return { 
        ...b, 
        event_type: 'blueprint', 
        event_date: b.created_at,
        client_name: b.diagnostic_answers?.name || originalLead.name || 'Cliente de Blueprint',
        client_email: b.diagnostic_answers?.email || originalLead.email || 'N/A',
        project_name: b.diagnostic_answers?.business_name || originalLead.business_name || originalLead.diagnostic_answers?.business_name || 'Proyecto Blueprint'
      };
    });
    
    const unifiedList = [...radarItems, ...blueprintItems].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
    
    setLeadsList(unifiedList);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDelete = async (id: string, type: 'radar' | 'blueprint') => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este ${type === 'blueprint'? 'proyecto':'prospecto'}? Esto no se puede deshacer.`)) return;
    try {
      const table = type === 'radar' ? "leads" : "blueprint_requests";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      toast.success("Registro eliminado correctamente.");
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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lead.diagnostic_answers || {}, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analisis_${lead.id.substring(0,8)}.json`);
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

      {/* Tabla detallada Omnicanal (Log de Actividad Global) */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm mt-8">
        <div className="p-6 border-b border-border/50 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Feed de Operaciones Recientes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Listado omnicanal de evaluaciones de viabilidad y proyectos Blueprint activos.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Proyecto / Cliente</th>
                <th className="px-6 py-4 font-semibold">Status Activo</th>
                <th className="px-6 py-4 font-semibold text-center">Score Relativo</th>
                <th className="px-6 py-4 font-semibold text-right">Agregado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Cargando feed de operaciones...
                  </td>
                </tr>
              ) : leadsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Aún no hay operaciones registradas en los servidores.
                  </td>
                </tr>
              ) : (
                leadsList.map((lead: any) => (
                  <React.Fragment key={lead.id}>
                    <tr 
                      className={`border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer ${lead.event_type === 'blueprint' ? 'bg-purple-500/5' : ''}`}
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                    >
                      <td className="px-6 py-4">
                        {lead.event_type === 'blueprint' ? (
                           <>
                             <div className="flex items-center gap-1.5 mb-1 text-purple-500 font-bold text-[10px] uppercase tracking-wider"><Zap className="w-3 h-3" /> Fase Blueprint</div>
                             <p className="font-bold text-foreground truncate max-w-[200px] xl:max-w-[300px]">{lead.project_name}</p>
                             <p className="text-muted-foreground text-xs truncate max-w-[200px] xl:max-w-[300px]">{lead.client_name} - {lead.client_email}</p>
                           </>
                        ) : (
                           <>
                             <div className="flex items-center gap-1.5 mb-1 text-primary font-bold text-[10px] uppercase tracking-wider"><Target className="w-3 h-3" /> Radar de Idea</div>
                             <p className="font-bold text-foreground truncate max-w-[200px] xl:max-w-[300px]" title={lead.diagnostic_answers?.n8n_payload?.business_profile?.business_idea || lead.business_name || lead.diagnostic_answers?.business_name || "Proyecto Escáner"}>
                               {lead.diagnostic_answers?.n8n_payload?.business_profile?.business_idea || lead.business_name || lead.diagnostic_answers?.business_name || "Proyecto Escáner"}
                             </p>
                             <p className="text-muted-foreground text-xs truncate max-w-[200px] xl:max-w-[300px]">{lead.name} - {lead.email}</p>
                           </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {lead.event_type === 'blueprint' ? (
                           <>
                             <p className="font-medium text-foreground text-xs">Ingeniería Documental</p>
                             <p className={`capitalize text-xs mt-1 px-2 py-0.5 rounded-full inline-block font-medium ${lead.status === 'completed' || lead.progress_day >= 7 ? 'bg-green-500/20 text-green-500' : 'bg-purple-500/20 text-purple-500'}`}>
                               Estado: {lead.status === 'completed' || lead.progress_day >= 7 ? 'Archivos Generados' : `Día ${lead.progress_day} de 7`}
                             </p>
                           </>
                        ) : (
                           <>
                             {lead.whatsapp && <p className="text-xs">WA: {lead.whatsapp}</p>}
                             <p className="capitalize text-xs mt-1 px-2 py-0.5 bg-muted rounded-full inline-block text-foreground/80 font-medium whitespace-nowrap">
                               Estado: {lead.status}
                             </p>
                           </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {lead.event_type === 'blueprint' ? (
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-lg bg-border/40 text-muted-foreground/50 border border-border/50">
                            -
                          </span>
                        ) : (
                          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-lg ${
                            (lead.score || 0) >= 75 ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                            (lead.score || 0) >= 50 ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                            "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}>
                            {lead.score || 0}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground flex flex-col items-end gap-1">
                        <span className="text-xs">{new Date(lead.event_date).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}</span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 opacity-90 transition-colors ${lead.event_type === 'blueprint' ? 'text-purple-500 hover:text-purple-400' : 'text-primary hover:text-primary/70'}`}>
                          {expandedLead === lead.id ? "Ocultar " + (lead.event_type === 'blueprint' ? 'Blueprint ▲' : 'Datos ▼') : "Inspeccionar Data ▼"}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Fila expandida con detalles completos */}
                    {expandedLead === lead.id && (
                      <tr className="bg-muted/5 border-b border-border/50 shadow-inner">
                        <td colSpan={4} className="px-6 py-8">
                          
                          {lead.event_type === 'blueprint' ? (
                            // EXPANDED VIEW FOR BLUEPRINTS
                            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300 relative">
                               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
                               <div className="flex justify-between items-center mb-2 z-10">
                                <div className="flex items-center gap-4">
                                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-500" />
                                    Esquema Operativo Blueprint
                                  </h3>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadJson(lead);
                                    }}
                                    className="text-purple-500 hover:text-foreground bg-purple-500/20 hover:bg-purple-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 uppercase tracking-wide"
                                  >
                                    Extraer JSON DB
                                  </button>
                                </div>
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleDelete(lead.id, 'blueprint');
                                  }}
                                  className="text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4 cursor-pointer" />
                                  Desmantelar Nodo
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
                                <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border border-border/80 shadow-sm relative overflow-hidden">
                                  <h4 className="text-sm font-bold uppercase tracking-wide text-purple-500 border-b border-border/80 pb-3 mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> 1. Entregables Solicitados
                                  </h4>
                                  <ul className="space-y-3 mt-4">
                                    <li className="flex items-center text-sm gap-2">
                                       {lead.format_pdf ? <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle className="w-3 h-3"/></span> : <span className="w-4 h-4 rounded-full border border-border/50 shrink-0"/>}
                                       <span className={lead.format_pdf ? "text-foreground font-medium" : "text-muted-foreground"}>Blueprint Arquitectónico Documentado</span>
                                    </li>
                                    <li className="flex items-center text-sm gap-2">
                                       {lead.format_presentation ? <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle className="w-3 h-3"/></span> : <span className="w-4 h-4 rounded-full border border-border/50 shrink-0"/>}
                                       <span className={lead.format_presentation ? "text-foreground font-medium" : "text-muted-foreground"}>Pitch Deck Definitivo</span>
                                    </li>
                                    <li className="flex items-center text-sm gap-2">
                                       {lead.format_infographic ? <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle className="w-3 h-3"/></span> : <span className="w-4 h-4 rounded-full border border-border/50 shrink-0"/>}
                                       <span className={lead.format_infographic ? "text-foreground font-medium" : "text-muted-foreground"}>Infografía de Estrategia Densa</span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border border-border/80 shadow-sm flex flex-col justify-center text-center items-center h-full">
                                    <Zap className="w-8 h-8 text-purple-500 mb-3 opacity-20" />
                                    <p className="text-sm text-foreground/80 leading-relaxed max-w-[80%]">
                                      Este proyecto ha abandonado la etapa Radar. El control logístico de los documentos a entregar ocurre permanentemente en el <strong className="text-primary hover:text-purple-400 cursor-pointer underline decoration-primary/30 underline-offset-4">Control de Entregables (Fulfillment)</strong>.
                                    </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // EXPANDED VIEW FOR RADAR LEADS
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 relative z-10">
                              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
                              <div className="flex justify-between items-center mb-6 z-10 relative">
                                <div className="flex items-center gap-4">
                                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Esquema Analítico Radar 
                                  </h3>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadJson(lead);
                                    }}
                                    className="text-primary hover:text-foreground bg-primary/20 hover:bg-primary/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 uppercase tracking-wide"
                                  >
                                    Extraer JSON DB
                                  </button>
                                </div>
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleDelete(lead.id, 'radar');
                                  }}
                                  className="text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4 cursor-pointer" />
                                  Depurar Entidad
                                </button>
                              </div>

                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 z-10 relative">
                                
                                {/* Inputs del Usuario */}
                                <div className="bg-background/90 backdrop-blur-md rounded-2xl p-6 border border-border/80 shadow-sm">
                                  <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> 1. Input Dimensional
                                  </h4>
                                  {lead.diagnostic_answers?.n8n_payload?.business_profile ? (
                                    <ul className="space-y-4 text-sm">
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">País:</span> 
                                        <span className="font-medium text-foreground col-span-2">{lead.diagnostic_answers.n8n_payload.country}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Tipo de Negocio:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.type}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Audiencia:</span> 
                                        <span className="font-medium text-foreground uppercase col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.audience}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Canal de Venta:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.channel}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Ticket Estimado:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.ticket}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 pb-2">
                                        <span className="text-muted-foreground col-span-1">Etapa Actual:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.etapa}</span>
                                      </li>
                                      
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Tiempo Disponible:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.tiempo}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Dependencia Logística:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.logistics_dependency}</span>
                                      </li>
                                      <li className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2">
                                        <span className="text-muted-foreground col-span-1">Dependencia Pagos:</span> 
                                        <span className="font-medium text-foreground capitalize col-span-2">{lead.diagnostic_answers.n8n_payload.business_profile.payments_dependency}</span>
                                      </li>
                                      <li className="grid grid-cols-1 gap-2 pb-2 mt-4">
                                        <span className="text-muted-foreground font-semibold block mb-1">Dolores Principales:</span> 
                                        <div className="flex flex-wrap gap-2">
                                          {(lead.diagnostic_answers.n8n_payload.business_profile.dolores || []).map((pain: string, idx: number) => (
                                            <span key={idx} className="bg-muted px-2 py-1 rounded-md text-[10px] font-bold tracking-wider text-foreground uppercase border border-border/50">{pain.replace(/_/g, ' ')}</span>
                                          ))}
                                        </div>
                                      </li>
                                      
                                      <li className="pt-4 mt-4 border-t border-border/50">
                                        <span className="text-primary font-semibold block mb-2">💡 Postulado Orgánico:</span>
                                        <p className="p-4 bg-muted/20 rounded-xl border border-border/50 text-foreground/90 italic leading-relaxed text-sm">
                                          "{lead.diagnostic_answers.n8n_payload.business_profile.business_idea}"
                                        </p>
                                      </li>

                                      {/* Checkboxes Administrativos */}
                                      <li className="pt-4 mt-4 border-t border-border/50 flex flex-col gap-3">
                                        <span className="text-primary font-semibold block mb-2">⚙️ Controles de Operación (Radar):</span>
                                        
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${lead.is_analysis_generated ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'border-input bg-background group-hover:border-primary/50'}`}>
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
                                          <span className="text-sm font-medium text-foreground select-none">Dictamen táctico procesado por el Estructurador</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${lead.is_analysis_sent ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'border-input bg-background group-hover:border-primary/50'}`}>
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
                                          <span className="text-sm font-medium text-foreground select-none">Comunicación operativa enviada al cliente</span>
                                        </label>
                                      </li>
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">Cápsula de datos no identificada. (Arquitectura de registro pre-v2).</p>
                                  )}
                                </div>

                                {/* Outputs del Scoring */}
                                <div className="bg-background/90 backdrop-blur-md rounded-2xl p-6 border border-border/80 shadow-sm relative overflow-hidden">
                                  <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> 2. Resultado Estructural: Big 6
                                  </h4>
                                  
                                  <div className="flex gap-4 mb-6">
                                    <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold shadow-sm">
                                      Dirección Táctica: {lead.diagnostic_answers?.recommended_block || "En Suspenso"}
                                    </span>
                                    {lead.diagnostic_answers?.verdict && (
                                      <span className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-foreground shadow-sm">
                                        Fallo Central: {lead.diagnostic_answers.verdict}
                                      </span>
                                    )}
                                  </div>

                                  {lead.diagnostic_answers?.big6 ? (
                                    <div className="space-y-4">
                                      {lead.diagnostic_answers.big6.map((m: any, idx: number) => (
                                        <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:items-start text-sm p-4 bg-muted/10 rounded-xl border border-border/50 transition-colors hover:bg-muted/20">
                                          <div className="flex items-center gap-2 min-w-[200px]">
                                            <div className={`w-2 h-2 rounded-full shadow-sm flex-shrink-0 ${
                                                m.signal === 'Alto' ? 'bg-green-500 shadow-green-500/50' :
                                                m.signal === 'Medio' ? 'bg-yellow-500 shadow-yellow-500/50' :
                                                'bg-red-500 shadow-red-500/50'
                                              }`} />
                                            <span className="font-bold text-foreground tracking-tight">{m.name}</span>
                                            <span className="text-xs font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded-md border border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
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
                                      ⚠️ Faltan Respuestas de los Big 6. Este diagnóstico fue analizado mediante heurística antigua.
                                    </div>
                                  )}
                                </div>

                              </div>
                            </div>
                          )}
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
