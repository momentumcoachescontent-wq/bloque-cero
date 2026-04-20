import React, { useEffect, useState } from "react";
import { Activity, Zap, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type Stats = Database['public']['Views']['vw_orchestration_metrics']['Row'];

export const OrchestrationHealthPanel = () => {
  const [metrics, setMetrics] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('vw_orchestration_metrics')
          .select('*')
          .single();
        
        if (!error && data) {
          setMetrics(data);
        }
      } catch (e) {
        console.error("Health panel fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Suscripción a cambios en logs para refrescar (opcional, pero potente para la demo)
    const channel = supabase
      .channel('system_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, () => {
        fetchMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading && !metrics) return null;

  const healthItems = [
    {
      label: "Success Rate",
      value: `${metrics?.delivery_success_rate ?? '0'}%`,
      sub: "Entrega de Blueprints",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "SLA Orquestación",
      value: `${metrics?.webhook_sla_percentage ?? '0'}%`,
      sub: "Disponibilidad n8n/Edge",
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Avg. TTV",
      value: `${metrics?.avg_ttv_minutes ?? '0'}min`,
      sub: "Time-to-Value Real",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      label: "Latencia Bridge",
      value: `${metrics?.avg_latency_ms ?? '0'}ms`,
      sub: "Respuesta de enlace seguro",
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {healthItems.map((item, idx) => (
        <div key={idx} className="bg-card border border-border/40 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:border-border/80 transition-all group">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} group-hover:scale-110 transition-transform`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{item.label}</p>
              {parseFloat(item.value) > 90 || (item.label === "Latencia Bridge" && parseFloat(item.value) < 1000) ? (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <AlertCircle className="w-3 h-3 text-orange-500" />
              )}
            </div>
            <h4 className="text-xl font-black">{item.value}</h4>
            <p className="text-[10px] text-muted-foreground truncate">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
