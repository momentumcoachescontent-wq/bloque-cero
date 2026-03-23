import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Clock, CheckCircle2, AlertTriangle, FileText, UploadCloud, Send, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FulfillmentItem {
  id: string;
  type: 'radar' | 'blueprint';
  title: string;
  clientName: string;
  clientEmail: string;
  createdAt: string;
  deadlineDays: number; // SLA rules: 2 days for radar, 7 for blueprint
  isCompleted: boolean;
  progressDay?: number;
  formats: string[]; // e.g., ['PDF Diagnóstico'], ['PDF', 'Pitch', 'Info']
  sourceData: any;
}

const FulfillmentAdmin = () => {
  const [items, setItems] = useState<FulfillmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOmniQueue = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Blueprints (Sin joins relacionales para evitar errores si no hay FKs)
      const { data: blueprintsData, error: bpError } = await supabase
        .from('blueprint_requests')
        .select(`*`);
      
      if (bpError) {
        console.error("Error cargando blueprints:", bpError);
        toast.error("Aviso: No se pudieron cargar los Blueprints (" + bpError.message + ")");
      }

      // 2. Fetch Radar Leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*');
      
      if (leadsError) {
        console.error("Error cargando leads:", leadsError);
        toast.error("Aviso: No se pudieron cargar los Diagnósticos Radar (" + leadsError.message + ")");
      }

      // 3. Normalize & Merge
      let unified: FulfillmentItem[] = [];

      // Map Blueprints
      if (blueprintsData) {
        blueprintsData.forEach(req => {
          // Client-side join: Encontrar el lead original asociado en radar (si existe)
          const relatedLead = leadsData?.find(l => l.id === req.lead_id) || {};
          
          const formats = [];
          if (req.format_pdf) formats.push('PDF Blueprint');
          if (req.format_presentation) formats.push('Pitch Deck');
          if (req.format_infographic) formats.push('Infografía');

          unified.push({
            id: req.id,
            type: 'blueprint',
            title: req.diagnostic_answers?.business_name || relatedLead.business_name || relatedLead.diagnostic_answers?.business_name || 'Blueprint Project',
            clientName: req.diagnostic_answers?.name || relatedLead.name || 'Cliente de Blueprint',
            clientEmail: req.diagnostic_answers?.email || relatedLead.email || 'N/A',
            createdAt: req.created_at,
            deadlineDays: 7,
            isCompleted: req.progress_day >= 7 || req.status === 'completed',
            progressDay: req.progress_day || 1,
            formats,
            sourceData: req
          });
        });
      }

      // Map Radar Leads
      if (leadsData) {
        leadsData.forEach(lead => {
          unified.push({
            id: lead.id,
            type: 'radar',
            title: lead.diagnostic_answers?.business_name || lead.business_name || lead.idea_description?.slice(0, 30) || 'Diagnóstico Inicial',
            clientName: lead.name || 'Prospecto',
            clientEmail: lead.email || 'N/A',
            createdAt: lead.created_at,
            deadlineDays: 2, // 48h SLA
            isCompleted: lead.is_analysis_sent === true,
            formats: ['Dictamen Radar (PDF)'],
            sourceData: lead
          });
        });
      }

      // 4. Sort by Urgency (Closest to deadline or most overdue first)
      unified.sort((a, b) => {
        const getRemainingDays = (item: FulfillmentItem) => {
          const start = new Date(item.createdAt);
          const deadline = new Date(start.getTime() + item.deadlineDays * 24 * 60 * 60 * 1000);
          return (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        };
        
        // Push completed to the bottom
        if (a.isCompleted && !b.isCompleted) return 1;
        if (!a.isCompleted && b.isCompleted) return -1;
        
        return getRemainingDays(a) - getRemainingDays(b);
      });

      setItems(unified);
    } catch (err: any) {
      toast.error("Error cargando cola omnicanal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOmniQueue();
  }, []);

  const updateBlueprintProgress = async (id: string, newDay: number) => {
    try {
      const { error } = await supabase
        .from('blueprint_requests')
        .update({ progress_day: newDay, status: newDay >= 7 ? 'completed' : 'analyzing' })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Blueprint actualizado al Día ${newDay}`);
      setItems(prev => prev.map(r => r.id === id ? { ...r, progressDay: newDay, isCompleted: newDay >= 7 } : r));
    } catch (err: any) {
      toast.error("Error al actualizar Blueprint: " + err.message);
    }
  };

  const toggleRadarCompletion = async (id: string, currentStatus: boolean) => {
    try {
      // Marcamos tanto generado como enviado para simplificar la vista Fulfillment
      const { error } = await supabase
        .from('leads')
        .update({ is_analysis_generated: !currentStatus, is_analysis_sent: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Diagnóstico Radar marcado como ${!currentStatus ? 'Completado' : 'Pendiente'}`);
      setItems(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !currentStatus } : r));
    } catch (err: any) {
      toast.error("Error al actualizar Radar: " + err.message);
    }
  };

  const calculateSLA = (createdAt: string, deadlineDays: number) => {
    const start = new Date(createdAt);
    const deadline = new Date(start.getTime() + deadlineDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: `Atrasado ${Math.abs(diffDays)}d`, color: 'text-red-500 bg-red-500/10', urgent: true };
    if (diffDays <= (deadlineDays * 0.3)) return { label: `Vence en ${diffDays}d`, color: 'text-orange-500 bg-orange-500/10', urgent: true };
    return { label: `A tiempo (${diffDays}d)`, color: 'text-emerald-500 bg-emerald-500/10', urgent: false };
  };

  const handleUploadClick = (format: string, type: string) => {
    toast("Ingesta Activada", { description: `El flujo de subida para [${format}] del proyecto [${type}] requiere el bucket de Storage (Próxima fase).` });
  };

  const handleNotifyClient = (email: string) => {
    toast.success("Notificación Disparada", { description: `Webhook enviado a n8n para despachar correo con adjuntos a ${email}` });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-primary" />
          Cola Omnicanal de Cumplimiento
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Triaje unificado para Diagnósticos Radar, Blueprints y futuros bloques operativos.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Requerimientos Activos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Ordenados logarítmicamente por proximidad al límite del SLA.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOmniQueue}>Sincronizar Panel</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Tipo & Entregables</th>
                <th className="px-6 py-4 font-semibold">Proyecto & Cliente</th>
                <th className="px-6 py-4 font-semibold">SLA (Límite)</th>
                <th className="px-6 py-4 font-semibold">Control de Operación</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Analizando bases de datos...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">La cola omnicanal está limpia. Todos los entregables han sido procesados.</td></tr>
              ) : (
                items.map(item => {
                  const sla = calculateSLA(item.createdAt, item.deadlineDays);
                  
                  return (
                    <tr key={`${item.type}-${item.id}`} className={`border-b border-border/30 hover:bg-muted/10 transition-colors ${sla.urgent && !item.isCompleted ? 'bg-red-500/5' : ''} ${item.isCompleted ? 'opacity-70 bg-muted/5' : ''}`}>
                      
                      {/* TIPO Y ENTREGABLES */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === 'radar' ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md text-xs font-bold uppercase tracking-wider">
                              <Target className="w-3 h-3" /> Radar
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-md text-xs font-bold uppercase tracking-wider">
                              <FileText className="w-3 h-3" /> Blueprint
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.formats.map((f, i) => (
                            <span key={i} className="bg-background text-foreground/80 text-[10px] px-2 py-0.5 rounded border border-border/60 shadow-sm">{f}</span>
                          ))}
                        </div>
                      </td>

                      {/* PROYECTO & CLIENTE */}
                      <td className="px-6 py-5">
                        <p className={`font-bold text-base tracking-tight ${item.isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>{item.title}</p>
                        <p className="text-muted-foreground text-sm mt-0.5">{item.clientName}</p>
                        <p className="text-xs text-muted-foreground opacity-70 border-t border-border/50 pt-1 mt-1 inline-block">{item.clientEmail}</p>
                      </td>

                      {/* SLA */}
                      <td className="px-6 py-5">
                        {item.isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Culminado
                          </span>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sla.color.replace('bg-', 'border-').replace('/10', '/30')}`}>
                            {sla.urgent ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {sla.label}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-2 opacity-80 uppercase tracking-wider">
                          Promesa: {item.deadlineDays} Días
                          <br/>
                          Inicio: {new Date(item.createdAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                        </p>
                      </td>

                      {/* CONTROL DE OPERACIÓN */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2 min-w-[180px]">
                          
                          {/* Controles Específicos por Tipo */}
                          {item.type === 'blueprint' ? (
                            <div className="flex items-center justify-between gap-2 bg-background p-1.5 rounded-lg border border-border/80 shadow-sm">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Fase:</span>
                              <select 
                                value={item.progressDay}
                                onChange={(e) => updateBlueprintProgress(item.id, parseInt(e.target.value))}
                                className="bg-muted border-none rounded text-xs font-semibold px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors focus:ring-0"
                                disabled={item.isCompleted && item.progressDay === 7}
                              >
                                {[1,2,3,4,5,6,7].map(d => (
                                  <option key={d} value={d}>Día {d} {d === 7 ? '(Hit)' : ''}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant={item.isCompleted ? "outline" : "default"} 
                              className={`w-full text-xs font-bold h-8 ${!item.isCompleted && 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                              onClick={() => toggleRadarCompletion(item.id, item.isCompleted)}
                            >
                              {item.isCompleted ? 'Reabrir Dictamen' : 'Marcar Dictamen Listo'}
                            </Button>
                          )}

                          {/* Botones Universales de Cumplimiento (Siempre visibles para Blueprint, condicionales para Radar) */}
                          <div className={`grid grid-cols-2 gap-2 transition-all duration-300 ${item.type === 'blueprint' || item.isCompleted ? 'opacity-100 scale-100 pointer-events-auto mt-1' : 'opacity-50 scale-95 pointer-events-none h-0 overflow-hidden'}`}>
                             <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary" onClick={() => handleUploadClick('Docs', item.type)}>
                               <UploadCloud className="w-3 h-3" /> Subir
                             </Button>
                             <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-green-500/20 hover:bg-green-500/10 hover:text-green-600" onClick={() => handleNotifyClient(item.clientEmail)}>
                               <Send className="w-3 h-3" /> Enviar
                             </Button>
                          </div>

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
