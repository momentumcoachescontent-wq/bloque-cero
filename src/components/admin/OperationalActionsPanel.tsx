import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { assessOperationalReadiness } from "@/lib/operationalReadiness";
import { buildOperationalActionPlan } from "@/lib/operationalActions";

interface OperationalActionsPanelProps {
  feed: UnifiedQueueItem[];
}

const OperationalActionsPanel = ({ feed }: OperationalActionsPanelProps) => {
  const [selectedId, setSelectedId] = useState<string>(feed[0]?.id || '');

  const selectedLead = useMemo(
    () => feed.find((item) => item.id === selectedId) || feed[0],
    [feed, selectedId],
  );

  const assessment = selectedLead ? assessOperationalReadiness(selectedLead) : null;
  const actionPlan = selectedLead && assessment ? buildOperationalActionPlan(selectedLead, assessment) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan de acción operativo</CardTitle>
        <CardDescription>
          Convierte el assessment en tareas sugeridas, queue recomendada y candidatos de automatización. Ya no solo decimos “esto se ve importante”; ahora sugerimos qué rayos hacer con ello.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay leads en el feed para generar plan de acción.</p>
        ) : (
          <>
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

            {selectedLead && assessment && actionPlan && (
              <div className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Queue sugerida</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{actionPlan.routing.queue}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Owner funcional</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{actionPlan.routing.ownerRole}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Trigger principal</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{actionPlan.routing.automationTrigger}</p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nota de routing</p>
                  <p className="text-sm text-muted-foreground">{actionPlan.routing.notes}</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tareas sugeridas</p>
                    <div className="space-y-3">
                      {actionPlan.suggestedTasks.map((task) => (
                        <div key={`${task.title}-${task.type}`} className="rounded-xl border p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">{task.title}</p>
                            <Badge variant="outline">{task.priority}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">Tipo: {task.type} · Ventana: {task.dueWindow}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{task.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Candidatos de automatización</p>
                    <div className="flex flex-wrap gap-2">
                      {actionPlan.automationCandidates.map((candidate) => (
                        <Badge key={candidate} variant="secondary">{candidate}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">
                      Stage sugerido actual: <span className="font-semibold text-foreground">{assessment.suggestedStage}</span>
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

export default OperationalActionsPanel;
