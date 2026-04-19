-- ==============================================================================
-- CORRECCIÓN DEFINITIVA: RLS LEADS (INSERT + SELECT)
-- ==============================================================================

-- 1. Limpiar políticas previas de inserción
DROP POLICY IF EXISTS "leads: anyone can insert" ON public.leads;
DROP POLICY IF EXISTS "leads: anyone can insert with valid email" ON public.leads;

-- 2. Limpiar políticas previas de lectura
DROP POLICY IF EXISTS "leads: anyone can view" ON public.leads;
DROP POLICY IF EXISTS "leads: owner can view own leads" ON public.leads;
DROP POLICY IF EXISTS "leads: public_select" ON public.leads;

-- 3. Política de INSERCIÓN (Para todos los usuarios)
CREATE POLICY "leads: public_insert" 
ON public.leads FOR INSERT TO public 
WITH CHECK (true);

-- 4. Política de LECTURA (Crucial para que el frontend reciba el ID generado)
CREATE POLICY "leads: public_select" 
ON public.leads FOR SELECT TO public 
USING (true); 

-- 5. Asegurar RLS y refrescar API
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
NOTIFY pgrst, 'reload schema';

-- VERIFICACIÓN:
-- Esta consulta debe devolver 2 filas (public_insert y public_select) para el rol 'public'
-- SELECT polname, polcmd FROM pg_policy WHERE polrelid = 'public.leads'::regclass;
