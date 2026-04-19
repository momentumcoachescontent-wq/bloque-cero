export type ImplementationMetric = {
  label: string;
  value: number;
  helper: string;
};

export type ImplementationPhaseStatus = {
  id: string;
  title: string;
  completed: number;
  total: number;
  helper: string;
};

export const implementationMetrics: ImplementationMetric[] = [
  {
    label: "Artefactos críticos",
    value: 6,
    helper: "Plan maestro + seguridad + deploy + release + schema + reglas backend",
  },
  {
    label: "Fases visibles",
    value: 6,
    helper: "Fases 5 a 10 publicadas y secuenciadas",
  },
  {
    label: "Workstreams en camino crítico",
    value: 5,
    helper: "Seguridad, datos, automatización, conversación y superficie",
  },
  {
    label: "Estado actual",
    value: 1,
    helper: "Pre-implementación técnica ya en ejecución",
  },
];

export const implementationPhaseStatuses: ImplementationPhaseStatus[] = [
  {
    id: "phase-5",
    title: "Fase 5 — Base técnica previa",
    completed: 4,
    total: 4,
    helper: "Checklists y controles fundacionales ya creados",
  },
  {
    id: "phase-6",
    title: "Fase 6 — Core operacional",
    completed: 2,
    total: 4,
    helper: "Schema draft y reglas backend listas; falta ejecución real en backend",
  },
  {
    id: "phase-7",
    title: "Fase 7 — Automatización y conversación",
    completed: 1,
    total: 4,
    helper: "Secuencia documentada; workflows aún no aterrizados en infraestructura",
  },
  {
    id: "phase-8",
    title: "Fase 8 — Superficie Blueprint",
    completed: 1,
    total: 4,
    helper: "Ya existe vista de roadmap; falta acoplarla al estado canónico operativo",
  },
  {
    id: "phase-9",
    title: "Fase 9 — Integración end-to-end",
    completed: 0,
    total: 4,
    helper: "Pendiente después de backend y workflows",
  },
  {
    id: "phase-10",
    title: "Fase 10 — Release readiness",
    completed: 1,
    total: 4,
    helper: "Gate definido, pero aún sin evidencias de release candidate",
  },
];

export const implementationOverallProgress = Math.round(
  implementationPhaseStatuses.reduce((acc, phase) => acc + phase.completed, 0) /
    implementationPhaseStatuses.reduce((acc, phase) => acc + phase.total, 0) *
    100,
);
