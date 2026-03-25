-- ==============================================================================
-- OPTIMIZACIÓN DE SEGURIDAD Y PERFORMANCE (SUPABASE LINTER)
-- Este script resuelve las alertas de "Auth RLS Initialization Plan",
-- "Multiple Permissive Policies", "Policy Exists RLS Disabled" y 
-- "Function Search Path Mutable".
-- ==============================================================================

-- 1. SECURITY: Habilitar RLS en `leads` que estaba público pero con políticas flotantes
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. SECURITY: Setear el search_path seguro para la función del trigger
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- 3. PERFORMANCE: Recrear políticas usando `(select auth.uid())` para InitPlan
-- y asignando roles específicos (`TO authenticated`, `TO anon`) para evitar
-- "Multiple Permissive Policies" por traslape de roles en PUBLIC.

--------------------------------------------------------------------------------
-- TABLA: profiles
--------------------------------------------------------------------------------
-- Limpieza de políticas duplicadas
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT TO authenticated 
USING ( (select auth.jwt()->>'email') = 'momentumcoaches.content@gmail.com' );

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE TO authenticated 
USING ( (select auth.jwt()->>'email') = 'momentumcoaches.content@gmail.com' );

CREATE POLICY "Users can read their own profile" 
ON public.profiles FOR SELECT TO authenticated 
USING ( (select auth.uid()) = id );

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated 
USING ( (select auth.uid()) = id );

--------------------------------------------------------------------------------
-- TABLA: leads
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can update all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "leads: admin full access" ON public.leads;
DROP POLICY IF EXISTS "leads: anyone can insert with valid email" ON public.leads;
DROP POLICY IF EXISTS "leads: owner can view own leads" ON public.leads;

CREATE POLICY "Admins can view all leads" 
ON public.leads FOR SELECT TO authenticated 
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "Admins can update all leads" 
ON public.leads FOR UPDATE TO authenticated 
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "leads: owner can view own leads" 
ON public.leads FOR SELECT TO authenticated 
USING ( email = (select auth.jwt()->>'email') );

CREATE POLICY "leads: anyone can insert with valid email" 
ON public.leads FOR INSERT TO public 
WITH CHECK (
  email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
); -- Filtro de estructura base: No permitimos que el caos anónimo entre sin forma o identidad mínima.

--------------------------------------------------------------------------------
-- TABLA: projects
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "projects: client can select own" ON public.projects;
DROP POLICY IF EXISTS "projects: admin full access" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update all projects" ON public.projects;

CREATE POLICY "Admins can view all projects" 
ON public.projects FOR SELECT TO authenticated 
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "Admins can update all projects" 
ON public.projects FOR UPDATE TO authenticated 
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "Users can view own projects" 
ON public.projects FOR SELECT TO authenticated 
USING ( (select auth.uid()) = client_id );

--------------------------------------------------------------------------------
-- TABLA: payments
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "payments: client can select own" ON public.payments;
DROP POLICY IF EXISTS "payments: admin full access" ON public.payments;

CREATE POLICY "payments: admin full access" 
ON public.payments FOR ALL TO authenticated 
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "payments: client can select own" 
ON public.payments FOR SELECT TO authenticated 
USING ( project_id IN (SELECT id FROM public.projects WHERE client_id = (select auth.uid())) );

--------------------------------------------------------------------------------
-- TABLA: blueprint_requests
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own blueprint requests" ON public.blueprint_requests;
DROP POLICY IF EXISTS "Users can insert their own blueprint requests" ON public.blueprint_requests;
DROP POLICY IF EXISTS "Users can update their own blueprint requests" ON public.blueprint_requests;
DROP POLICY IF EXISTS "Admins can view all blueprint requests" ON public.blueprint_requests;
DROP POLICY IF EXISTS "Admins can update all blueprint requests" ON public.blueprint_requests;

CREATE POLICY "Admins can view all blueprint requests"
ON public.blueprint_requests FOR SELECT TO authenticated
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "Admins can update all blueprint requests"
ON public.blueprint_requests FOR UPDATE TO authenticated
USING ( (select public.get_user_role()) = 'admin' );

CREATE POLICY "Users can view their own blueprint requests"
ON public.blueprint_requests FOR SELECT TO authenticated
USING ( (select auth.uid()) = user_id );

CREATE POLICY "Users can insert their own blueprint requests"
ON public.blueprint_requests FOR INSERT TO authenticated
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can update their own blueprint requests"
ON public.blueprint_requests FOR UPDATE TO authenticated
USING ( (select auth.uid()) = user_id );

-- FINALIZADO: Refrescar el esquema
NOTIFY pgrst, 'reload schema';
