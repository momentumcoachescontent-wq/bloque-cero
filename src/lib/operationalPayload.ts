import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { assessOperationalReadiness } from "@/lib/operationalReadiness";
import { buildOperationalActionPlan } from "@/lib/operationalActions";

export type OperationalPayload = {
  lead: {
    id: string;
    type: 'radar' | 'blueprint';
    name: string | null;
    email: string | null;
    whatsapp: string | null;
    businessName: string | null;
    createdAt: string;
  };
  assessment: {
    suggestedStage: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    readinessScore: number;
    reasoning: string;
    requiredActions: string[];
    riskFlags: string[];
  };
  routing: {
    queue: string;
    ownerRole: string;
    automationTrigger: string;
    notes: string;
  };
  tasks: Array<{
    title: string;
    type: string;
    dueWindow: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    reason: string;
  }>;
  automation: {
    candidates: string[];
    payloadVersion: string;
    eventHint: string;
  };
  source: {
    score: number | null;
    status: string | null;
    progressDay: number | null;
    hasDiagnosticAnswers: boolean;
    hasBig6: boolean;
    recommendedBlock: string | null;
    verdict: string | null;
  };
};

export const buildOperationalPayload = (item: UnifiedQueueItem): OperationalPayload => {
  const assessment = assessOperationalReadiness(item);
  const plan = buildOperationalActionPlan(item, assessment);

  return {
    lead: {
      id: item.id,
      type: item.event_type,
      name: item.name || item.client_name || null,
      email: item.email || item.client_email || null,
      whatsapp: item.whatsapp || null,
      businessName: item.business_name || item.project_name || null,
      createdAt: item.event_date,
    },
    assessment: {
      suggestedStage: assessment.suggestedStage,
      priority: assessment.priority,
      readinessScore: assessment.readinessScore,
      reasoning: assessment.reasoning,
      requiredActions: assessment.requiredActions,
      riskFlags: assessment.riskFlags,
    },
    routing: plan.routing,
    tasks: plan.suggestedTasks,
    automation: {
      candidates: plan.automationCandidates,
      payloadVersion: 'bloque-cero-operational-v1',
      eventHint: `${assessment.suggestedStage}_suggested`,
    },
    source: {
      score: item.score ?? null,
      status: item.status ?? null,
      progressDay: item.progress_day ?? null,
      hasDiagnosticAnswers: Boolean(item.diagnostic_answers),
      hasBig6: Boolean(item.diagnostic_answers?.big6?.length),
      recommendedBlock: item.diagnostic_answers?.recommended_block || null,
      verdict: item.diagnostic_answers?.verdict || null,
    },
  };
};
