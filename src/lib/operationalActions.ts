import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { OperationalLeadAssessment } from "@/lib/operationalReadiness";
import { BloqueCeroCrmStage } from "@/lib/crmStageRules";

export type SuggestedTask = {
  title: string;
  type: string;
  dueWindow: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  reason: string;
};

export type RoutingRecommendation = {
  queue: string;
  ownerRole: string;
  automationTrigger: string;
  notes: string;
};

export type OperationalActionPlan = {
  suggestedTasks: SuggestedTask[];
  routing: RoutingRecommendation;
  automationCandidates: string[];
};

const routingByStage: Record<BloqueCeroCrmStage, RoutingRecommendation> = {
  new_intake: {
    queue: 'inbox_review',
    ownerRole: 'Ops/CRM owner',
    automationTrigger: 'diagnostic_submission_stale',
    notes: 'Priorizar recuperación de intake antes de cualquier follow-up agresivo.',
  },
  diagnosed: {
    queue: 'strategy_review',
    ownerRole: 'Backend/data owner + Product owner',
    automationTrigger: 'radar_analysis_requested',
    notes: 'El siguiente movimiento natural es producir lectura Radar y normalizar señales.',
  },
  radar_analyzed: {
    queue: 'strategy_review',
    ownerRole: 'Product owner',
    automationTrigger: 'radar_analysis_completed',
    notes: 'La prioridad es convertir el análisis en dirección operativa visible.',
  },
  qualified_review: {
    queue: 'crm_ops',
    ownerRole: 'Ops/CRM owner',
    automationTrigger: 'sla_review_breach',
    notes: 'Revisión humana obligatoria antes de entrar a cadencia activa.',
  },
  active_followup: {
    queue: 'crm_ops',
    ownerRole: 'Owner asignado',
    automationTrigger: 'active_followup_entered',
    notes: 'Toda ejecución debe mantener next action viva y visibilidad de overdue.',
  },
  proposal_path: {
    queue: 'implementation_candidates',
    ownerRole: 'Product owner + Ops/CRM owner',
    automationTrigger: 'proposal_path_entered',
    notes: 'El caso ya está pidiendo propuesta estructurada o bloque concreto.',
  },
  implementation_ready: {
    queue: 'implementation_candidates',
    ownerRole: 'Implementation owner',
    automationTrigger: 'implementation_ready_entered',
    notes: 'Preparar handoff y evitar que el caso se oxide en transición.',
  },
  nurture: {
    queue: 'nurture_queue',
    ownerRole: 'Conversation owner',
    automationTrigger: 'nurture_entered',
    notes: 'Cadencia ligera y revisit programado; nada de perseguir fantasmas.',
  },
  closed_won: {
    queue: 'implementation_candidates',
    ownerRole: 'Implementation owner',
    automationTrigger: 'terminal_stage_entered',
    notes: 'Cerrar follow-up comercial y abrir seguimiento de ejecución.',
  },
  closed_lost: {
    queue: 'crm_ops',
    ownerRole: 'Ops/CRM owner',
    automationTrigger: 'terminal_stage_entered',
    notes: 'Registrar motivo de pérdida y decidir si aplica revisit futuro.',
  },
  rejected: {
    queue: 'inbox_review',
    ownerRole: 'Ops/CRM owner',
    automationTrigger: 'terminal_stage_entered',
    notes: 'Cerrar el caso con razón explícita y sin automatización ruidosa.',
  },
};

const tasksByStage: Record<BloqueCeroCrmStage, SuggestedTask[]> = {
  new_intake: [
    {
      title: 'Completar intake estructurado',
      type: 'intake_recovery',
      dueWindow: '24h',
      priority: 'normal',
      reason: 'Sin intake usable no existe base para Radar ni CRM real.',
    },
  ],
  diagnosed: [
    {
      title: 'Solicitar análisis Radar',
      type: 'radar_request',
      dueWindow: '24h',
      priority: 'normal',
      reason: 'Se requiere interpretación estructurada antes de follow-up serio.',
    },
  ],
  radar_analyzed: [
    {
      title: 'Revisar señales Radar y validar dirección',
      type: 'review_task',
      dueWindow: '24h',
      priority: 'normal',
      reason: 'El análisis ya existe; ahora toca convertirlo en decisión.',
    },
  ],
  qualified_review: [
    {
      title: 'Confirmar owner y ruta operativa',
      type: 'qualification_review',
      dueWindow: '24h',
      priority: 'high',
      reason: 'No debe quedar en revisión eterna como proyecto universitario maldito.',
    },
  ],
  active_followup: [
    {
      title: 'Definir next action y deadline',
      type: 'followup_task',
      dueWindow: 'same_day',
      priority: 'high',
      reason: 'Follow-up sin deadline es solo ansiedad con branding.',
    },
    {
      title: 'Activar recordatorio o contacto por WhatsApp',
      type: 'whatsapp_followup',
      dueWindow: '48h',
      priority: 'high',
      reason: 'Mantener momentum del caso mientras sigue vivo el interés.',
    },
  ],
  proposal_path: [
    {
      title: 'Preparar propuesta o bloque recomendado',
      type: 'proposal_task',
      dueWindow: '48h',
      priority: 'high',
      reason: 'El caso ya tiene claridad suficiente para aterrizar oferta.',
    },
  ],
  implementation_ready: [
    {
      title: 'Crear handoff a implementación',
      type: 'implementation_handoff',
      dueWindow: '24h',
      priority: 'urgent',
      reason: 'La ventana caliente de conversión no conviene enfriarla.',
    },
  ],
  nurture: [
    {
      title: 'Programar revisit y cadencia ligera',
      type: 'nurture_task',
      dueWindow: '7d',
      priority: 'low',
      reason: 'Mantener presencia sin quemar al lead ni al equipo.',
    },
  ],
  closed_won: [
    {
      title: 'Cerrar tareas comerciales y confirmar artefacto de ejecución',
      type: 'close_won_task',
      dueWindow: '24h',
      priority: 'high',
      reason: 'La victoria sin handoff limpio se convierte rápido en desorden.',
    },
  ],
  closed_lost: [
    {
      title: 'Registrar motivo de pérdida y evaluar revisit futuro',
      type: 'close_lost_task',
      dueWindow: '48h',
      priority: 'normal',
      reason: 'Perder sin aprender solo multiplica futuras pérdidas.',
    },
  ],
  rejected: [
    {
      title: 'Registrar rechazo y cerrar automatizaciones activas',
      type: 'rejection_task',
      dueWindow: '24h',
      priority: 'normal',
      reason: 'Debe quedar trazabilidad y silencio operativo después del descarte.',
    },
  ],
};

const automationByStage: Record<BloqueCeroCrmStage, string[]> = {
  new_intake: ['diagnostic_submission_stale'],
  diagnosed: ['radar_analysis_requested'],
  radar_analyzed: ['radar_analysis_completed', 'radar_requires_clarification'],
  qualified_review: ['sla_review_breach'],
  active_followup: ['active_followup_entered', 'crm_task_overdue', 'whatsapp_no_response_window'],
  proposal_path: ['proposal_path_entered'],
  implementation_ready: ['implementation_ready_entered'],
  nurture: ['nurture_entered'],
  closed_won: ['terminal_stage_entered'],
  closed_lost: ['terminal_stage_entered'],
  rejected: ['terminal_stage_entered'],
};

export const buildOperationalActionPlan = (
  item: UnifiedQueueItem,
  assessment: OperationalLeadAssessment,
): OperationalActionPlan => {
  const routing = routingByStage[assessment.suggestedStage];
  const suggestedTasks = [...tasksByStage[assessment.suggestedStage]];

  if (assessment.priority === 'urgent' || assessment.priority === 'high') {
    suggestedTasks.forEach((task) => {
      if (task.priority === 'normal') task.priority = 'high';
    });
  }

  if (item.event_type === 'blueprint' && assessment.suggestedStage === 'proposal_path') {
    suggestedTasks.push({
      title: 'Revisar entregables activos del Blueprint',
      type: 'delivery_review',
      dueWindow: '24h',
      priority: 'high',
      reason: 'El caso ya está expandido; conviene alinear propuesta con avance real del delivery.',
    });
  }

  return {
    suggestedTasks,
    routing,
    automationCandidates: automationByStage[assessment.suggestedStage],
  };
};
