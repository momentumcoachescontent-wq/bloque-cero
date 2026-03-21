import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Target, Zap, Activity } from "lucide-react";

const AdminIndex = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProfiles: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Para efectos del MVP, sacamos conteos brutos. En Fase >3 usaremos una RPC analítica.
      const [leadsRes, profilesRes] = await Promise.all([
        supabase.from("leads").select("score", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" })
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

      <div className="bg-muted/50 rounded-2xl p-8 border border-dashed border-border flex items-center justify-center text-center mt-12">
        <div>
          <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-muted-foreground mb-1">Métricas detalladas en construcción</h3>
          <p className="text-sm text-muted-foreground/70">
            Pronto podrás visualizar conversiones semanales, uso de tokens de IA e ingresos desde Stripe aquí.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
