import React from "react";
import { toast } from "sonner";
import { Clock, CheckCircle2, AlertTriangle, FileText, UploadCloud, Send, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliverableUploader } from "@/components/admin/DeliverableUploader";
import { useFulfillmentQueue } from "@/hooks/useFulfillmentQueue";

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

const FulfillmentAdmin = () => {
  const { items, loadingQueue, refetchQueue, updateBlueprintProgress, toggleRadarCompletion } = useFulfillmentQueue();

  const handleNotifyClient = async (item: typeof items[0]) => {
    try {
      // Endpoint del Webhook en n8n. En producción usar variable de entorno: import.meta.env.VITE_N8N_WEBHOOK_URL
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://tu-n8n.com/webhook/bloque-cero-dispatch';
      
      const payload = {
        clientName: item.clientName,
        clientEmail: item.clientEmail,
        projectId: item.id,
        projectType: item.type,
        // Extracción dinámica de URLs según el tipo
        radarUrl: item.type === 'radar' ? (item.sourceData as any).analysis_file_url : null,
        blueprintPdf: item.type === 'blueprint' ? (item.sourceData as any).pdf_url : null,
        blueprintPitch: item.type === 'blueprint' ? (item.sourceData as any).presentation_url : null,
        blueprintInfographic: item.type === 'blueprint' ? (item.sourceData as any).infographic_url : null,
      };

      // toast.info("Despachando...", { description: "Conectando con n8n..." });

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Fallo en la respuesta del Webhook n8n");

      toast.success("Notificación Disparada", { description: `Los entregables de ${item.clientName} fueron enviados al orquestador.` });
    } catch (err: unknown) {
      // Por ahora es un toast de error si tu n8n no está vivo, no bloquea la DB.
      toast.error("Aviso de Despacho", { description: "Simulación de envío; configura VITE_N8N_WEBHOOK_URL en .env para el envío real." });
    }
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
          <Button variant="outline" size="sm" onClick={refetchQueue}>Sincronizar Panel</Button>
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
              {loadingQueue ? (
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
                             <DeliverableUploader item={item} onUploadSuccess={refetchQueue}>
                               <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary">
                                 <UploadCloud className="w-3 h-3" /> Subir
                               </Button>
                             </DeliverableUploader>
                             <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-green-500/20 hover:bg-green-500/10 hover:text-green-600" onClick={() => handleNotifyClient(item)}>
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
