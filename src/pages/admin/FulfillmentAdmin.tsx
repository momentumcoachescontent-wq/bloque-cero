import React from "react";
import { toast } from "sonner";
import { Clock, CheckCircle2, AlertTriangle, FileText, UploadCloud, Send, Zap, Target, Brain, ShoppingBag, Play, BookOpen, Wallet, Truck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliverableUploader } from "@/components/admin/DeliverableUploader";
import { useFulfillmentQueue } from "@/hooks/useFulfillmentQueue";
import { toN8nCompatibilityPayload } from "@/lib/businessBlueprintPayloads";
import { supabase } from "@/lib/supabase";

const VERTICAL_ICONS: Record<string, React.ReactNode> = {
  psicologia_salud: <Brain className="w-4 h-4" />,
  contenido: <Play className="w-4 h-4" />,
  ecommerce: <ShoppingBag className="w-4 h-4" />,
  educacion: <BookOpen className="w-4 h-4" />,
  fintech: <Wallet className="w-4 h-4" />,
  logistica: <Truck className="w-4 h-4" />,
};

const VERTICAL_LABELS: Record<string, string> = {
  psicologia_salud: "Salud/Psicología",
  contenido: "Contenido/Infoproductos",
  ecommerce: "E-commerce",
  educacion: "Educación",
  fintech: "Fintech",
  logistica: "Logística",
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

const FulfillmentAdmin = () => {
  const { items, loadingQueue, refetchQueue, updateBlueprintProgress, toggleIntakeCompletion } = useFulfillmentQueue();

  const handleNotifyClient = async (item: typeof items[0]) => {
    try {
      const payload = toN8nCompatibilityPayload(item.businessBlueprint, item.type);

      const { data, error: functionError } = await supabase.functions.invoke('n8n-bridge', {
        body: { 
          action: 'dispatch', 
          payload 
        }
      });

      if (functionError) throw functionError;

      toast.success("Notificación Disparada", { 
        description: `Los entregables de ${item.clientName} fueron enviados al orquestador seguro.` 
      });
    } catch (err: any) {
      console.error("Error disparando bridge:", err);
      toast.error("Error de Comunicación", { 
        description: err.message || "No se pudo conectar con el puente seguro de n8n." 
      });
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
          Triaje unificado para Blueprint Intake, Blueprint Delivery y futuros bloques operativos.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Casos Activos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Ordenados por proximidad al límite del SLA operativo.</p>
          </div>
          <Button variant="outline" size="sm" onClick={refetchQueue}>Sincronizar Panel</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Vertical</th>
                <th className="px-6 py-4 font-semibold">Proyecto & Cliente</th>
                <th className="px-6 py-4 font-semibold">SLA (Límite)</th>
                <th className="px-6 py-4 font-semibold">Control de Operación</th>
              </tr>
            </thead>
            <tbody>
              {loadingQueue ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Analizando intake y entregas de Blueprint...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">La cola omnicanal está limpia. No hay intake ni entregas pendientes.</td></tr>
              ) : (
                items.map(item => {
                  const sla = calculateSLA(item.createdAt, item.deadlineDays);
                  
                  return (
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-2 rounded-lg ${item.businessType === 'psicologia_salud' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-muted text-muted-foreground'}`}>
                            {VERTICAL_ICONS[item.businessType || ''] || <Target className="w-4 h-4" />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                            {VERTICAL_LABELS[item.businessType || ''] || 'General'}
                          </span>
                        </div>
                      </td>

                      {/* PROYECTO & CLIENTE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 mb-1">
                          {item.stageLabel === 'Blueprint Intake' ? (
                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded text-[10px] font-bold uppercase">Intake</span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded text-[10px] font-bold uppercase">Delivery</span>
                          )}
                          {item.isHighBurnout && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] font-bold animate-pulse">
                              <AlertTriangle className="w-3 h-3" /> Riesgo Burnout
                            </span>
                          )}
                        </div>
                        <p className={`font-bold text-base tracking-tight ${item.isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>{item.title}</p>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5 group">
                          {item.clientName}
                          <div className="relative inline-block">
                             <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-primary cursor-help transition-colors" />
                             <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-popover border border-border rounded-xl shadow-xl z-50 text-xs animate-in fade-in slide-in-from-bottom-1">
                                <p className="font-bold text-primary mb-1 inline-flex items-center gap-1.5">
                                  <Brain className="w-3 h-3" /> Coach Insight:
                                </p>
                                <p className="text-muted-foreground mb-2 italic">Análisis de dolores operativos declarados por el cliente:</p>
                                <div className="space-y-1.5">
                                  {item.pains && item.pains.length > 0 ? item.pains.map((p, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5 bg-muted/50 p-1.5 rounded border border-border/30">
                                      <div className="w-1.5 h-1.5 mt-1 rounded-full bg-primary flex-shrink-0" />
                                      <span className="capitalize">{p.replace(/_/g, ' ')}</span>
                                    </div>
                                  )) : <p className="text-muted-foreground opacity-50">Sin dolores específicos reportados.</p>}
                                </div>
                             </div>
                          </div>
                        </p>
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
                          SLA: {item.deadlineDays} días
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
                              onClick={() => toggleIntakeCompletion(item.id, item.isCompleted)}
                            >
                              {item.isCompleted ? 'Reabrir Intake' : 'Marcar Intake Listo'}
                            </Button>
                          )}

                          {/* Botones universales de cumplimiento (siempre visibles para Blueprint Delivery, condicionales para Blueprint Intake) */}
                          <div className={`grid grid-cols-2 gap-2 transition-all duration-300 ${item.type === 'blueprint' || item.isCompleted ? 'opacity-100 scale-100 pointer-events-auto mt-1' : 'opacity-50 scale-95 pointer-events-none h-0 overflow-hidden'}`}>
                             <DeliverableUploader item={item} onUploadSuccess={refetchQueue}>
                               <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary w-full">
                                 <UploadCloud className="w-3 h-3" /> Subir
                               </Button>
                             </DeliverableUploader>
                             {item.businessBlueprint.pdfUrl && (
                               <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-purple-500/20 hover:bg-purple-500/5 text-purple-600" onClick={() => window.open(item.businessBlueprint.pdfUrl, '_blank')}>
                                 <FileText className="w-3 h-3" /> Ver PDF
                               </Button>
                             )}
                             <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 gap-1.5 bg-background shadow-sm border-green-500/20 hover:bg-green-500/10 hover:text-green-600 w-full col-span-2" onClick={() => handleNotifyClient(item)}>
                               <Send className="w-3 h-3" /> Reenviar Correo
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
