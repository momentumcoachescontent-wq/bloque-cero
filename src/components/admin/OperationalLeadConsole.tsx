import { useMemo, useState } from "react";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { assessOperationalReadiness } from "@/lib/operationalReadiness";
import { buildOperationalActionPlan } from "@/lib/operationalActions";
import { buildOperationalPayload } from "@/lib/operationalPayload";
import { buildOperationalTimelineDraft } from "@/lib/operationalEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface OperationalLeadConsoleProps {
  feed: UnifiedQueueItem[];
}

const priorityTone = {
  low: 'bg-slate-500/10 text-slate-500',
  normal: 'bg-blue-500/10 text-blue-500',
  high: 'bg-amber-500/10 text-amber-600',
  urgent: 'bg-red-500/10 text-red-500',
};

const runTone = {
  draft: 'bg-slate-500/10 text-slate-500',
  ready: 'bg-emerald-500/10 text-emerald-600',
  blocked: 'bg-red-500/10 text-red-500',
};

const OperationalLeadConsole = ({ feed }: OperationalLeadConsoleProps) => {
  const [selectedId, setSelectedId] = useState<string>(feed[0]?.id || '');

  const selectedLead = useMemo(
    () => feed.find((item) => item.id === selectedId) || feed[0],
    [feed, selectedId],
  );

  const assessment = selectedLead ? assessOperationalReadiness(selectedLead) : null;
  const actionPlan = selectedLead && assessment ? buildOperationalActionPlan(selectedLead, assessment) : null;
  const payload = selectedLead ? buildOperationalPayload(selectedLead) : null;
  const timeline = selectedLead ? buildOperationalTimelineDraft(selectedLead) : null;

  const copyPayload = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational lead console</CardTitle>
        <CardDescription>
          Vista unificada por lead para assessment, tasking, routing, payload y timeline draft. Menos pestañas mentales, más operación legible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay leads para construir la consola operativa.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
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
              <Button variant="outline" onClick={copyPayload}>Copiar payload operativo</Button>
            </div>

            {selectedLead && assessment && actionPlan && payload && timeline && (
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-4">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Lead</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{payload.lead.businessName || payload.lead.name || 'Lead sin nombre'}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{payload.lead.type}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Stage sugerido</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{assessment.suggestedStage}</p>
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
                    <p className="mt-2 text-base font-semibold text-foreground">{assessment.readinessScore}/100</p>
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
                        <span className="text-sm text-muted-foreground">Sin alertas críticas.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Routing</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium text-foreground">Queue:</span> {actionPlan.routing.queue}</p>
                      <p><span className="font-medium text-foreground">Owner:</span> {actionPlan.routing.ownerRole}</p>
                      <p><span className="font-medium text-foreground">Trigger:</span> {actionPlan.routing.automationTrigger}</p>
                      <p>{actionPlan.routing.notes}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Automation candidates</p>
                    <div className="flex flex-wrap gap-2">
                      {actionPlan.automationCandidates.map((candidate) => (
                        <Badge key={candidate} variant="secondary">{candidate}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tareas sugeridas</p>
                  <div className="space-y-3">
                    {actionPlan.suggestedTasks.map((task) => (
                      <div key={`${task.type}-${task.title}`} className="rounded-xl border p-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <p className="text-sm font-semibold text-foreground">{task.title}</p>
                          <Badge variant="outline">{task.priority}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{task.type} · {task.dueWindow}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{task.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Routing event draft</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium text-foreground">Event type:</span> {timeline.routingEvent.eventType}</p>
                      <p><span className="font-medium text-foreground">From → To:</span> {timeline.routingEvent.fromState || 'unknown'} → {timeline.routingEvent.toState}</p>
                      <p><span className="font-medium text-foreground">Queue:</span> {timeline.routingEvent.targetQueue}</p>
                      <p><span className="font-medium text-foreground">Payload version:</span> {timeline.routingEvent.payloadVersion}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Automation runs draft</p>
                    <div className="space-y-3">
                      {timeline.automationRuns.map((run) => (
                        <div key={run.id} className="rounded-xl border p-3">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm font-semibold text-foreground">{run.workflowKey}</p>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${runTone[run.status]}`}>
                              {run.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{run.notes}</p>
                        </div>
                      ))}
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

export default OperationalLeadConsole;
