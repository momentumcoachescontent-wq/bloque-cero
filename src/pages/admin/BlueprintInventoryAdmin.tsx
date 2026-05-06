import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Loader2,
  RefreshCw,
  Tags,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createBlueprintBig6MetadataPatch } from "@/lib/blueprintBig6Report";
import { supabase } from "@/lib/supabase";

type JsonRecord = Record<string, unknown>;

type BlueprintInventoryItem = {
  id: string;
  public_id: string;
  business_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  user_id: string | null;
  lifecycle_stage: string | null;
  delivery_progress: number | null;
  is_premium: boolean | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string | null;
  data_class: string;
  requires_follow_up: boolean;
  payment_required: boolean;
  admin_note: string | null;
  has_preliminary: boolean;
  has_markdown: boolean;
  operational_status: string;
  needs_admin_attention: boolean;
  recommended_action: string;
  metadata: unknown;
};

const adminSupabase = supabase as unknown as SupabaseClient;

const toMetadataRecord = (metadata: unknown): JsonRecord => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata as JsonRecord;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const getBadgeClass = (value: string) => {
  if (["demo", "qa_fixture"].includes(value)) {
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  }

  if (["test", "legacy", "archived"].includes(value)) {
    return "bg-muted text-muted-foreground border-border";
  }

  if (["delivered"].includes(value)) {
    return "bg-green-500/10 text-green-600 border-green-500/20";
  }

  if (["stalled_after_preliminary", "delivered_missing_markdown", "failed"].includes(value)) {
    return "bg-red-500/10 text-red-600 border-red-500/20";
  }

  return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
};

const createDeliveredMetadataPatch = (item: BlueprintInventoryItem): JsonRecord => ({
  data_class: item.data_class === "real_or_unclassified" ? "qa_fixture" : item.data_class,
  requires_follow_up: false,
  ...createBlueprintBig6MetadataPatch({
    businessName: item.business_name,
    clientEmail: item.client_email,
    publicId: item.public_id,
    metadata: item.metadata,
  }),
  admin_note: "Avanzado manualmente a delivered con Blueprint v2 Big6 desde Admin Blueprint Inventory",
});
const BlueprintInventoryAdmin = () => {
  const [items, setItems] = useState<BlueprintInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [dataClassFilter, setDataClassFilter] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);

    const { data, error } = await adminSupabase
      .from("v_admin_blueprint_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error cargando inventario: " + error.message);
      setLoading(false);
      return;
    }

    setItems((data || []) as BlueprintInventoryItem[]);
    setLoading(false);
  };

  useEffect(() => {
    void fetchInventory();
  }, []);

  const updateBlueprint = async (
    item: BlueprintInventoryItem,
    updates: {
      lifecycle_stage?: string;
      delivery_progress?: number;
      is_premium?: boolean;
      payment_status?: string;
      metadataPatch?: JsonRecord;
    },
    successMessage: string
  ) => {
    setSavingId(item.id);

    const metadata = {
      ...toMetadataRecord(item.metadata),
      ...(updates.metadataPatch || {}),
      admin_updated_at: new Date().toISOString(),
    };

    const { error } = await adminSupabase
      .from("business_blueprints")
      .update({
        ...(updates.lifecycle_stage ? { lifecycle_stage: updates.lifecycle_stage } : {}),
        ...(typeof updates.delivery_progress === "number"
          ? { delivery_progress: updates.delivery_progress }
          : {}),
        ...(typeof updates.is_premium === "boolean" ? { is_premium: updates.is_premium } : {}),
        ...(updates.payment_status ? { payment_status: updates.payment_status } : {}),
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    setSavingId(null);

    if (error) {
      toast.error("No se pudo actualizar: " + error.message);
      return;
    }

    toast.success(successMessage);
    await fetchInventory();
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (dataClassFilter !== "all" && item.data_class !== dataClassFilter) return false;
      if (attentionOnly && !item.needs_admin_attention) return false;
      return true;
    });
  }, [items, dataClassFilter, attentionOnly]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      attention: items.filter((item) => item.needs_admin_attention).length,
      delivered: items.filter((item) => item.operational_status === "delivered").length,
      stalled: items.filter((item) => item.operational_status === "stalled_after_preliminary").length,
    };
  }, [items]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileSearch className="w-8 h-8 text-primary" />
            Inventario de Blueprints
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Control operativo para identificar ideas, usuario, estado, seguimiento y avance manual.
          </p>
        </div>

        <Button onClick={fetchInventory} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Sincronizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total</p>
          <p className="text-3xl font-black">{summary.total}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Requieren atención</p>
          <p className="text-3xl font-black text-red-500">{summary.attention}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Entregados</p>
          <p className="text-3xl font-black text-green-500">{summary.delivered}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Estancados</p>
          <p className="text-3xl font-black text-yellow-500">{summary.stalled}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={dataClassFilter}
            onChange={(event) => setDataClassFilter(event.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">Todas las clases</option>
            <option value="real">Real</option>
            <option value="qa_fixture">QA fixture</option>
            <option value="demo">Demo</option>
            <option value="test">Test</option>
            <option value="legacy">Legacy</option>
            <option value="real_or_unclassified">Sin clasificar</option>
          </select>

          <Button
            variant={attentionOnly ? "default" : "outline"}
            onClick={() => setAttentionOnly((value) => !value)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Solo atención
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-bold text-foreground">{filteredItems.length}</span> de{" "}
          <span className="font-bold text-foreground">{items.length}</span>
        </p>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-4">Proyecto / Usuario</th>
                <th className="text-left px-5 py-4">Clase</th>
                <th className="text-left px-5 py-4">Estado</th>
                <th className="text-left px-5 py-4">Contenido</th>
                <th className="text-left px-5 py-4">Acción recomendada</th>
                <th className="text-right px-5 py-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Cargando inventario...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No hay Blueprints con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-border/50 align-top">
                    <td className="px-5 py-5 min-w-[260px]">
                      <div className="font-bold text-foreground">{item.business_name || "Sin nombre"}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.client_email || "Sin email"}</div>
                      <div className="text-xs text-muted-foreground mt-1">Public ID: {item.public_id}</div>
                      <div className="text-[11px] text-muted-foreground/70 mt-2">{formatDate(item.created_at)}</div>
                    </td>

                    <td className="px-5 py-5">
                      <span className={`inline-flex border rounded-full px-2.5 py-1 text-xs font-bold ${getBadgeClass(item.data_class)}`}>
                        {item.data_class}
                      </span>
                      {item.requires_follow_up && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 font-bold">
                          <UserRoundCheck className="w-3 h-3" />
                          Seguimiento
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-5 min-w-[210px]">
                      <div className={`inline-flex border rounded-full px-2.5 py-1 text-xs font-bold ${getBadgeClass(item.operational_status)}`}>
                        {item.operational_status}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Stage: <span className="font-semibold">{item.lifecycle_stage || "N/A"}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Progress: <span className="font-semibold">{item.delivery_progress ?? 0}/7</span>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={item.has_preliminary ? "text-green-600" : "text-muted-foreground"}>
                          {item.has_preliminary ? "✓ Preliminary" : "— Preliminary"}
                        </span>
                        <span className={item.has_markdown ? "text-green-600" : "text-muted-foreground"}>
                          {item.has_markdown ? "✓ Markdown" : "— Markdown"}
                        </span>
                        <span className={item.is_premium ? "text-green-600" : "text-muted-foreground"}>
                          {item.is_premium ? "✓ Premium" : "— Premium"}
                        </span>
                        <span className={item.payment_required ? "text-yellow-600" : "text-green-600"}>
                          {item.payment_required ? "✓ Cobro activo" : "✓ Sin cobro"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-5 min-w-[220px]">
                      <p className="text-sm text-foreground">{item.recommended_action}</p>
                      {item.admin_note && (
                        <p className="text-xs text-muted-foreground mt-2 border-l-2 border-primary/30 pl-2">
                          {item.admin_note}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-col gap-2 items-end min-w-[210px]">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/b/${item.public_id}`, "_blank")}
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Abrir bóveda
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                metadataPatch: {
                                  data_class: "test",
                                  requires_follow_up: false,
                                  admin_note: "Marcado como test desde Admin Blueprint Inventory",
                                },
                              },
                              "Marcado como test"
                            )
                          }
                        >
                          <Tags className="w-3 h-3 mr-2" />
                          Marcar test
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                metadataPatch: {
                                  requires_follow_up: !item.requires_follow_up,
                                  admin_note: !item.requires_follow_up
                                    ? "Requiere seguimiento humano"
                                    : "Seguimiento humano desactivado",
                                },
                              },
                              !item.requires_follow_up ? "Seguimiento activado" : "Seguimiento desactivado"
                            )
                          }
                        >
                          <UserRoundCheck className="w-3 h-3 mr-2" />
                          {item.requires_follow_up ? "Quitar seguimiento" : "Dar seguimiento"}
                        </Button>

                        <Button
                          size="sm"
                          variant={item.payment_required ? "default" : "outline"}
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                metadataPatch: {
                                  payment_required: !item.payment_required,
                                  admin_note: !item.payment_required
                                    ? "Cobro activado desde Admin Blueprint Inventory"
                                    : "Cobro desactivado desde Admin Blueprint Inventory",
                                },
                              },
                              !item.payment_required ? "Cobro activado" : "Cobro desactivado"
                            )
                          }
                        >
                          {item.payment_required ? "Desactivar cobro" : "Activar cobro"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                lifecycle_stage: "archived",
                                metadataPatch: {
                                  data_class: item.data_class === "demo" ? "demo" : "test",
                                  requires_follow_up: false,
                                  admin_note: "Archivado desde Admin Blueprint Inventory",
                                },
                              },
                              "Blueprint archivado"
                            )
                          }
                        >
                          <Archive className="w-3 h-3 mr-2" />
                          Archivar
                        </Button>

                        <Button
                          size="sm"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                lifecycle_stage: "delivered",
                                delivery_progress: 7,
                                payment_status: item.payment_status || "pending",
                                metadataPatch: createDeliveredMetadataPatch(item),
                              },
                              "Blueprint v2 Big6 generado y avanzado a delivered"
                            )
                          }
                        >
                          <CheckCircle2 className="w-3 h-3 mr-2" />
                          Avanzar delivered
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlueprintInventoryAdmin;
