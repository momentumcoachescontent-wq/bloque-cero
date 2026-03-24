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

-- 2.5 CREAR LA IDENTIDAD REAL (La cura para el Punto Ciego)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
DECLARE
  extracted_role text;
BEGIN
  SELECT role INTO extracted_role FROM public.profiles WHERE id = auth.uid();
  RETURN extracted_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- 9. Crear política para que usuarios puedan editar sus propios perfiles (Profile Persistence)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id );

-- 10. Agregar columnas de control administrativo a leads para el panel (Checkboxes y Entregables)
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS is_analysis_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_analysis_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blueprint_data JSONB;

-- 11. Crear tabla para Tracking de Blueprint Requests (Bloque 2 Redux)
CREATE TABLE IF NOT EXISTS public.blueprint_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    lead_id UUID REFERENCES public.leads(id),
    
    -- Paso 2: Deep Diagnostic
    diagnostic_answers JSONB,
    
    -- Paso 3: Entregable
    format_pdf BOOLEAN DEFAULT FALSE,
    format_presentation BOOLEAN DEFAULT FALSE,
    format_infographic BOOLEAN DEFAULT FALSE,
    
    -- Paso 4/5: Estados de SLA y Data
    status TEXT DEFAULT 'pending_questionnaire', -- pending_questionnaire, analyzing (day 1), financial (day 3), mock (day 5), delivered (day 7)
    progress_day INTEGER DEFAULT 0,
    generated_blueprint JSONB,
    
    -- Paso 6: QA
    satisfaction_score INTEGER,
    clarification_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en blueprint_requests
ALTER TABLE public.blueprint_requests ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view their own blueprint requests" ON public.blueprint_requests;
CREATE POLICY "Users can view their own blueprint requests"
    ON public.blueprint_requests FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own blueprint requests" ON public.blueprint_requests;
CREATE POLICY "Users can insert their own blueprint requests"
    ON public.blueprint_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own blueprint requests" ON public.blueprint_requests;
CREATE POLICY "Users can update their own blueprint requests"
    ON public.blueprint_requests FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all blueprint requests" ON public.blueprint_requests;
CREATE POLICY "Admins can view all blueprint requests"
    ON public.blueprint_requests FOR SELECT
    USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can update all blueprint requests" ON public.blueprint_requests;
CREATE POLICY "Admins can update all blueprint requests"
    ON public.blueprint_requests FOR UPDATE
    USING (public.get_user_role() = 'admin');
