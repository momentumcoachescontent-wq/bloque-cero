import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BloqueCeroCrmStage,
  CrmTransitionContext,
  describeStage,
  stageOrder,
  validateCrmTransition,
} from "@/lib/crmStageRules";

const initialContext: CrmTransitionContext = {
  hasUsableDiagnostic: false,
  hasRadarAnalysis: false,
  hasOwnerAssigned: false,
  hasNextAction: false,
  hasDueDate: false,
  hasRecommendedIntervention: false,
  hasImplementationReadiness: false,
  hasNurtureReason: false,
  hasFutureRevisit: false,
  hasCloseReason: false,
  hasRejectionReason: false,
  hasOverrideReason: false,
  hasImplementationEvidence: false,
  hasOperatorReview: false,
};

const toggles: Array<{ key: keyof CrmTransitionContext; label: string }> = [
  { key: 'hasUsableDiagnostic', label: 'Diagnóstico utilizable' },
  { key: 'hasRadarAnalysis', label: 'Análisis Radar disponible' },
  { key: 'hasOperatorReview', label: 'Revisión humana realizada' },
  { key: 'hasOwnerAssigned', label: 'Owner o queue asignado' },
  { key: 'hasNextAction', label: 'Next action definido' },
  { key: 'hasDueDate', label: 'Due date definida' },
  { key: 'hasRecommendedIntervention', label: 'Intervención o bloque recomendado' },
  { key: 'hasImplementationReadiness', label: 'Readiness confirmado' },
  { key: 'hasImplementationEvidence', label: 'Evidencia de implementación/handoff' },
  { key: 'hasNurtureReason', label: 'Razón de nurture' },
  { key: 'hasFutureRevisit', label: 'Mecanismo de revisit' },
  { key: 'hasCloseReason', label: 'Close reason' },
  { key: 'hasRejectionReason', label: 'Rejection reason' },
  { key: 'hasOverrideReason', label: 'Override reason' },
];

const CrmTransitionRulesPanel = () => {
  const [from, setFrom] = useState<BloqueCeroCrmStage>('new_intake');
  const [to, setTo] = useState<BloqueCeroCrmStage>('diagnosed');
  const [context, setContext] = useState<CrmTransitionContext>(initialContext);

  const result = useMemo(() => validateCrmTransition(from, to, context), [from, to, context]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulador de reglas CRM</CardTitle>
        <CardDescription>
          Traducción operativa del mapa de transiciones. Sirve para verificar si un cambio de etapa pasa o falla antes de tocar backend real.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Stage actual</Label>
            <Select value={from} onValueChange={(value) => setFrom(value as BloqueCeroCrmStage)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona stage actual" />
              </SelectTrigger>
              <SelectContent>
                {stageOrder.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{describeStage(from)}</p>
          </div>
          <div className="space-y-2">
            <Label>Stage destino</Label>
            <Select value={to} onValueChange={(value) => setTo(value as BloqueCeroCrmStage)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona stage destino" />
              </SelectTrigger>
              <SelectContent>
                {stageOrder.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{describeStage(to)}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {toggles.map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between rounded-xl border p-3">
              <Label htmlFor={toggle.key} className="text-sm leading-snug">{toggle.label}</Label>
              <Switch
                id={toggle.key}
                checked={Boolean(context[toggle.key])}
                onCheckedChange={(checked) =>
                  setContext((current) => ({
                    ...current,
                    [toggle.key]: checked,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border p-5 ${result.allowed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
          <div className="flex items-center gap-3">
            <Badge variant={result.allowed ? 'default' : 'destructive'}>
              {result.allowed ? 'Permitido' : 'Bloqueado'}
            </Badge>
            <p className="text-sm text-foreground">{result.reason}</p>
          </div>

          {!result.allowed && result.required.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Faltantes obligatorios</p>
              <div className="flex flex-wrap gap-2">
                {result.required.map((item) => (
                  <span key={item} className="rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrmTransitionRulesPanel;
