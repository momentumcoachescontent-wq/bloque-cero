import { implementationWorkstreams, statusTone } from "@/lib/implementationWorkstreams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ImplementationWorkstreamsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workstreams críticos</CardTitle>
        <CardDescription>
          Mapa operativo de los frentes que sostienen la implementación continua de Bloque Cero.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {implementationWorkstreams.map((workstream) => (
            <div key={workstream.id} className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{workstream.code}</Badge>
                    <h3 className="text-base font-semibold text-foreground">{workstream.title}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[workstream.status]}`}>
                      {workstream.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Owner:</span> {workstream.owner}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Milestone:</span> {workstream.milestone} · <span className="font-medium text-foreground">Foco:</span> {workstream.phaseFocus}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Dependencias</p>
                  <div className="flex flex-wrap gap-2">
                    {workstream.dependencies.map((dependency) => (
                      <span key={dependency} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                        {dependency}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Artefactos</p>
                  <div className="flex flex-wrap gap-2">
                    {workstream.artifacts.map((artifact) => (
                      <span key={artifact} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        {artifact}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImplementationWorkstreamsTable;
