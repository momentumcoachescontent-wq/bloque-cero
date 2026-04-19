import React, { useState } from "react";
import { Users, Target, Zap, Activity } from "lucide-react";
import { useGlobalMetrics } from "@/hooks/useGlobalMetrics";
import { useOmniFeed, UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { AdminRadarExpanded } from "@/components/admin/AdminRadarExpanded";
import { AdminBlueprintExpanded } from "@/components/admin/AdminBlueprintExpanded";
import ImplementationStatusPanel from "@/components/admin/ImplementationStatusPanel";
import ImplementationWorkstreamsTable from "@/components/admin/ImplementationWorkstreamsTable";
import CrmTransitionRulesPanel from "@/components/admin/CrmTransitionRulesPanel";
import OperationalReadinessPanel from "@/components/admin/OperationalReadinessPanel";
import OperationalActionsPanel from "@/components/admin/OperationalActionsPanel";
import OperationalPayloadInspector from "@/components/admin/OperationalPayloadInspector";
import OperationalTimelinePanel from "@/components/admin/OperationalTimelinePanel";
import OperationalLeadConsole from "@/components/admin/OperationalLeadConsole";

const AdminIndex = () => {
  const { stats, loadingMetrics, refetchMetrics } = useGlobalMetrics();
  const { feed, loadingFeed, refetchFeed, deleteItem, toggleRadarFlag } = useOmniFeed();
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const loading = loadingMetrics || loadingFeed;

  const handleDelete = async (id: string, type: 'radar' | 'blueprint') => {
    const success = await deleteItem(id, type);
    if (success) {
      setExpandedLead(null);
      refetchMetrics();
    }
  };

  const toggleFlag = async (id: string, field: 'is_analysis_generated' | 'is_analysis_sent', currentValue: boolean) => {
    await toggleRadarFlag(id, field, currentValue);
  };

  const downloadJson = (lead: UnifiedQueueItem) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lead.diagnostic_answers || {}, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analisis_${lead.id.substring(0,8)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const metricCards = [
    { title: "Blueprint Intake", value: stats.totalLeads, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
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

      <ImplementationStatusPanel />

      <ImplementationWorkstreamsTable />

      <CrmTransitionRulesPanel />

      <OperationalReadinessPanel feed={feed} />

      <OperationalActionsPanel feed={feed} />

      <OperationalPayloadInspector feed={feed} />

      <OperationalTimelinePanel feed={feed} />

      <OperationalLeadConsole feed={feed} />

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
          <p className="text-sm text-muted-foreground mt-1">Listado omnicanal de ingresos y entregas activas de Blueprint.</p>
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
              ) : feed.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Aún no hay operaciones registradas en los servidores.
                  </td>
                </tr>
              ) : (
                feed.map((lead: UnifiedQueueItem) => (
                  <React.Fragment key={lead.id}>
                    <tr 
                      className={`border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer ${lead.event_type === 'blueprint' ? 'bg-purple-500/5' : ''}`}
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                    >
                      <td className="px-6 py-4">
                        {lead.event_type === 'blueprint' ? (
                           <>
                             <div className="flex items-center gap-1.5 mb-1 text-purple-500 font-bold text-[10px] uppercase tracking-wider"><Zap className="w-3 h-3" /> Blueprint Delivery</div>
                             <p className="font-bold text-foreground truncate max-w-[200px] xl:max-w-[300px]">{lead.project_name}</p>
                             <p className="text-muted-foreground text-xs truncate max-w-[200px] xl:max-w-[300px]">{lead.client_name} - {lead.client_email}</p>
                           </>
                        ) : (
                           <>
                             <div className="flex items-center gap-1.5 mb-1 text-primary font-bold text-[10px] uppercase tracking-wider"><Target className="w-3 h-3" /> Blueprint Intake</div>
                             <p className="font-bold text-foreground truncate max-w-[200px] xl:max-w-[300px]" title={lead.diagnostic_answers?.n8n_payload?.business_profile?.business_idea || lead.business_name || lead.diagnostic_answers?.business_name || "Ingreso de Blueprint"}>
                               {lead.diagnostic_answers?.n8n_payload?.business_profile?.business_idea || lead.business_name || lead.diagnostic_answers?.business_name || "Ingreso de Blueprint"}
                             </p>
                             <p className="text-muted-foreground text-xs truncate max-w-[200px] xl:max-w-[300px]">{lead.name} - {lead.email}</p>
                           </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {lead.event_type === 'blueprint' ? (
                           <>
                             <p className="font-medium text-foreground text-xs">Entrega en proceso</p>
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
                          {expandedLead === lead.id ? "Ocultar " + (lead.event_type === 'blueprint' ? 'Delivery ▲' : 'Intake ▲') : "Inspeccionar caso ▼"}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Fila expandida con detalles completos */}
                    {expandedLead === lead.id && (
                      <tr className="bg-muted/5 border-b border-border/50 shadow-inner">
                        <td colSpan={4} className="px-6 py-8">
                          
                          {lead.event_type === 'blueprint' ? (
                            <AdminBlueprintExpanded 
                              lead={lead} 
                              downloadJson={downloadJson} 
                              handleDelete={handleDelete} 
                            />
                          ) : (
                            <AdminRadarExpanded 
                              lead={lead} 
                              downloadJson={downloadJson} 
                              handleDelete={handleDelete} 
                              toggleFlag={toggleFlag} 
                            />
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
