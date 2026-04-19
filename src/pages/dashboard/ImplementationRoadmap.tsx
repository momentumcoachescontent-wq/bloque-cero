import { Link } from "react-router-dom";
import { ShieldCheck, Database, Workflow, MessageSquare, LayoutPanelTop, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const phases = [
  {
    title: "Fase 5 — Base técnica previa",
    icon: ShieldCheck,
    status: "En documentación activa",
    bullets: [
      "Security Remediation Checklist definido",
      "Deploy Validation Runbook definido",
      "Release Gate Checklist definido",
      "Reglas mínimas para pasar a schema_ready documentadas",
    ],
  },
  {
    title: "Fase 6 — Core operacional",
    icon: Database,
    status: "Listo para implementación",
    bullets: [
      "SQL Schema Draft creado para Supabase",
      "Modelo canónico centrado en leads, tareas y stage events",
      "Transiciones CRM con enforcement backend definido",
      "Base operativa alineada a auto-crm",
    ],
  },
  {
    title: "Fase 7 — Automatización y conversación",
    icon: Workflow,
    status: "Secuenciado",
    bullets: [
      "Trigger matrix de n8n priorizada",
      "Payloads y reglas de idempotencia identificados",
      "Controles de handoff humano definidos",
      "Integración conversacional alineada a whatsapp-agentkit",
    ],
  },
  {
    title: "Fase 8 — Superficie Blueprint",
    icon: LayoutPanelTop,
    status: "Preparada",
    bullets: [
      "Blueprint de Negocio confirmado como superficie visible",
      "Radar embebido como módulo interno",
      "UI debe consumir estado canónico, no paralelos inventados",
      "Orden recomendado: backend primero, glamour después",
    ],
  },
  {
    title: "Fase 9 — Integración end-to-end",
    icon: MessageSquare,
    status: "Pendiente tras core",
    bullets: [
      "Cadena completa: intake → Radar → CRM → WhatsApp → handoff",
      "Pruebas happy-path y failure-path",
      "Validación de replay safety e idempotencia",
      "Visibilidad operativa cruzada obligatoria",
    ],
  },
  {
    title: "Fase 10 — Release readiness",
    icon: CheckCircle2,
    status: "Gate final",
    bullets: [
      "RLS, rollback y observabilidad mínima confirmados",
      "Runbook de despliegue aplicado al release candidate",
      "Checklist de release gate como control final",
      "Separación explícita entre v1 productivo y diferidos",
    ],
  },
];

const docs = [
  "Bloque Cero.md",
  "Bloque Cero - Security Remediation Checklist.md",
  "Bloque Cero - Deploy Validation Runbook.md",
  "Bloque Cero - Release Gate Checklist.md",
  "Bloque Cero - SQL Schema Draft.md",
  "Bloque Cero - App and Backend Rules.md",
];

const ImplementationRoadmap = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Implementación continua</p>
          <h1 className="text-3xl font-bold tracking-tight">Roadmap Maestro de Implementación</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Vista operativa del avance de Bloque Cero desde hardening técnico hasta release. La misión es simple:
            dejar de improvisar y construir un sistema que no se desarme con un deploy nervioso.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/blueprint">
            Abrir Blueprint Operativo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Camino crítico actual</CardTitle>
          <CardDescription>
            Seguridad → deploy → schema → reglas backend → workflows n8n → integración WhatsApp → superficie Blueprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-3 md:grid-cols-2">
            {[
              "Security remediation checklist",
              "Deploy validation runbook",
              "Release gate checklist",
              "SQL schema + RLS policy design",
              "App/backend rules para CRM y Radar",
              "Payload schemas e idempotencia",
              "Inventario de workflows n8n",
              "Integración conversacional WhatsApp",
              "Superficie Blueprint de Negocio",
              "Validación end-to-end",
              "Gate final de producción",
            ].map((item, index) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border bg-background/80 p-4 text-sm">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {phases.map((phase) => {
          const Icon = phase.icon;
          return (
            <Card key={phase.title} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{phase.title}</CardTitle>
                    <CardDescription>{phase.status}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {phase.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artefactos publicados</CardTitle>
          <CardDescription>
            Documentación ya empujada a GitHub `main` como base de implementación del proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {docs.map((doc) => (
              <div key={doc} className="rounded-xl border bg-muted/20 px-4 py-3 text-sm font-medium text-foreground">
                {doc}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImplementationRoadmap;
