-- Habilitar pg_net si no está habilitado
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Función que orquesta la llamada al orquestador n8n (UNIFICADO)
CREATE OR REPLACE FUNCTION public.trigger_n8n_blueprint_orchestration()
RETURNS TRIGGER AS $$
DECLARE
  -- URL del webhook de n8n para generación de Blueprints
  n8n_webhook_url text := 'https://n8n-n8n.z3tydl.easypanel.host/webhook/bloque-cero-blueprint';
BEGIN
  -- Usamos pg_net para hacer el dispatch asíncrono sin bloquear la base de datos.
  -- Esto garantiza que inclusive peticiones anónimas disparen la IA.
  PERFORM net.http_post(
      url := n8n_webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
          'type', 'nuevo_blueprint_request',
          'request_id', NEW.id,
          'public_id', NEW.public_id,
          'user_id', NEW.user_id,
          'lead_id', NEW.source_lead_id,
          'diagnostic_answers', NEW.intake_payload,
          'created_at', NEW.created_at,
          'client_email', NEW.client_email,
          'business_name', NEW.business_name
      )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Limpieza de triggers antiguos
DROP TRIGGER IF EXISTS on_blueprint_request_created ON public.blueprint_requests;
DROP TRIGGER IF EXISTS tr_orchestrate_blueprint ON public.business_blueprints;

-- 2. Vincular el orquestador a la tabla unificada business_blueprints
-- Solo disparamos en INSERT (creación inicial del diagnóstico)
CREATE TRIGGER tr_orchestrate_blueprint
  AFTER INSERT ON public.business_blueprints
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_n8n_blueprint_orchestration();

