import { Target, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";

interface RadarExpandedProps {
  lead: UnifiedQueueItem;
  downloadJson: (item: UnifiedQueueItem) => void;
  handleDelete: (id: string, type: 'radar' | 'blueprint') => void;
  toggleFlag: (id: string, field: 'is_analysis_generated' | 'is_analysis_sent', currentValue: boolean) => void;
}

export const AdminRadarExpanded = ({ lead, downloadJson, handleDelete }: RadarExpandedProps) => {
  return (
    <div className="p-8 bg-background border-t border-border/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            Blueprint Intake — Análisis Base
          </h3>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => downloadJson(lead)} className="bg-background shadow-sm border-border/50 hover:bg-muted/50">
              Extraer JSON DB
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(lead.id, 'radar')} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
              Depurar Entidad
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2 relative z-10">
              <Users className="w-4 h-4" /> 1. Intake del Cliente
            </h4>
            <div className="space-y-4 text-sm relative z-10">
              <div>
                <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">Dolores (Fricción Activa):</span>
                <div className="flex flex-wrap gap-2">
                  {lead.diagnostic_answers?.n8n_payload?.business_profile?.dolores ? (
                    lead.diagnostic_answers.n8n_payload.business_profile.dolores.map((d: string, i: number) => (
                      <span key={i} className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-md text-xs font-medium shadow-sm">
                        {d}
                      </span>
                    ))
                  ) : <span className="text-muted-foreground/50 italic">No especificados</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
                <div>
                  <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">Audiencia:</span>
                  <p className="font-semibold text-foreground/90">{lead.diagnostic_answers?.n8n_payload?.business_profile?.audience || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">Etapa:</span>
                  <p className="font-semibold text-foreground/90">{lead.diagnostic_answers?.n8n_payload?.business_profile?.etapa || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors h-full">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110" />
              <h4 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2 relative z-10">
                <Activity className="w-4 h-4" /> 2. Resultado estructural base
              </h4>

              <div className="flex gap-4 mb-6 relative z-10">
                <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold shadow-sm shadow-primary/5">
                  Dirección táctica: {lead.diagnostic_answers?.recommended_block || "En suspenso"}
                </span>
                {lead.diagnostic_answers?.verdict && (
                  <span className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-foreground shadow-sm">
                    Veredicto: {lead.diagnostic_answers.verdict}
                  </span>
                )}
              </div>

              {lead.diagnostic_answers?.big6 ? (
                <div className="space-y-4 relative z-10">
                  {lead.diagnostic_answers.big6.map((m: { name: string, score: number, signal: 'Alto'|'Medio'|'Bajo', rationale: string }, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:items-start text-sm p-4 bg-muted/10 rounded-xl border border-border/50 transition-colors hover:bg-muted/20">
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <div className={`w-2 h-2 rounded-full shadow-sm flex-shrink-0 ${
                          m.signal === 'Alto' ? 'bg-green-500 shadow-green-500/50' :
                          m.signal === 'Medio' ? 'bg-yellow-500 shadow-yellow-500/50' :
                          'bg-red-500 shadow-red-500/50'
                        }`} />
                        <span className="font-bold text-foreground tracking-tight">{m.name}</span>
                        <span className="text-xs font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded-md border border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                          {m.score}/5
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs leading-relaxed flex-1 pt-1 sm:pt-0 sm:pl-4 sm:border-l sm:border-border/50">
                        {m.rationale}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-red-500/50 bg-red-500/5 rounded-xl text-red-500/80 text-sm relative z-10">
                  ⚠️ Faltan respuestas de los Big 6. Este intake fue analizado mediante heurística heredada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
