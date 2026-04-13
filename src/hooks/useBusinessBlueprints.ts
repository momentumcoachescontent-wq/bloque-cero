import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { BusinessBlueprint, mapRowToBusinessBlueprint } from "@/types/businessBlueprints";

export const useBusinessBlueprints = () => {
  const [items, setItems] = useState<BusinessBlueprint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('business_blueprints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const blueprints = (data || []).map(mapRowToBusinessBlueprint);
      setItems(blueprints);
    } catch (error: unknown) {
      console.error('Error fetching blueprints:', error);
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
