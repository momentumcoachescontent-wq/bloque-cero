import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Lead, BlueprintRequest } from "@/types/database.types";

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

      let unified: FulfillmentItem[] = [];

      if (blueprintsData) {
        blueprintsData.forEach(req => {
          const relatedLead = leadsData?.find(l => l.id === req.lead_id) || {};

          const formats = [];
          if (req.format_pdf) formats.push('PDF Blueprint');
          if (req.format_presentation) formats.push('Pitch Deck');
          if (req.format_infographic) formats.push('Infografía');

          unified.push({
            id: req.id,
            type: 'blueprint',
            stageLabel: 'Blueprint Delivery',
            title: req.diagnostic_answers?.business_name || relatedLead.business_name || relatedLead.diagnostic_answers?.business_name || 'Proyecto Blueprint',
            clientName: req.diagnostic_answers?.name || relatedLead.name || 'Cliente Blueprint',
            clientEmail: req.diagnostic_answers?.email || relatedLead.email || 'N/A',
            createdAt: req.created_at,
            deadlineDays: 7,
            isCompleted: req.progress_day >= 7 || req.status === 'completed',
            progressDay: req.progress_day || 1,
            formats,
            sourceData: req
          });
        });
      }

      if (leadsData) {
        leadsData.forEach(lead => {
          unified.push({
            id: lead.id,
            type: 'radar',
            stageLabel: 'Blueprint Intake',
            title: lead.diagnostic_answers?.business_name || lead.business_name || lead.idea_description?.slice(0, 30) || 'Ingreso de Blueprint',
            clientName: lead.name || 'Prospecto',
            clientEmail: lead.email || 'N/A',
            createdAt: lead.created_at,
            deadlineDays: 2,
            isCompleted: lead.is_analysis_sent === true,
            formats: ['Análisis base de Blueprint'],
            sourceData: lead
          });
        });
      }

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
