import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Lead, BlueprintRequest } from "@/types/database.types";
import { BusinessBlueprint, mapCollectionsToBusinessBlueprints } from "@/types/businessBlueprints";

export const useBusinessBlueprints = () => {
  const [items, setItems] = useState<BusinessBlueprint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const [leadsRes, requestsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('blueprint_requests').select('*').order('created_at', { ascending: false }),
      ]);

      if (leadsRes.error) throw leadsRes.error;
      if (requestsRes.error) throw requestsRes.error;

      const leads = (leadsRes.data || []) as Lead[];
      const requests = (requestsRes.data || []) as BlueprintRequest[];
      setItems(mapCollectionsToBusinessBlueprints(leads, requests));
    } catch (error: unknown) {
      toast.error('Error al cargar business blueprints: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, refetch: fetchItems };
};
