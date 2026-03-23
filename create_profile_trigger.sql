-- ==============================================================================
-- TRIGGER INQUEBRANTABLE: AUTO-CREADOR DE PERFILES
-- ==============================================================================

-- 1. Función inyectora que lee desde auth.users y materializa en public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'usuario' -- rol base por defecto
  )
  ON CONFLICT (id) DO NOTHING; -- Blindaje extra por si el perfil ya existe
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Conectar el gatillo al evento de autenticación (signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
