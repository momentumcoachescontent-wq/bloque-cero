import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Clock, CheckCircle2, AlertTriangle, FileText, UploadCloud, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const FulfillmentAdmin = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Fetch blueprint requests. Joining with profiles to get the user email if lead_id fails.
      const { data, error } = await supabase
        .from('blueprint_requests')
        .select(`
          *,
          profiles:user_id (email),
          leads:lead_id (name, email, whatsapp, business_name, idea_description)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      toast.error("Error cargando requerimientos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateProgress = async (id: string, newDay: number) => {
    try {
      const { error } = await supabase
        .from('blueprint_requests')
        .update({ progress_day: newDay, status: newDay >= 7 ? 'completed' : 'analyzing' })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Progreso actualizado al Día ${newDay}`);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, progress_day: newDay, status: newDay >= 7 ? 'completed' : 'analyzing' } : r));
    } catch (err: any) {
      toast.error("Error al actualizar: " + err.message);
    }
  };

  const calculateSLA = (createdAt: string) => {
    const start = new Date(createdAt);
    const deadline = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: `Atrasado por ${Math.abs(diffDays)} días`, color: 'text-red-500 bg-red-500/10', urgent: true };
    if (diffDays <= 2) return { label: `Vence en ${diffDays} días`, color: 'text-orange-500 bg-orange-500/10', urgent: true };
    return { label: `A tiempo (${diffDays} días rest.)`, color: 'text-emerald-500 bg-emerald-500/10', urgent: false };
  };

  const handleUploadClick = (format: string) => {
    toast("Módulo de Ingesta Próximamente", { description: `El flujo para subir y vincular el documento ${format} a Cloud Storage está planificado.` });
  };

  const handleNotifyClient = (email: string) => {
    toast.success("Notificación Disparada", { description: `Se enviaría un webhook a SendGrid/N8N para notificar a ${email}` });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-primary" />
          Control de Cumplimiento
        </h1>
        <p className="text-muted-foreground mt-1">
          Triaje y cumplimiento de Service Level Agreements (SLA) para Blueprints y Entregables.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Cola de Trabajo (Blueprints)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Requerimientos activos ordenados por urgencia de entrega.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRequests}>Refrescar</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Proyecto & Cliente</th>
                <th className="px-6 py-4 font-semibold">Entregables</th>
                <th className="px-6 py-4 font-semibold">SLA (7 Días)</th>
                <th className="px-6 py-4 font-semibold">Progreso & Ingesta</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Cargando cola de trabajo...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">La cola de trabajo está limpia.</td></tr>
              ) : (
                requests.map(req => {
                  const lead = req.leads || {};
                  const projectName = req.diagnostic_answers?.business_name || lead.business_name || 'Sin Nombre';
                  const email = lead.email || req.profiles?.email || 'N/A';
                  const sla = calculateSLA(req.created_at);
                  const isCompleted = req.progress_day >= 7;

                  return (
                    <tr key={req.id} className={`border-b border-border/30 hover:bg-muted/10 transition-colors ${sla.urgent && !isCompleted ? 'bg-red-500/5' : ''}`}>
                      <td className="px-6 py-5">
                        <p className="font-bold text-foreground text-base tracking-tight">{projectName}</p>
                        <p className="text-muted-foreground text-sm mt-0.5">{lead.name || 'Cliente'} • {email}</p>
                        <p className="text-xs text-muted-foreground opacity-70 mt-1 line-clamp-1">{req.diagnostic_answers?.idea_description || lead.idea_description}</p>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          {req.format_pdf && <span className="bg-muted text-foreground/80 text-xs px-2 py-1 rounded-md border border-border">PDF</span>}
                          {req.format_presentation && <span className="bg-muted text-foreground/80 text-xs px-2 py-1 rounded-md border border-border">Pitch</span>}
                          {req.format_infographic && <span className="bg-muted text-foreground/80 text-xs px-2 py-1 rounded-md border border-border">Info</span>}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                          </span>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sla.color}`}>
                            {sla.urgent ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {sla.label}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 opacity-60">Creado: {new Date(req.created_at).toLocaleDateString()}</p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-2 bg-muted/30 p-2 rounded-lg border border-border/50">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fase:</span>
                            <select 
                              value={req.progress_day}
                              onChange={(e) => updateProgress(req.id, parseInt(e.target.value))}
                              className="bg-background border border-input rounded-md text-sm px-2 py-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                              disabled={isCompleted}
                            >
                              {[1,2,3,4,5,6,7].map(d => (
                                <option key={d} value={d}>Día {d} {d === 7 ? '(Finalizado)' : ''}</option>
                              ))}
                            </select>
                          </div>

                          {isCompleted && (
                            <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                              <Button size="sm" variant="outline" className="w-full text-xs gap-1.5 bg-background shadow-sm" onClick={() => handleUploadClick('General')}>
                                <UploadCloud className="w-3.5 h-3.5" /> Cargar Docs
                              </Button>
                              <Button size="sm" className="w-full text-xs gap-1.5 shadow-sm" onClick={() => handleNotifyClient(email)}>
                                <Send className="w-3.5 h-3.5" /> Avisar
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FulfillmentAdmin;
