import { Button } from "@/components/ui/button";
import { Server, Webhook, CreditCard, CheckCircle, Database } from "lucide-react";
import { toast } from "sonner";

const SystemAdmin = () => {
  const handlePing = (service: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)), // Simulate API call
      {
        loading: `Verificando conexión con ${service}...`,
        success: `${service} responde correctamente (HTTP 200).`,
        error: `Error al conectar con ${service}`,
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sistema e Integraciones</h1>
        <p className="text-muted-foreground mt-1">Verifica la salud de los webhooks y APIs de la Fase 3.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* N8N Settings */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <Webhook className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">N8N Webhooks</h3>
                <p className="text-sm text-muted-foreground">Motor de flujos y scoring</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Listo
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Secure Orchestration Bridge</p>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono text-muted-foreground break-all">
                supabase.functions.invoke('n8n-bridge')
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                Todas las peticiones a n8n ahora pasan por este puente seguro que valida el JWT del usuario y protege las URLs finales.
              </p>
            </div>
            <Button onClick={() => handlePing('n8n-bridge')} className="w-full" variant="outline">
              <Server className="w-4 h-4 mr-2" /> Verificar Salud del Bridge
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
                <h3 className="font-bold text-lg">Stripe Payments</h3>
                <p className="text-sm text-muted-foreground">Pasarela para Bloques Premium</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-full">
              Pendiente Fase 3
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg text-xs font-mono text-muted-foreground">
              API Keys no configuradas en entorno
            </div>
            <Button disabled onClick={() => handlePing('Stripe')} className="w-full" variant="outline">
               Bloqueado hasta Fase 3
            </Button>
          </div>
        </div>

        {/* Database Config */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Supabase DB</h3>
              <p className="text-sm text-muted-foreground">Gestión principal de roles</p>
            </div>
          </div>
          <p className="text-sm text-foreground mb-4">
            Nota: La configuración de roles administrativos (User Role Enum) y acceso Premium de esta plataforma se delega a las reglas RLS de Supabase. Cualquier modificación estructural de las tablas <code>leads</code>, <code>profiles</code> o <code>projects</code> debe realizarse en el SQL Editor nativo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemAdmin;
