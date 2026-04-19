-- =============================================================================
-- REPARACIÓN DE ORQUESTACIÓN ESTANCADA - BLOQUE CERO
-- =============================================================================
-- Este script fuerza el envío del webhook a n8n para cualquier registro 
-- que esté en estado 'captured' pero no haya recibido su análisis.
-- =============================================================================

DO $$
DECLARE
  r RECORD;
  v_webhook_url TEXT := 'https://n8n-n8n.z3tydl.easypanel.host/webhook/bloque-cero-blueprint';
BEGIN
  -- Iteramos sobre los registros que necesitan ser orquestados
  -- Filtramos por el usuario ealvareze1@hotmail.com o por estado general 'captured'
  FOR r IN 
    SELECT * FROM public.business_blueprints 
    WHERE (client_email = 'ealvareze1@hotmail.com' OR lifecycle_stage = 'captured')
    AND created_at > now() - interval '24 hours' -- Solo registros recientes para evitar backups masivos
  LOOP
    RAISE NOTICE 'Reparando Blueprint ID: %, Email: %', r.id, r.client_email;
    
    PERFORM net.http_post(
        url := v_webhook_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object(
            'type', 'nuevo_blueprint_request',
            'request_id', r.id,
            'public_id', r.public_id,
            'user_id', r.user_id,
            'lead_id', r.source_lead_id,
            'diagnostic_answers', r.intake_payload,
            'created_at', r.created_at,
            'client_email', r.client_email,
            'business_name', r.business_name,
            'repair_mode', true -- Flag para que n8n sepa que es un re-intento
        )
    );
  END LOOP;
END $$;
