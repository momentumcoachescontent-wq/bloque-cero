import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { BloqueCeroCrmStage } from "@/lib/crmStageRules";

export type OperationalLeadAssessment = {
  suggestedStage: BloqueCeroCrmStage;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  readinessScore: number;
  requiredActions: string[];
  riskFlags: string[];
  reasoning: string;
};

const countBig6Signals = (item: UnifiedQueueItem) => {
  const big6 = item.diagnostic_answers?.big6 || [];
  const highSignals = big6.filter((entry) => entry.signal === 'Alto').length;
  const mediumSignals = big6.filter((entry) => entry.signal === 'Medio').length;
  const averageScore = big6.length
    ? big6.reduce((acc, entry) => acc + Number(entry.score || 0), 0) / big6.length
    : 0;

  return { highSignals, mediumSignals, averageScore, count: big6.length };
};

export const assessOperationalReadiness = (item: UnifiedQueueItem): OperationalLeadAssessment => {
  const hasDiagnostic = Boolean(item.diagnostic_answers);
  const hasRadarScore = typeof item.score === 'number';
  const hasBlueprintRequest = item.event_type === 'blueprint';
  const hasRecommendation = Boolean(item.diagnostic_answers?.recommended_block || item.business_name);
  const verdict = item.diagnostic_answers?.verdict?.toLowerCase() || '';
  const { highSignals, mediumSignals, averageScore, count } = countBig6Signals(item);

  const requiredActions: string[] = [];
  const riskFlags: string[] = [];

  let readinessScore = 0;
  if (hasDiagnostic) readinessScore += 20;
  if (hasRadarScore) readinessScore += 20;
  if (count >= 4) readinessScore += 15;
  if (averageScore >= 3.5) readinessScore += 15;
  if (highSignals >= 3) readinessScore += 10;
  if (hasRecommendation) readinessScore += 10;
  if (hasBlueprintRequest) readinessScore += 10;

  if (!hasDiagnostic) {
    requiredActions.push('Completar intake estructurado');
    return {
      suggestedStage: 'new_intake',
      priority: 'normal',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'No existe intake suficientemente estructurado para mover el lead más allá de new_intake.',
    };
  }

  if (!hasRadarScore) {
    requiredActions.push('Generar score o análisis Radar');
    return {
      suggestedStage: 'diagnosed',
      priority: 'normal',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'Hay intake, pero todavía falta una lectura cuantificable para empujar el caso a radar_analyzed.',
    };
  }

  if (verdict.includes('rech') || verdict.includes('no viable')) {
    requiredActions.push('Capturar rejection reason');
    riskFlags.push('Lead con señal explícita de bajo fit');
    return {
      suggestedStage: 'rejected',
      priority: 'low',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'El verdict actual sugiere descarte operativo o mal fit estructural.',
    };
  }

  if (averageScore < 2.5 || (count > 0 && highSignals === 0 && mediumSignals <= 1)) {
    requiredActions.push('Definir nurture reason y revisit rule');
    riskFlags.push('Señal de baja madurez o baja tracción operativa');
    return {
      suggestedStage: 'nurture',
      priority: 'low',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'El caso parece válido pero con bajo momentum; conviene nurture antes de forzar follow-up agresivo.',
    };
  }

  if (hasBlueprintRequest && (item.progress_day || 0) >= 1) {
    requiredActions.push('Asignar owner de seguimiento');
    requiredActions.push('Definir next action y due date');

    if ((item.progress_day || 0) >= 5) {
      riskFlags.push('Blueprint activo con riesgo de necesitar handoff a implementación');
      return {
        suggestedStage: 'implementation_ready',
        priority: 'high',
        readinessScore: Math.min(readinessScore + 10, 100),
        requiredActions,
        riskFlags,
        reasoning: 'El Blueprint ya está avanzado y el caso debe prepararse para transición a implementación o cierre ganador.',
      };
    }

    return {
      suggestedStage: 'proposal_path',
      priority: 'high',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'El lead ya activó expansión Blueprint; corresponde moverlo hacia una ruta de propuesta o bloque definido.',
    };
  }

  if (highSignals >= 3 || averageScore >= 3.8) {
    requiredActions.push('Asignar owner');
    requiredActions.push('Crear next action');
    requiredActions.push('Definir due date');
    return {
      suggestedStage: 'active_followup',
      priority: 'high',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'El score y la densidad de señales sugieren que el lead merece follow-up activo con disciplina operativa.',
    };
  }

  if (mediumSignals >= 2 || averageScore >= 3) {
    requiredActions.push('Revisión humana de caso');
    return {
      suggestedStage: 'qualified_review',
      priority: 'normal',
      readinessScore,
      requiredActions,
      riskFlags,
      reasoning: 'El caso tiene base suficiente, pero todavía requiere review humana antes de follow-up intenso.',
    };
  }

  requiredActions.push('Validar recomendación e intervención sugerida');
  return {
    suggestedStage: 'radar_analyzed',
    priority: 'normal',
    readinessScore,
    requiredActions,
    riskFlags,
    reasoning: 'El caso ya tiene intake y score, pero aún está mejor posicionado como radar_analyzed antes de review o seguimiento activo.',
  };
};
