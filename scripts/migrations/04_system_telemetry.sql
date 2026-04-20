-- =============================================================================
-- MIGRACIÓN FASE 7: SISTEMA DE TELEMETRÍA Y OBSERVABILIDAD
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: SYSTEM LOGS
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name TEXT NOT NULL,
    log_level TEXT NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    latency_ms INTEGER,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_system_logs_service ON public.system_logs(service_name);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON public.system_logs(created_at DESC);

-- 3. POLÍTICAS RLS Y SEGURIDAD
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for admin users only on system_logs" ON public.system_logs;
CREATE POLICY "Enable read for admin users only on system_logs"
  ON public.system_logs
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id
      FROM public.profiles
      WHERE role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Enable insert for authenticated Edge Functions and Admins" ON public.system_logs;
CREATE POLICY "Enable insert for authenticated Edge Functions and Admins"
  ON public.system_logs
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
  );

-- 4. VISTA DE AUTORIDAD: ORCHESTRATION_METRICS
CREATE OR REPLACE VIEW public.vw_orchestration_metrics AS
WITH leads_stats AS (
    SELECT 
        COUNT(*) AS total_intakes,
        COUNT(CASE WHEN b.lifecycle_stage = 'delivered' THEN 1 END) AS total_delivered,
        AVG(
          CASE
            WHEN b.lifecycle_stage = 'delivered' THEN
              EXTRACT(EPOCH FROM (b.updated_at - l.created_at))
          END
        ) AS avg_ttv_seconds
    FROM public.leads l
    LEFT JOIN public.business_blueprints b
      ON l.id = b.source_lead_id
),
telemetry_stats AS (
    SELECT 
        COUNT(*) AS total_invocations,
        COUNT(CASE WHEN log_level = 'error' THEN 1 END) AS total_errors,
        AVG(latency_ms) AS avg_latency_ms
    FROM public.system_logs
    WHERE service_name = 'n8n-bridge'
      AND created_at >= NOW() - INTERVAL '30 days'
)
SELECT 
    ls.total_intakes,
    ls.total_delivered,
    COALESCE(
      ROUND((ls.total_delivered::numeric / NULLIF(ls.total_intakes, 0)) * 100, 2),
      0
    ) AS delivery_success_rate,
    COALESCE(ROUND((ls.avg_ttv_seconds / 60)::numeric, 2), 0) AS avg_ttv_minutes,
    ts.total_invocations,
    COALESCE(
      ROUND(((ts.total_invocations - ts.total_errors)::numeric / NULLIF(ts.total_invocations, 0)) * 100, 2),
      100
    ) AS webhook_sla_percentage,
    COALESCE(ROUND(ts.avg_latency_ms::numeric, 2), 0) AS avg_latency_ms
FROM leads_stats ls, telemetry_stats ts;

-- 5. DUMMY DATA INICIAL
INSERT INTO public.system_logs (service_name, log_level, message, latency_ms)
SELECT 'n8n-bridge', 'info', 'Heartbeat Edge Function Telemetry', (random() * 80 + 20)::int
FROM generate_series(1, 15);

INSERT INTO public.system_logs (service_name, log_level, message, latency_ms)
SELECT 'n8n-bridge', 'info', 'Successful Blueprint Webhook Dispatch', (random() * 600 + 400)::int
FROM generate_series(1, 5);
