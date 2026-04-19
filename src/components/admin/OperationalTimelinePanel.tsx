import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { buildOperationalTimelineDraft } from "@/lib/operationalEvents";

interface OperationalTimelinePanelProps {
  feed: UnifiedQueueItem[];
}

const statusTone = {
  draft: 'bg-slate-500/10 text-slate-500',
  ready: 'bg-emerald-500/10 text-emerald-600',
  blocked: 'bg-red-500/10 text-red-500',
};

const OperationalTimelinePanel = ({ feed }: OperationalTimelinePanelProps) => {
  const [selectedId, setSelectedId] = useState<string>(feed[0]?.id || '');

  const selectedLead = useMemo(
    () => feed.find((item) => item.id === selectedId) || feed[0],
    [feed, selectedId],
  );

  const timeline = selectedLead ? buildOperationalTimelineDraft(selectedLead) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline operativo draft</CardTitle>
        <CardDescription>
          Vista preliminar de routing event + automation runs derivados del payload operativo. Todavía no persiste, pero ya piensa como si fuera sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay leads para generar timeline draft.</p>
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

            {timeline && (
              <div className="space-y-5">
                <div className="rounded-2xl border bg-background p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Routing event draft</p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Event type</p>
                      <p className="text-sm font-semibold text-foreground">{timeline.routingEvent.eventType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">From → To</p>
                      <p className="text-sm font-semibold text-foreground">{timeline.routingEvent.fromState || 'unknown'} → {timeline.routingEvent.toState}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Queue</p>
                      <p className="text-sm font-semibold text-foreground">{timeline.routingEvent.targetQueue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Source module</p>
                      <p className="text-sm font-semibold text-foreground">{timeline.routingEvent.sourceModule}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payload version</p>
                      <p className="text-sm font-semibold text-foreground">{timeline.routingEvent.payloadVersion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Draft id</p>
                      <p className="text-sm font-semibold text-foreground">{timeline.routingEvent.id}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">
                    {timeline.routingEvent.routingReason}
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Automation runs draft</p>
                  <div className="space-y-3">
                    {timeline.automationRuns.map((run) => (
                      <div key={run.id} className="rounded-xl border p-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{run.workflowKey}</p>
                            <p className="text-xs text-muted-foreground">Trigger source: {run.triggerSource}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[run.status]}`}>
                            {run.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{run.notes}</p>
                      </div>
                    ))}
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

export default OperationalTimelinePanel;
