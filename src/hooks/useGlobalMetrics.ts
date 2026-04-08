import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { mapCollectionsToBusinessBlueprints } from "@/types/businessBlueprints";

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

      const [leadsRes, profilesRes, blueprintsRes] = await Promise.all([
        supabase.from("leads").select("*"),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("blueprint_requests").select("*"),
      ]);

      const canonical = mapCollectionsToBusinessBlueprints(leadsRes.data || [], blueprintsRes.data || []);
      const scored = canonical.filter(item => item.intakeScore !== null);
      const avg = scored.length
        ? Math.round(scored.reduce((acc, curr) => acc + (curr.intakeScore || 0), 0) / scored.length)
        : 0;

      setStats({
        totalLeads: canonical.filter(item => !item.sourceBlueprintRequestId).length,
        totalProfiles: profilesRes.count || 0,
        avgScore: avg,
        totalBlueprints: canonical.filter(item => !!item.sourceBlueprintRequestId).length,
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
