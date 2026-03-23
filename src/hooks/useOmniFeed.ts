import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Lead, BlueprintRequest } from "@/types/database.types";

export type UnifiedQueueItem = Partial<Lead> & Partial<BlueprintRequest> & {
  id: string;
  event_type: 'radar' | 'blueprint';
  event_date: string;
  client_name?: string;
  client_email?: string;
  project_name?: string;
};

export const useOmniFeed = () => {
  const [feed, setFeed] = useState<UnifiedQueueItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  const fetchFeed = async () => {
    try {
      setLoadingFeed(true);

      const [leadsDataRes, blueprintsDataRes] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("blueprint_requests").select("*").order("created_at", { ascending: false })
      ]);

      const radarItems: UnifiedQueueItem[] = (leadsDataRes.data || []).map(r => ({ 
        ...r, 
        event_type: 'radar', 
        event_date: r.created_at 
      }));

      const blueprintItems: UnifiedQueueItem[] = (blueprintsDataRes.data || []).map(b => {
        const originalLead = leadsDataRes.data?.find(l => l.id === b.lead_id) || {};
        return { 
          ...b, 
          event_type: 'blueprint', 
          event_date: b.created_at,
          client_name: b.diagnostic_answers?.name || originalLead.name || 'Cliente de Blueprint',
          client_email: b.diagnostic_answers?.email || originalLead.email || 'N/A',
          project_name: b.diagnostic_answers?.business_name || originalLead.business_name || originalLead.diagnostic_answers?.business_name || 'Proyecto Blueprint'
        };
      });
      
      const unifiedList = [...radarItems, ...blueprintItems].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
      
      setFeed(unifiedList);
    } catch (error: unknown) {
      toast.error("Error al cargar feed de operaciones: " + (error as Error).message);
    } finally {
      setLoadingFeed(false);
    }
  };

  const deleteItem = async (id: string, type: 'radar' | 'blueprint') => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este ${type === 'blueprint'? 'proyecto':'prospecto'}? Esto no se puede deshacer.`)) return false;
    
    try {
      const table = type === 'radar' ? "leads" : "blueprint_requests";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Registro eliminado correctamente.");
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

  useEffect(() => {
    fetchFeed();
  }, []);

  return { feed, loadingFeed, refetchFeed: fetchFeed, deleteItem, toggleRadarFlag };
};
