import { Map, Settings, Users, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
interface BlueprintExpandedProps {
  lead: UnifiedQueueItem;
  downloadJson: (item: UnifiedQueueItem) => void;
  handleDelete: (id: string, type: 'radar' | 'blueprint') => void;
}

export const AdminBlueprintExpanded = ({ lead, downloadJson, handleDelete }: BlueprintExpandedProps) => {
  return (
    <div className="p-8 bg-background border-t border-border/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Map className="w-6 h-6 text-purple-500" />
            Extracción de Construcción Blueprint
          </h3>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => downloadJson(lead)} className="bg-background shadow-sm border-border/50">
              Descargar Metadata JSON
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(lead.id, 'blueprint')} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
              Desmantelar Nodo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm relative overflow-hidden">
            <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> 1. Esquema Solicitado
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm py-2 border-b border-border/30">
                <span className="text-muted-foreground">Formato PDF Arquitectura:</span>
                {lead.format_pdf ? <span className="text-green-500 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Activo</span> : <span className="text-muted-foreground">-</span>}
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b border-border/30">
                <span className="text-muted-foreground">Iteración Pitch Deck:</span>
                {lead.format_presentation ? <span className="text-green-500 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Activo</span> : <span className="text-muted-foreground">-</span>}
              </div>
              <div className="flex justify-between items-center text-sm py-2">
                <span className="text-muted-foreground">Infografía Canvas:</span>
                {lead.format_infographic ? <span className="text-green-500 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Activo</span> : <span className="text-muted-foreground">-</span>}
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm relative overflow-hidden">
            <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 2. SLA Tracker
            </h4>
            <div className="flex flex-col items-center justify-center h-24">
              <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden border border-border/50">
                <div 
                  className={`h-full transition-all duration-1000 ${lead.progress_day && lead.progress_day >= 7 ? 'bg-green-500' : 'bg-purple-500'}`}
                  style={{ width: `${((lead.progress_day || 1) / 7) * 100}%` }}
                />
              </div>
              <p className="text-sm font-bold text-muted-foreground">
                Iteración actual: <span className="text-foreground">Día {lead.progress_day || 1} de 7</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Se requiere agregar Clock al import superior:
import { Clock } from "lucide-react";
