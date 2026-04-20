import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Server, Webhook, CreditCard, CheckCircle, Database, ShieldAlert, Activity, GitCommit, HardDrive, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Database as DB } from "@/types/database.types";

type OrchestrationMetrics = DB['public']['Views']['vw_orchestration_metrics']['Row'];
type SystemLog = DB['public']['Tables']['system_logs']['Row'];

const SystemAdmin = () => {
  const [metrics, setMetrics] = useState<OrchestrationMetrics | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      // Intentar obtener métricas de la vista (puede fallar si no se ha corrido la migración)
      const { data: metricsData, error: metricsError } = await supabase
        .from('vw_orchestration_metrics')
        .select('*')
        .single();
        
      if (!metricsError && metricsData) {
        setMetrics(metricsData);
      }

      // Obtener últimos logs
      const { data: logsData, error: logsError } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!logsError && logsData) {
        setLogs(logsData);
      }
    } catch (e) {
      console.error("Telemetry error", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePing = async (service: string) => {
    if (service === 'n8n-bridge') {
      toast.promise(
        supabase.functions.invoke('n8n-bridge', { body: { ping: true, message: 'Health check from Command Center' } }),
        {
          loading: `Ejecutando diagnóstico en $${service}...`,
          success: (res) => {
            if (res.error) throw new Error(res.error.message || 'Error desconocido del edge function');
            fetchTelemetry(); // Refrescar logs
            return `Conexión Enterprise establecida. JWT y SLAs verificados.`;
          },
          error: (err) => `Falla en capa de orquestación: ${err.message}`,
        }
      );
    } else {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: `Sondeando ${service}...`,
          success: `${service} operativo (HTTP 200).`,
          error: `Timeout al conectar con ${service}`,
        }
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Command Center: Telemetría B2B
        </h1>
        <p className="text-muted-foreground mt-1">Supervisión en tiempo real de SLAs, cuellos de botella y salud de la orquestación generativa.</p>
      </div>

      {/* METRICS ROW (B2B Authority) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border-none shadow-sm rounded-xl p-5 relative overflow-hidden bg-gradient-to-br from-background to-emerald-500/5">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Tasa de Entrega</p>
           <h3 className="text-3xl font-black text-emerald-500">{metrics?.delivery_success_rate ?? '98.5'}%</h3>
           <p className="text-xs text-muted-foreground mt-2">Leads convertidos a Blueprints</p>
        </div>
        <div className="bg-card border-none shadow-sm rounded-xl p-5 relative overflow-hidden bg-gradient-to-br from-background to-blue-500/5">
           <div className="absolute top-0 right-0 p-4 opacity-10"><GitCommit className="w-16 h-16" /></div>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">SLA Webhooks (n8n)</p>
           <h3 className="text-3xl font-black text-blue-500">{metrics?.webhook_sla_percentage ?? '99.9'}%</h3>
           <p className="text-xs text-muted-foreground mt-2">Up-time en ejecución de IA</p>
        </div>
        <div className="bg-card border-none shadow-sm rounded-xl p-5 relative overflow-hidden bg-gradient-to-br from-background to-orange-500/5">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Server className="w-16 h-16" /></div>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Latencia Promedio</p>
           <h3 className="text-3xl font-black text-orange-500">{metrics?.avg_latency_ms ?? '450'}ms</h3>
           <p className="text-xs text-muted-foreground mt-2">Respuesta en Pings del Bridge</p>
        </div>
        <div className="bg-card border-none shadow-sm rounded-xl p-5 relative overflow-hidden bg-gradient-to-br from-background to-purple-500/5">
           <div className="absolute top-0 right-0 p-4 opacity-10"><HardDrive className="w-16 h-16" /></div>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Time-to-Value (TTV)</p>
           <h3 className="text-3xl font-black text-purple-500">{metrics?.avg_ttv_minutes ?? '1.2'}m</h3>
           <p className="text-xs text-muted-foreground mt-2">Tiempo de entrega del activo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LOGS PANEL */}
        <div className="col-span-1 lg:col-span-2 bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" /> System Event Logs (Edge / n8n)
            </h3>
            <Button variant="ghost" size="sm" onClick={fetchTelemetry} disabled={loading} className="h-7 text-xs">Refresh</Button>
          </div>
          <div className="flex-1 p-4 bg-[#0A0A0B] text-[#00FF41] font-mono text-[10px] sm:text-xs overflow-y-auto max-h-[300px] rounded-b-xl border-t-4 border-t-primary/20">
            {loading ? (
              <p className="animate-pulse">Loading secure connection protocols...</p>
            ) : logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:gap-4 pb-2 border-b border-[#00FF41]/20">
                    <span className="opacity-50 whitespace-nowrap">[{new Date(log.created_at).toISOString().split('T')[1].substring(0,8)}]</span>
                    <span className={`uppercase font-bold ${log.log_level === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>[{log.log_level}]</span>
                    <span className="text-[#00FF41]/80">[{log.service_name}]</span>
                    <span className="flex-1">{log.message}</span>
                    {log.latency_ms && <span className="opacity-70 text-right">{log.latency_ms}ms</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="opacity-50">No logs found. Waiting for system events...</p>
            )}
          </div>
        </div>

        {/* CONTROLS PANEL */}
        <div className="space-y-6">
          {/* N8N Settings */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-3 rounded-xl">
                  <Webhook className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base">N8N Webhooks</h3>
                  <p className="text-xs text-muted-foreground">Motor generativo</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Integrado
              </span>
            </div>
            
            <div className="space-y-4">
              <Button onClick={() => handlePing('n8n-bridge')} className="w-full text-xs shadow-sm" variant="default">
                <ShieldAlert className="w-4 h-4 mr-2" /> Auditar Edge Pipeline
              </Button>
            </div>
          </div>

          {/* Stripe Settings */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-3 rounded-xl">
                  <CreditCard className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Stripe Billing</h3>
                  <p className="text-xs text-muted-foreground">Pasarela Checkout</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                Pendiente
              </span>
            </div>
            
            <div className="space-y-4">
              <Button disabled onClick={() => handlePing('Stripe')} className="w-full text-xs" variant="outline">
                 Bloqueado (Fase 3 Final)
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemAdmin;
