-- ==============================================================================
-- TRIGGER INQUEBRANTABLE: AUTO-CREADOR DE PERFILES
-- ==============================================================================

-- 1. Asegurar que la columna existe antes de que el trigger intente usarla
-- Nota: Esto se ejecuta una vez, pero lo ponemos aquí para trazabilidad del esquema.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- 2. Función inyectora que lee desde auth.users y materializa en public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario'), -- Manejo de nulos para evitar error 500
    'usuario' -- rol base por defecto
  )
  ON CONFLICT (id) DO NOTHING; -- Blindaje extra por si el perfil ya existe
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Conectar el gatillo al evento de autenticación (signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
