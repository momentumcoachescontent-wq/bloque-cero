import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Target, Zap, Activity } from "lucide-react";

const AdminIndex = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProfiles: 0,
    avgScore: 0,
  });
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Para efectos del MVP, sacamos conteos brutos. En Fase >3 usaremos una RPC analítica.
      const [leadsRes, profilesRes, leadsDataRes] = await Promise.all([
        supabase.from("leads").select("score", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("leads").select("*").order("created_at", { ascending: false })
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
      });
      setLeadsList(leadsDataRes.data || []);
      setLoading(false);
    }
    loadStats();
  }, []);

  const metricCards = [
    { title: "Diagnósticos (Leads)", value: stats.totalLeads, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Usuarios Registrados", value: stats.totalProfiles, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Viabilidad Promedio", value: stats.avgScore, icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", suffix: "/100" },
    { title: "Proyectos Activos", value: "0", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" }, // Mock para iteración futura
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
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}</span>
                        <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-70">
                          {expandedLead === lead.id ? "Ocultar Detalles ▲" : "Ver Detalles ▼"}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Fila expandida con detalles completos */}
                    {expandedLead === lead.id && (
                      <tr className="bg-muted/5 border-b border-border/50">
                        <td colSpan={4} className="px-6 py-8">
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Inputs del Usuario */}
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground border-b border-border pb-2 mb-4">
                                Datos Originales Ingresados (Inputs)
                              </h4>
                              {lead.diagnostic_answers?.n8n_payload?.business_profile ? (
                                <ul className="space-y-3 text-sm">
                                  <li><span className="text-muted-foreground">País:</span> <span className="font-medium text-foreground">{lead.diagnostic_answers.n8n_payload.country}</span></li>
                                  <li><span className="text-muted-foreground">Tipo de Negocio:</span> <span className="font-medium text-foreground capitalize">{lead.diagnostic_answers.n8n_payload.business_profile.type}</span></li>
                                  <li><span className="text-muted-foreground">Audiencia:</span> <span className="font-medium text-foreground uppercase">{lead.diagnostic_answers.n8n_payload.business_profile.audience}</span></li>
                                  <li><span className="text-muted-foreground">Canal de Venta:</span> <span className="font-medium text-foreground capitalize">{lead.diagnostic_answers.n8n_payload.business_profile.channel}</span></li>
                                  <li><span className="text-muted-foreground">Ticket Estimado:</span> <span className="font-medium text-foreground capitalize">{lead.diagnostic_answers.n8n_payload.business_profile.ticket}</span></li>
                                  <li><span className="text-muted-foreground">Etapa Actual:</span> <span className="font-medium text-foreground capitalize">{lead.diagnostic_answers.n8n_payload.business_profile.etapa}</span></li>
                                  
                                  <li className="pt-2"><span className="text-muted-foreground block mb-1">Idea de Negocio (Abierta):</span>
                                    <p className="p-3 bg-background rounded-xl border border-border/50 text-foreground/80 italic">
                                      "{lead.diagnostic_answers.n8n_payload.business_profile.business_idea}"
                                    </p>
                                  </li>
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No hay detalles de inputs resguardados.</p>
                              )}
                            </div>

                            {/* Outputs del Scoring */}
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground border-b border-border pb-2 mb-4">
                                Análisis de Viabilidad (Output)
                              </h4>
                              
                              <div className="flex gap-4 mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold">
                                  Recomienda: {lead.diagnostic_answers?.recommended_block || "N/A"}
                                </span>
                                {lead.diagnostic_answers?.verdict && (
                                  <span className="px-3 py-1 bg-background border border-border rounded-lg text-xs font-bold text-foreground">
                                    Veredicto: {lead.diagnostic_answers.verdict}
                                  </span>
                                )}
                              </div>

                              {lead.diagnostic_answers?.big6 && (
                                <div className="space-y-3 mt-4">
                                  {lead.diagnostic_answers.big6.map((m: any, idx: number) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-start text-sm p-3 bg-background rounded-xl border border-border/50">
                                      <div className="flex items-center gap-2 min-w-[200px]">
                                        <div className={`w-2 h-2 rounded-full ${
                                            m.signal === 'Alto' ? 'bg-green-500' :
                                            m.signal === 'Medio' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                          }`} />
                                        <span className="font-bold text-foreground">{m.name}</span>
                                        <span className="text-xs text-muted-foreground">({m.score}/5)</span>
                                      </div>
                                      <span className="text-muted-foreground text-xs align-top leading-relaxed">{m.rationale}</span>
                                    </div>
                                  ))}
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
