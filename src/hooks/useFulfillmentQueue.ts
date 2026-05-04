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
  businessType?: string;
  pains?: string[];
  isHighBurnout?: boolean;
  sourceData: Lead | BlueprintRequest;
  businessBlueprint: BusinessBlueprint;
}

export const useFulfillmentQueue = () => {
  const [items, setItems] = useState<FulfillmentItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoadingQueue(true);

      const { data, error } = await supabase
        .from('business_blueprints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const blueprints = (data || []).map(row => {
        const isDelivery = row.source_blueprint_id !== null;
        const formats = (row.requested_formats || []);

        return {
          id: row.id,
          type: isDelivery ? ('blueprint' as const) : ('radar' as const),
          stageLabel: isDelivery ? ('Blueprint Delivery' as const) : ('Blueprint Intake' as const),
          title: row.business_name || 'Sin nombre de negocio',
          clientName: row.client_name || 'Sin nombre',
          clientEmail: row.client_email,
          createdAt: row.created_at,
          deadlineDays: isDelivery ? 7 : 2,
          isCompleted: row.lifecycle_stage === 'delivered' || row.lifecycle_stage === 'completed',
          progressDay: row.delivery_progress || 1,
          formats,
          businessType: row.intake_payload?.business_profile?.type || row.intake_payload?.type || 'N/A',
          pains: row.intake_payload?.business_profile?.dolores || row.intake_payload?.dolores || [],
          isHighBurnout: (row.intake_payload?.business_profile?.dolores || row.intake_payload?.dolores || []).some(p => 
            ['agotamiento_1_1', 'agenda_saturada', 'dependencia_delivery'].includes(p)
          ),
          sourceData: row, 
          businessBlueprint: row, 
        };
      });

      blueprints.sort((a, b) => {
        const getRemainingDays = (item: Pick<FulfillmentItem, 'createdAt' | 'deadlineDays'>) => {
          const start = new Date(item.createdAt);
          const deadline = new Date(start.getTime() + item.deadlineDays * 24 * 60 * 60 * 1000);
          return (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        };

        if (a.isCompleted && !b.isCompleted) return 1;
        if (!a.isCompleted && b.isCompleted) return -1;

        return getRemainingDays(a) - getRemainingDays(b);
      });

      setItems(blueprints as FulfillmentItem[]);
    } catch (err: unknown) {
      toast.error("Error cargando cola de fulfillment: " + (err as Error).message);
    } finally {
      setLoadingQueue(false);
    }
  };

  const updateBlueprintProgress = async (id: string, newDay: number) => {
    try {
      const { error } = await supabase
        .from('business_blueprints')
        .update({ 
          delivery_progress: newDay, 
          lifecycle_stage: newDay >= 7 ? 'delivered' : 'expanded' 
        })
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
        .from('business_blueprints')
        .update({ 
          lifecycle_stage: !currentStatus ? 'scored' : 'captured'
        })
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
