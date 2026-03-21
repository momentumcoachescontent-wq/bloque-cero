-- 1. Agregar columna is_premium a profiles si no existe
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- 2. Asegurarse de que el usuario momentumcoaches.content@gmail.com sea admin y premium
-- Esto asume que el usuario ya inició sesión al menos una vez y existe en auth.users y public.profiles
UPDATE public.profiles
SET 
  role = 'admin'::public.user_role,
  is_premium = TRUE
WHERE email = 'momentumcoaches.content@gmail.com';

-- 3. Crear política para que admins puedan leer todos los profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING ( public.get_user_role() = 'admin' );

-- 4. Crear política para que admins puedan editar todos los profiles (para dar privilegios a otros)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING ( public.get_user_role() = 'admin' );

-- 5. Crear política para que admins puedan leer todos los leads
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
CREATE POLICY "Admins can view all leads" 
ON public.leads FOR SELECT 
USING ( public.get_user_role() = 'admin' );

-- 6. Crear política para que admins puedan editar todos los leads
DROP POLICY IF EXISTS "Admins can update all leads" ON public.leads;
CREATE POLICY "Admins can update all leads" 
ON public.leads FOR UPDATE 
USING ( public.get_user_role() = 'admin' );

-- 7. Crear política para que admins puedan leer todos los projects
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
CREATE POLICY "Admins can view all projects" 
ON public.projects FOR SELECT 
USING ( public.get_user_role() = 'admin' );

-- 8. Crear política para que usuarios puedan leer sus propios projects
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" 
ON public.projects FOR SELECT 
USING ( auth.uid() = client_id );
