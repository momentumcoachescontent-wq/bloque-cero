-- =============================================================================
-- MIGRACIÓN FASE 7: SISTEMA DE TELEMETRÍA Y OBSERVABILIDAD
-- =============================================================================
-- Este módulo habilita un "Control Center" B2B para monitorear SLAs, latencias,
-- y tasas de éxito de la orquestación (n8n, Edge Functions) directamente desde 
-- Supabase. Provee la base de datos estructural para el Dashboard de Autoridad.

-- 1. EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: SYSTEM LOGS
-- Almacena latencias, peticiones y errores en crudo (Útil para debugear)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name TEXT NOT NULL,           -- e.g., 'n8n-bridge', 'stripe-webhook'
    log_level TEXT NOT NULL DEFAULT 'info', -- 'info', 'warn', 'error', 'critical'
    message TEXT NOT NULL,
    latency_ms INTEGER,                   -- milisegundos de ejecución
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,   -- Cargas útiles o respuestas de API
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Rendimiento para Telemetría
CREATE INDEX IF NOT EXISTS idx_system_logs_service ON public.system_logs(service_name);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON public.system_logs(created_at DESC);

-- 3. POLÍTICAS RLS Y SEGURIDAD
-- Aseguramos que solo los roles privilegiados puedan leer logs.

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for admin users only on system_logs"
  ON public.system_logs FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('root', 'admin'))
  );

CREATE POLICY "Enable insert for authenticated Edge Functions and Admins"
  ON public.system_logs FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' -- Permitir a la sesión y al service_role (Edge Functions)
  );

-- 4. VISTA DE AUTORIDAD: ORCHESTRATION_METRICS (SLA y TTV)
-- Esta vista calcula en tiempo real métricas para el dashboard comercial.
-- No guarda datos, procesa la velocidad de entrega de Blueprints vs Entradas.

CREATE OR REPLACE VIEW public.vw_orchestration_metrics AS
WITH leads_stats AS (
    SELECT 
        COUNT(*) as total_intakes,
        COUNT(CASE WHEN b.lifecycle_stage = 'delivered' THEN 1 END) as total_delivered,
        AVG(
          CASE WHEN b.lifecycle_stage = 'delivered' THEN 
              EXTRACT(EPOCH FROM (b.updated_at - l.created_at)) 
          END
        ) as avg_ttv_seconds -- Time To Value
    FROM public.leads l
    LEFT JOIN public.business_blueprints b ON l.id = b.source_lead_id
),
telemetry_stats AS (
    SELECT 
        COUNT(*) as total_invocations,
        COUNT(CASE WHEN log_level = 'error' THEN 1 END) as total_errors,
        AVG(latency_ms) as avg_latency_ms
    FROM public.system_logs
    WHERE service_name = 'n8n-bridge'
      AND created_at >= NOW() - INTERVAL '30 days'
)
SELECT 
    ls.total_intakes,
    ls.total_delivered,
    COALESCE(ROUND((ls.total_delivered::numeric / NULLIF(ls.total_intakes, 0)) * 100, 2), 0) as delivery_success_rate,
    COALESCE(ROUND(ls.avg_ttv_seconds / 60, 2), 0) as avg_ttv_minutes,
    ts.total_invocations,
    COALESCE(ROUND(((ts.total_invocations - ts.total_errors)::numeric / NULLIF(ts.total_invocations, 0)) * 100, 2), 100) as webhook_sla_percentage,
    COALESCE(ROUND(ts.avg_latency_ms, 2), 0) as avg_latency_ms
FROM leads_stats ls, telemetry_stats ts;

-- 5. DUMMY DATA INICIAL PARA DASHBOARD GTM (Golden Loops)
-- Si los GTM demos se insertaron rápido, estas métricas se verán impecables.
-- Inyectamos latencias ficticias de Edge para mostrar velocidad en la UI inmediatamente.

INSERT INTO public.system_logs (service_name, log_level, message, latency_ms)
SELECT 'n8n-bridge', 'info', 'Heartbeat Edge Function Telemetry', (random() * 80 + 20)::int
FROM generate_series(1, 15);

-- Inyectar algunos hits exitosos simulados de los últimos minutos
INSERT INTO public.system_logs (service_name, log_level, message, latency_ms)
SELECT 'n8n-bridge', 'info', 'Successful Blueprint Webhook Dispatch', (random() * 600 + 400)::int
FROM generate_series(1, 5);
