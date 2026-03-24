-- Habilitar pg_net si no está habilitado
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Función que orquesta la llamada al orquestador n8n
CREATE OR REPLACE FUNCTION public.trigger_n8n_blueprint_request()
RETURNS TRIGGER AS $$
DECLARE
  n8n_webhook_url text := 'https://n8n.tu-dominio.com/webhook/bloque-cero-blueprint'; -- [!CAMBIAR ESTO AL TUYO]
BEGIN
  -- Usamos pg_net para hacer el dispatch asíncrono sin bloquear la base de datos
  PERFORM net.http_post(
      url := n8n_webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
          'type', 'nuevo_blueprint_request',
          'request_id', NEW.id,
          'user_id', NEW.user_id,
          'lead_id', NEW.lead_id,
          'diagnostic_answers', NEW.diagnostic_answers,
          'created_at', NEW.created_at
      )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar el trigger si ya existe para evitar duplicidades
DROP TRIGGER IF EXISTS on_blueprint_request_created ON public.blueprint_requests;

-- Vincular la función a cualquier INSERT en la tabla
CREATE TRIGGER on_blueprint_request_created
  AFTER INSERT ON public.blueprint_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_n8n_blueprint_request();
