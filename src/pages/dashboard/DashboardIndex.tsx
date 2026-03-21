import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Target, AlertTriangle, Zap, CheckCircle } from "lucide-react";

// --- Helpers para el score visual ---
const SCORE_COLOR = (s: number) =>
  s >= 75 ? "text-green-500" : s >= 50 ? "text-yellow-500" : "text-red-500";

const SCORE_BG = (s: number) =>
  s >= 75 ? "bg-green-500/10 border-green-500/25" : s >= 50 ? "bg-yellow-500/10 border-yellow-500/25" : "bg-red-500/10 border-red-500/25";

const DashboardIndex = () => {
  const { profile } = useAuth();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserDiagnostic() {
      if (!profile?.email) return;
      
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("email", profile.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (!error && data) {
        setLead(data);
      }
      setLoading(false);
    }
    loadUserDiagnostic();
  }, [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {profile?.full_name?.split(" ")[0] || "Emprendedor"}</h1>
        <p className="text-muted-foreground mt-1">
          Aquí podrás consultar y gestionar tus análisis y diagnóstico.
        </p>
      </div>

      {/* Tarjeta del Freemium: Histórico de Diagnóstico */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Mi Radar de Idea (Diagnóstico)
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Consulta tu evaluación base y la factibilidad calculada por nuestro motor especializado.
        </p>
        
        {loading ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border/50">
            <p className="text-sm text-muted-foreground animate-pulse">Sincronizando tu historial de diagnósticos...</p>
          </div>
        ) : !lead || !lead.diagnostic_answers ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Aún no has completado tu diagnóstico inicial.
            </p>
            <a href="/diagnostico" className="text-primary hover:underline text-sm font-semibold">
              Iniciar Diagnóstico Gratis →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score principal */}
            <div className={`rounded-2xl border p-6 flex flex-col items-center justify-center text-center ${SCORE_BG(lead.score || 0)}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Score de Viabilidad
              </p>
              <p className={`text-6xl font-black mb-1 ${SCORE_COLOR(lead.score || 0)}`}>
                {lead.score || 0}<span className="text-3xl opacity-50">/100</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Complejidad: <span className="font-semibold text-foreground capitalize">{lead.diagnostic_answers?.complexity_level || "Desconocida"}</span>
              </p>
              <div className="mt-4 px-4 py-2 bg-background/50 rounded-full text-xs font-semibold text-foreground border border-border/50">
                ⭐ {lead.diagnostic_answers?.recommended_block}
              </div>
            </div>

            {/* Detalles (Riesgos y Wins) */}
            <div className="space-y-4">
              {(lead.diagnostic_answers?.key_risks || []).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" /> Riesgos Pendientes
                  </p>
                  {(lead.diagnostic_answers?.key_risks || []).slice(0, 2).map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-background/50 border border-border/50 rounded-xl px-3 py-2">
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
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-background/50 border border-border/50 rounded-xl px-3 py-2">
                      <span className="text-green-400 flex-shrink-0 mt-0.5 text-xs">✓</span>
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardIndex;
