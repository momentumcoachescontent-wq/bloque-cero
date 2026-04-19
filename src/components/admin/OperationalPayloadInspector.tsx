import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UnifiedQueueItem } from "@/hooks/useOmniFeed";
import { buildOperationalPayload } from "@/lib/operationalPayload";

interface OperationalPayloadInspectorProps {
  feed: UnifiedQueueItem[];
}

const OperationalPayloadInspector = ({ feed }: OperationalPayloadInspectorProps) => {
  const [selectedId, setSelectedId] = useState<string>(feed[0]?.id || '');

  const selectedLead = useMemo(
    () => feed.find((item) => item.id === selectedId) || feed[0],
    [feed, selectedId],
  );

  const payload = selectedLead ? buildOperationalPayload(selectedLead) : null;
  const payloadJson = payload ? JSON.stringify(payload, null, 2) : '';

  const copyPayload = async () => {
    if (!payloadJson) return;
    await navigator.clipboard.writeText(payloadJson);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational payload inspector</CardTitle>
        <CardDescription>
          Contrato normalizado por lead para futura persistencia, routing events y ejecución n8n. Aquí el lead ya empieza a verse como payload y no solo como intuición decorativa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay leads para generar payload operativo.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <Select value={selectedLead?.id} onValueChange={setSelectedId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {feed.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {(item.business_name || item.project_name || item.name || 'Lead sin nombre').slice(0, 80)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={copyPayload}>Copiar payload</Button>
            </div>

            <div className="rounded-2xl border bg-slate-950 p-4 text-xs text-slate-100 overflow-x-auto">
              <pre>{payloadJson}</pre>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OperationalPayloadInspector;
