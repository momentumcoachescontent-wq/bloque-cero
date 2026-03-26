// ============================================================
// Hook: useClientPortal
// Uso: const { portal, loading, error, refetch } = useClientPortal();
// ============================================================
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ── Tipos ────────────────────────────────────────────────────
export interface ClientDashboard {
  user_id: string;
  full_name: string | null;
  email: string;
  is_premium: boolean;
  total_projects: number;
  projects_done: number;
  projects_active: number;
  projects_pending: number;
  next_bloque: number | null;
  total_blueprints: number;
  blueprints_done: number;
  last_blueprint_at: string | null;
  last_blueprint_status: string | null;
  total_paid_mxn: number;
}

export interface ClientProject {
  id: string;
  bloque_number: number;
  bloque_name: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled';
  entregable_url: string | null;
  notes: string | null;
  started_at: string | null;
  delivered_at: string | null;
  created_at: string;
  days_in_progress: number | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | null;
  payment_amount: number | null;
  payment_currency: string | null;
}

export interface ClientBlueprint {
  id: string;
  status: string;
  status_label: string;
  progress_day: number;
  progress_pct: number;
  created_at: string;
  updated_at: string;
  has_pdf: boolean;
  has_presentation: boolean;
}

export interface ClientBlueprintDetail extends ClientBlueprint {
  blueprint_markdown: string | null;
  blueprint_generated_at: string | null;
  diagnostic_answers: Record<string, unknown> | null;
  satisfaction_score: number | null;
  pdf_url: string | null;
  presentation_url: string | null;
}

export interface ClientPortal {
  dashboard: ClientDashboard;
  projects: ClientProject[];
  blueprints: ClientBlueprint[];
  generated_at: string;
}

// ── Hook principal ────────────────────────────────────────────
export function useClientPortal() {
  const [portal, setPortal] = useState<ClientPortal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase
        .rpc('get_client_portal');
      if (rpcError) throw rpcError;
      setPortal(data as ClientPortal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el portal');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPortal(); }, [fetchPortal]);

  return { portal, loading, error, refetch: fetchPortal };
}

// ── Hook para detalle de blueprint ────────────────────────────
export function useBlueprintDetail(blueprintId: string | null) {
  const [blueprint, setBlueprint] = useState<ClientBlueprintDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blueprintId) return;
    setLoading(true);
    setError(null);
    supabase
      .rpc('get_blueprint_detail', { p_blueprint_id: blueprintId })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setBlueprint(data as ClientBlueprintDetail);
      })
      .finally(() => setLoading(false));
  }, [blueprintId]);

  return { blueprint, loading, error };
}

// ── Hook para calificar blueprint ─────────────────────────────
export function useRateBlueprint() {
  const [loading, setLoading] = useState(false);

  const rate = async (blueprintId: string, score: number, notes?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('rate_blueprint', {
        p_blueprint_id: blueprintId,
        p_score: score,
        p_notes: notes ?? null,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Error' };
    } finally {
      setLoading(false);
    }
  };

  return { rate, loading };
}

// ── Hook para actualizar perfil ───────────────────────────────
export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);

  const update = async (params: {
    full_name?: string;
    whatsapp?: string;
    avatar_url?: string;
  }) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_my_profile', {
        p_full_name:  params.full_name  ?? null,
        p_whatsapp:   params.whatsapp   ?? null,
        p_avatar_url: params.avatar_url ?? null,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Error' };
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
