import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useGlobalMetrics = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProfiles: 0,
    avgScore: 0,
    totalBlueprints: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoadingMetrics(true);

      const [leadsRes, blueprintsCountRes, profilesRes] = await Promise.all([
        supabase.from("leads").select("score"),
        supabase.from("business_blueprints").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      if (leadsRes.error) throw leadsRes.error;

      const leads = leadsRes.data || [];
      const scoredLeads = leads.filter(l => l.score !== null);
      const avg = scoredLeads.length > 0 
        ? Math.round(scoredLeads.reduce((acc, curr) => acc + (curr.score || 0), 0) / scoredLeads.length) 
        : 0;

      setStats({
        totalLeads: leads.length,
        totalProfiles: profilesRes.count || 0,
        avgScore: avg,
        totalBlueprints: blueprintsCountRes.count || 0,
      });

    } catch (error: unknown) {
      toast.error("Error al cargar métricas globales: " + (error as Error).message);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { stats, loadingMetrics, refetchMetrics: fetchMetrics };
};

