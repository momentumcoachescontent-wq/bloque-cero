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

      const [leadsRes, profilesRes, blueprintsRes] = await Promise.all([
        supabase.from("leads").select("score", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("blueprint_requests").select("id", { count: "exact" }),
      ]);

      let avg = 0;
      if (leadsRes.data && leadsRes.data.length > 0) {
        const validScores = leadsRes.data.filter(l => l.score !== null);
        if (validScores.length > 0) {
          const totalScore = validScores.reduce((acc, curr) => acc + (curr.score || 0), 0);
          avg = Math.round(totalScore / validScores.length);
        }
      }

      setStats({
        totalLeads: leadsRes.count || 0,
        totalProfiles: profilesRes.count || 0,
        avgScore: avg,
        totalBlueprints: blueprintsRes.count || 0,
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
