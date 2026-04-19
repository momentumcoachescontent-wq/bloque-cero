import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { assessOperationalReadiness } from "@/lib/operationalReadiness";

interface OperationalReadinessPanelProps {
  feed: UnifiedQueueItem[];
}

const priorityTone = {
  low: 'bg-slate-500/10 text-slate-500',
  normal: 'bg-blue-500/10 text-blue-500',
  high: 'bg-amber-500/10 text-amber-600',
  urgent: 'bg-red-500/10 text-red-500',
};

const OperationalReadinessPanel = ({ feed }: OperationalReadinessPanelProps) => {
  const [selectedId, setSelectedId] = useState<string>(feed[0]?.id || '');

  const selectedLead = useMemo(
    () => feed.find((item) => item.id === selectedId) || feed[0],
    [feed, selectedId],
  );

  const assessment = selectedLead ? assessOperationalReadiness(selectedLead) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluación operativa de leads</CardTitle>
        <CardDescription>
          Deriva stage sugerido, prioridad, readiness y acciones mínimas desde el intake actual. Ya empieza a oler menos a spec y más a operación real.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay leads en el feed para evaluar.</p>
        ) : (
          <>
            <div className="space-y-2">
              <Select value={selectedLead?.id} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un lead" />
                </SelectTrigger>
                <SelectContent>
                  {feed.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {(item.business_name || item.project_name || item.name || 'Lead sin nombre').slice(0, 80)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLead && assessment && (
              <div className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Stage sugerido</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{assessment.suggestedStage}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Prioridad</p>
                    <div className="mt-2">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${priorityTone[assessment.priority]}`}>
                        {assessment.priority}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Readiness</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{assessment.readinessScore}/100</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={assessment.readinessScore} className="h-3" />
                  <p className="text-sm text-muted-foreground">{assessment.reasoning}</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Acciones requeridas</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.requiredActions.map((action) => (
                        <Badge key={action} variant="outline">{action}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Riesgos / alertas</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.riskFlags.length > 0 ? (
                        assessment.riskFlags.map((flag) => (
                          <Badge key={flag} variant="destructive">{flag}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin alertas críticas para este cálculo.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OperationalReadinessPanel;
