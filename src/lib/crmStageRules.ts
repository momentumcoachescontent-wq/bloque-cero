export type BloqueCeroCrmStage =
  | 'new_intake'
  | 'diagnosed'
  | 'radar_analyzed'
  | 'qualified_review'
  | 'active_followup'
  | 'proposal_path'
  | 'implementation_ready'
  | 'nurture'
  | 'closed_won'
  | 'closed_lost'
  | 'rejected';

export type CrmTransitionContext = {
  hasUsableDiagnostic?: boolean;
  hasRadarAnalysis?: boolean;
  hasOwnerAssigned?: boolean;
  hasNextAction?: boolean;
  hasDueDate?: boolean;
  hasRecommendedIntervention?: boolean;
  hasImplementationReadiness?: boolean;
  hasNurtureReason?: boolean;
  hasFutureRevisit?: boolean;
  hasCloseReason?: boolean;
  hasRejectionReason?: boolean;
  hasOverrideReason?: boolean;
  hasImplementationEvidence?: boolean;
  hasOperatorReview?: boolean;
};

export type CrmTransitionResult = {
  allowed: boolean;
  reason: string;
  required: string[];
};

export const stageOrder: BloqueCeroCrmStage[] = [
  'new_intake',
  'diagnosed',
  'radar_analyzed',
  'qualified_review',
  'active_followup',
  'proposal_path',
  'implementation_ready',
  'nurture',
  'closed_won',
  'closed_lost',
  'rejected',
];

export const allowedTransitions: Record<BloqueCeroCrmStage, BloqueCeroCrmStage[]> = {
  new_intake: ['diagnosed', 'nurture', 'rejected'],
  diagnosed: ['radar_analyzed', 'qualified_review', 'nurture', 'rejected'],
  radar_analyzed: ['qualified_review', 'active_followup', 'nurture', 'rejected'],
  qualified_review: ['active_followup', 'proposal_path', 'nurture', 'closed_lost', 'rejected'],
  active_followup: ['proposal_path', 'implementation_ready', 'nurture', 'closed_lost', 'rejected'],
  proposal_path: ['implementation_ready', 'active_followup', 'nurture', 'closed_lost'],
  implementation_ready: ['closed_won', 'active_followup', 'closed_lost'],
  nurture: ['active_followup', 'qualified_review', 'closed_lost', 'rejected'],
  closed_won: ['active_followup'],
  closed_lost: ['active_followup', 'nurture'],
  rejected: ['qualified_review'],
};

const requirementsByDestination: Record<BloqueCeroCrmStage, (ctx: CrmTransitionContext) => string[]> = {
  new_intake: () => [],
  diagnosed: (ctx) => (ctx.hasUsableDiagnostic ? [] : ['diagnóstico utilizable']),
  radar_analyzed: (ctx) => (ctx.hasRadarAnalysis ? [] : ['análisis Radar']),
  qualified_review: (ctx) => (ctx.hasOperatorReview ? [] : ['revisión de operador o justificación explícita']),
  active_followup: (ctx) => {
    const required: string[] = [];
    if (!ctx.hasOwnerAssigned) required.push('owner o queue asignado');
    if (!ctx.hasNextAction) required.push('next action');
    if (!ctx.hasDueDate) required.push('due date');
    return required;
  },
  proposal_path: (ctx) => (ctx.hasRecommendedIntervention ? [] : ['intervención o bloque recomendado']),
  implementation_ready: (ctx) => {
    const required: string[] = [];
    if (!ctx.hasImplementationReadiness) required.push('confirmación de readiness');
    if (!ctx.hasOwnerAssigned) required.push('owner confirmado');
    return required;
  },
  nurture: (ctx) => {
    const required: string[] = [];
    if (!ctx.hasNurtureReason) required.push('razón de nurture');
    if (!ctx.hasFutureRevisit) required.push('mecanismo de revisit o recordatorio');
    return required;
  },
  closed_won: (ctx) => (ctx.hasImplementationEvidence ? [] : ['evidencia de handoff o artefacto de implementación']),
  closed_lost: (ctx) => (ctx.hasCloseReason ? [] : ['close reason']),
  rejected: (ctx) => (ctx.hasRejectionReason ? [] : ['rejection reason']),
};

const requiresOverride = (from: BloqueCeroCrmStage, to: BloqueCeroCrmStage) =>
  (from === 'closed_won' && to === 'active_followup') ||
  (from === 'closed_lost' && (to === 'active_followup' || to === 'nurture')) ||
  (from === 'rejected' && to === 'qualified_review');

export const validateCrmTransition = (
  from: BloqueCeroCrmStage,
  to: BloqueCeroCrmStage,
  context: CrmTransitionContext = {},
): CrmTransitionResult => {
  const allowed = allowedTransitions[from] || [];

  if (!allowed.includes(to)) {
    return {
      allowed: false,
      reason: `La transición ${from} → ${to} no está permitida por la política CRM vigente.`,
      required: [],
    };
  }

  const required = requirementsByDestination[to](context);

  if (requiresOverride(from, to) && !context.hasOverrideReason) {
    required.push('override reason');
  }

  if (required.length > 0) {
    return {
      allowed: false,
      reason: `Faltan condiciones obligatorias para mover el lead a ${to}.`,
      required,
    };
  }

  return {
    allowed: true,
    reason: `La transición ${from} → ${to} cumple las reglas mínimas definidas para Bloque Cero.`,
    required: [],
  };
};

export const describeStage = (stage: BloqueCeroCrmStage) => {
  const descriptions: Record<BloqueCeroCrmStage, string> = {
    new_intake: 'Lead capturado, todavía sin intake suficiente.',
    diagnosed: 'Intake estructurado ya utilizable.',
    radar_analyzed: 'Radar ya produjo lectura y recomendación.',
    qualified_review: 'Caso revisado por humano para confirmar dirección.',
    active_followup: 'Follow-up activo con owner y next action real.',
    proposal_path: 'Caso encaminado a propuesta o bloque definido.',
    implementation_ready: 'Caso listo para conversión a ejecución.',
    nurture: 'Lead válido pero no listo; entra a ritmo de seguimiento más ligero.',
    closed_won: 'Conversión confirmada a bloque/proyecto.',
    closed_lost: 'Oportunidad no avanza por timing o pérdida comercial.',
    rejected: 'Lead descartado por mal fit o criterio de exclusión.',
  };

  return descriptions[stage];
};
