export type ImplementationWorkstream = {
  id: string;
  code: string;
  title: string;
  owner: string;
  milestone: string;
  status: "defined" | "specified" | "schema_ready" | "build_ready" | "integrated" | "validated" | "open";
  phaseFocus: string;
  dependencies: string[];
  artifacts: string[];
};

export const implementationWorkstreams: ImplementationWorkstream[] = [
  {
    id: "workstream-a",
    code: "A",
    title: "Product surface / Blueprint de Negocio",
    owner: "Product owner + Product/design owner",
    milestone: "build_ready",
    status: "specified",
    phaseFocus: "Fase 8",
    dependencies: ["Diagnostic spec", "Radar spec", "Design conventions"],
    artifacts: ["Blueprint shell", "Diagnostic UX", "Radar summary surfaces"],
  },
  {
    id: "workstream-b",
    code: "B",
    title: "CRM operations",
    owner: "Ops/CRM owner + Backend/data owner",
    milestone: "schema_ready",
    status: "schema_ready",
    phaseFocus: "Fase 6",
    dependencies: ["CRM Operations Spec", "Stage transition map", "SQL schema draft"],
    artifacts: ["Lead model", "Stage events", "Task model", "Backend rules"],
  },
  {
    id: "workstream-c",
    code: "C",
    title: "Conversational automation",
    owner: "Conversation owner + Automation owner",
    milestone: "schema_ready",
    status: "specified",
    phaseFocus: "Fase 7",
    dependencies: ["WhatsApp spec", "CRM state rules", "n8n trigger matrix"],
    artifacts: ["Conversation state machine", "Reminder cadence", "Handoff logic"],
  },
  {
    id: "workstream-d",
    code: "D",
    title: "Design and documentation system",
    owner: "Product/design owner",
    milestone: "build_ready",
    status: "build_ready",
    phaseFocus: "Fase 5–8",
    dependencies: ["Design conventions spec", "Blueprint module definitions"],
    artifacts: ["Naming rules", "UI vocabulary", "Documentation templates"],
  },
  {
    id: "workstream-e",
    code: "E",
    title: "Security and deployment hardening",
    owner: "Security/release owner + Backend/data owner",
    milestone: "build_ready",
    status: "specified",
    phaseFocus: "Fase 5 / Fase 10",
    dependencies: ["Security checklist", "Deploy runbook", "Release gate checklist"],
    artifacts: ["RLS verification", "Docs cleanup", "Rollback discipline"],
  },
  {
    id: "workstream-f",
    code: "F",
    title: "Automation / orchestration integration",
    owner: "Automation owner",
    milestone: "schema_ready",
    status: "specified",
    phaseFocus: "Fase 7",
    dependencies: ["n8n trigger matrix", "Payload contracts", "Retry strategy"],
    artifacts: ["Workflow inventory", "Dedupe model", "Automation logging"],
  },
];

export const statusTone: Record<ImplementationWorkstream['status'], string> = {
  open: 'bg-muted text-muted-foreground',
  defined: 'bg-slate-500/10 text-slate-500',
  specified: 'bg-blue-500/10 text-blue-500',
  schema_ready: 'bg-amber-500/10 text-amber-600',
  build_ready: 'bg-emerald-500/10 text-emerald-600',
  integrated: 'bg-purple-500/10 text-purple-500',
  validated: 'bg-green-600/10 text-green-700',
};
