-- =============================================================================
-- MIGRACIÓN FASE 8: MONETIZACIÓN Y PAGOS STRIPE
-- =============================================================================

-- Modificar tabla business_blueprints para soportar monetización
ALTER TABLE public.business_blueprints
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Crear índice para búsquedas por stripe_session_id y stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_blueprints_stripe_session ON public.business_blueprints(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_stripe_customer ON public.business_blueprints(stripe_customer_id);

-- Opcional: Modificar la definición original en el script 02 por si se redespliega
-- (Esto se maneja solo corriendo esta migración adicional para no romper el estado).
