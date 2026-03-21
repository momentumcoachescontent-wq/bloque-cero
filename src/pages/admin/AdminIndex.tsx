import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Target, Zap, Activity } from "lucide-react";

const AdminIndex = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProfiles: 0,
    avgScore: 0,
  });
  const [leadsList, setLeadsList] = useState<any[]>([]);
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
                  <tr key={lead.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
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
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                  </tr>
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
