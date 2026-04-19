import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { buildOperationalPayload } from "@/lib/operationalPayload";

export type RoutingEventDraft = {
  id: string;
  leadId: string;
  eventType: string;
  sourceModule: 'radar' | 'blueprint' | 'crm' | 'automation';
  fromState: string | null;
  toState: string;
  targetQueue: string;
  routingReason: string;
  payloadVersion: string;
  createdAt: string;
};

export type AutomationRunDraft = {
  id: string;
  leadId: string;
  workflowKey: string;
  triggerSource: string;
  status: 'draft' | 'ready' | 'blocked';
  notes: string;
  createdAt: string;
};

export type OperationalTimelineDraft = {
  routingEvent: RoutingEventDraft;
  automationRuns: AutomationRunDraft[];
};

const sanitizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

export const buildOperationalTimelineDraft = (item: UnifiedQueueItem): OperationalTimelineDraft => {
  const payload = buildOperationalPayload(item);
  const baseId = sanitizeKey(`${payload.lead.id}_${payload.assessment.suggestedStage}`);
  const fromState = item.status || null;
  const createdAt = new Date().toISOString();

  const routingEvent: RoutingEventDraft = {
    id: `route_${baseId}`,
    leadId: payload.lead.id,
    eventType: payload.automation.eventHint,
    sourceModule: item.event_type === 'blueprint' ? 'blueprint' : 'radar',
    fromState,
    toState: payload.assessment.suggestedStage,
    targetQueue: payload.routing.queue,
    routingReason: payload.assessment.reasoning,
    payloadVersion: payload.automation.payloadVersion,
    createdAt,
  };

  const automationRuns: AutomationRunDraft[] = payload.automation.candidates.map((candidate, index) => ({
    id: `run_${baseId}_${index + 1}`,
    leadId: payload.lead.id,
    workflowKey: candidate,
    triggerSource: payload.automation.eventHint,
    status: payload.assessment.requiredActions.length > 0 ? 'blocked' : 'ready',
    notes:
      payload.assessment.requiredActions.length > 0
        ? `Bloqueado hasta resolver: ${payload.assessment.requiredActions.join(', ')}`
        : `Listo para activarse desde ${payload.routing.queue}`,
    createdAt,
  }));

  return {
    routingEvent,
    automationRuns,
  };
};
