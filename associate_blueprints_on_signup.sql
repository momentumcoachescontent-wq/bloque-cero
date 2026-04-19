-- ==============================================================================
-- FLUJO DE RECLAMACIÓN DE BLUEPRINTS (AUTO-LINKING)
-- ==============================================================================

-- 1. Actualizar la función para incluir la reclamación automática
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- A. Crear el perfil (si no existe)
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Cliente'),
    'client'::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;

  -- B. RECLAMACIÓN: Vincular blueprints huérfanos que coincidan con el email
  -- Buscamos en 'business_blueprints' (usando la tabla real en la DB)
  UPDATE public.business_blueprints
  SET user_id = new.id
  WHERE client_email = new.email 
    AND user_id IS NULL;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ejecutar vinculación manual inmediata para usuarios actuales que ya se registraron
-- Esto corrige cualquier registro que haya quedado huérfano antes de este trigger.
DO $$
BEGIN
  UPDATE public.business_blueprints bb
  SET user_id = p.id
  FROM public.profiles p
  WHERE bb.client_email = p.email 
    AND bb.user_id IS NULL;
END $$;
