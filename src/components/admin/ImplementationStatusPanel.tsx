import { implementationMetrics, implementationOverallProgress, implementationPhaseStatuses } from "@/lib/implementationMetrics";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ImplementationStatusPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Estado maestro de implementación</CardTitle>
              <CardDescription>
                Lectura operativa de avance para Bloque Cero según las fases 5–10 ya publicadas.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">{implementationOverallProgress}% estructurado</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={implementationOverallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            El proyecto ya salió del limbo de la especulación simpática: la base técnica existe, pero todavía faltan
            workflows, enforcement real y validación end-to-end.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {implementationMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {implementationPhaseStatuses.map((phase) => {
          const percent = Math.round((phase.completed / phase.total) * 100);
          return (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{phase.title}</CardTitle>
                    <CardDescription>{phase.helper}</CardDescription>
                  </div>
                  <Badge variant="outline">{phase.completed}/{phase.total}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={percent} className="h-2.5" />
                <p className="text-sm text-muted-foreground">Avance estructurado: {percent}%</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ImplementationStatusPanel;
