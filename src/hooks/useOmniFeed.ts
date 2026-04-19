import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Lead } from "@/types/database.types";
import { BusinessBlueprint } from "@/types/businessBlueprints";
import { useBusinessBlueprints } from "@/hooks/useBusinessBlueprints";

export type UnifiedQueueItem = BusinessBlueprint & {
  event_type: 'radar' | 'blueprint';
  event_date: string;
  client_name?: string;
  client_email?: string;
  project_name?: string;
  score?: number | null;
  status?: string | null;
  progress_day?: number | null;
  whatsapp?: string | null;
  name?: string | null;
  email?: string | null;
  business_name?: string | null;
  diagnostic_answers?: Lead['diagnostic_answers'] | null;
};

export const useOmniFeed = () => {
  const { items: blueprintItems, loading, refetch } = useBusinessBlueprints();
  const [feed, setFeed] = useState<UnifiedQueueItem[]>([]);

  useEffect(() => {
    const normalized: UnifiedQueueItem[] = blueprintItems.map(item => ({
      ...item,
      event_type: item.sourceBlueprintRequestId ? 'blueprint' : 'radar',
      event_date: item.createdAt,
      client_name: item.clientName,
      client_email: item.clientEmail,
      project_name: item.businessName,
      score: item.intakeScore,
      status: item.deliveryStatus || item.lead?.status || item.lifecycleStage,
      progress_day: item.deliveryProgressDay,
      whatsapp: item.clientPhone,
      name: item.lead?.name || item.clientName,
      email: item.lead?.email || item.clientEmail,
      business_name: item.lead?.business_name || item.businessName,
      diagnostic_answers: item.lead?.diagnostic_answers || item.blueprintRequest?.diagnostic_answers || null,
    }));

    setFeed(normalized);
  }, [blueprintItems]);

  const deleteItem = async (id: string, type: 'radar' | 'blueprint') => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este registro? Esto afectará tanto al cliente como al administrador.`)) return false;
    
    try {
      // 1. Obtener info del blueprint para saber si tiene un lead asociado
      const { data: bp } = await supabase
        .from("business_blueprints")
        .select("source_lead_id")
        .eq("id", id)
        .single();

      // 2. Borrar el blueprint (La tabla unificada)
      const { error: bpError } = await supabase.from("business_blueprints").delete().eq("id", id);
      if (bpError) throw bpError;

      // 3. Borrar el lead asociado si existe (Limpieza completa de fantasma)
      if (bp?.source_lead_id) {
        await supabase.from("leads").delete().eq("id", bp.source_lead_id);
      }
      
      toast.success("Registro eliminado de forma permanente.");
      setFeed(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error: unknown) {
      toast.error("Error al eliminar: " + (error as Error).message);
      return false;
    }
  };


  const toggleRadarFlag = async (id: string, field: 'is_analysis_generated' | 'is_analysis_sent', currentValue: boolean) => {
    try {
      const { error } = await supabase.from("leads").update({ [field]: !currentValue }).eq("id", id);
      if (error) throw error;
      
      setFeed(prev => prev.map(l => l.id === id ? { ...l, [field]: !currentValue } : l));
      toast.success("Estado actualizado");
      return true;
    } catch (error: unknown) {
      toast.error("Error al actualizar: " + (error as Error).message);
      return false;
    }
  };

  return { feed, loadingFeed: loading, refetchFeed: refetch, deleteItem, toggleRadarFlag };
};
