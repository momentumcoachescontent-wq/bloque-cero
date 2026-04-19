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

      const [blueprintsRes, profilesRes] = await Promise.all([
        supabase.from("business_blueprints").select("*"),
        supabase.from("profiles").select("id", { count: "exact" }),
      ]);

      if (blueprintsRes.error) throw blueprintsRes.error;

      const blueprints = blueprintsRes.data || [];
      const scoredCount = blueprints.filter(item => item.intake_score !== null).length;
      const totalScore = blueprints.reduce((acc, curr) => acc + (curr.intake_score || 0), 0);
      const avg = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

      setStats({
        totalLeads: blueprints.filter(item => !item.source_blueprint_id).length,
        totalProfiles: profilesRes.count || 0,
        avgScore: avg,
        totalBlueprints: blueprints.filter(item => !!item.source_blueprint_id).length,
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

