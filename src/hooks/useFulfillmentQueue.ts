import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Lead, BlueprintRequest } from "@/types/database.types";
import { BusinessBlueprint, mapCollectionsToBusinessBlueprints } from "@/types/businessBlueprints";

export interface FulfillmentItem {
  id: string;
  type: 'radar' | 'blueprint';
  stageLabel: 'Blueprint Intake' | 'Blueprint Delivery';
  title: string;
  clientName: string;
  clientEmail: string;
  createdAt: string;
  deadlineDays: number;
  isCompleted: boolean;
  progressDay?: number;
  formats: string[];
  sourceData: Lead | BlueprintRequest;
  businessBlueprint: BusinessBlueprint;
}

export const useFulfillmentQueue = () => {
  const [items, setItems] = useState<FulfillmentItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoadingQueue(true);

      const { data: blueprintsData, error: bpError } = await supabase
        .from('blueprint_requests')
        .select(`*`);

      if (bpError) {
        toast.error("Aviso: No se pudieron cargar las entregas de Blueprint (" + bpError.message + ")");
      }

      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*');

      if (leadsError) {
        toast.error("Aviso: No se pudieron cargar los ingresos de Blueprint (" + leadsError.message + ")");
      }

      const canonical = mapCollectionsToBusinessBlueprints(leadsData || [], blueprintsData || []);
      let unified: FulfillmentItem[] = canonical.map(bp => {
        const isDelivery = !!bp.sourceBlueprintRequestId;
        const formats = isDelivery
          ? bp.requestedFormats.map(f => f === 'pdf' ? 'PDF Blueprint' : f === 'presentation' ? 'Pitch Deck' : f === 'infographic' ? 'Infografía' : f)
          : ['Análisis base de Blueprint'];

        return {
          id: bp.id,
          type: isDelivery ? 'blueprint' : 'radar',
          stageLabel: isDelivery ? 'Blueprint Delivery' : 'Blueprint Intake',
          title: bp.businessName,
          clientName: bp.clientName,
          clientEmail: bp.clientEmail,
          createdAt: bp.createdAt,
          deadlineDays: isDelivery ? 7 : 2,
          isCompleted: isDelivery ? bp.lifecycleStage === 'delivered' : bp.lead?.is_analysis_sent === true,
          progressDay: isDelivery ? (bp.deliveryProgressDay || 1) : undefined,
          formats,
          sourceData: isDelivery ? (bp.blueprintRequest as BlueprintRequest) : (bp.lead as Lead),
          businessBlueprint: bp,
        };
      });

      unified.sort((a, b) => {
        const getRemainingDays = (item: FulfillmentItem) => {
          const start = new Date(item.createdAt);
          const deadline = new Date(start.getTime() + item.deadlineDays * 24 * 60 * 60 * 1000);
          return (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        };

        if (a.isCompleted && !b.isCompleted) return 1;
        if (!a.isCompleted && b.isCompleted) return -1;

        return getRemainingDays(a) - getRemainingDays(b);
      });

      setItems(unified);
    } catch (err: unknown) {
      toast.error("Error cargando cola de fulfillment: " + (err as Error).message);
    } finally {
      setLoadingQueue(false);
    }
  };

  const updateBlueprintProgress = async (id: string, newDay: number) => {
    try {
      const { error } = await supabase
        .from('blueprint_requests')
        .update({ progress_day: newDay, status: newDay >= 7 ? 'completed' : 'analyzing' })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Blueprint actualizado al Día ${newDay}`);
      setItems(prev => prev.map(r => r.id === id ? { ...r, progressDay: newDay, isCompleted: newDay >= 7 } : r));
    } catch (err: unknown) {
      toast.error("Error al actualizar Blueprint: " + (err as Error).message);
    }
  };

  const toggleIntakeCompletion = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ is_analysis_generated: !currentStatus, is_analysis_sent: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Blueprint Intake marcado como ${!currentStatus ? 'Completado' : 'Pendiente'}`);
      setItems(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !currentStatus } : r));
    } catch (err: unknown) {
      toast.error("Error al actualizar Blueprint Intake: " + (err as Error).message);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return { items, loadingQueue, refetchQueue: fetchQueue, updateBlueprintProgress, toggleIntakeCompletion };
};
