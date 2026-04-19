-- ==============================================================================
-- CORRECCIÓN DE EMERGENCIA: RLS LEADS (ERROR 42501)
-- Ejecutar en el Editor SQL de Supabase para restaurar la captación de leads.
-- ==============================================================================

-- 1. Eliminar la política anterior que está causando el conflicto por RegEx estricta
DROP POLICY IF EXISTS "leads: anyone can insert with valid email" ON public.leads;

-- 2. Crear una política robusta y compatible con usuarios anónimos
-- Se delega la validación compleja al frontend para asegurar fluidez.
-- Usamos explicitamente 'TO anon, authenticated' para máxima compatibilidad.
CREATE POLICY "leads: anyone can insert" 
ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  email IS NOT NULL AND email LIKE '%@%'
);

-- 3. Asegurar que RLS esté habilitado
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Refrescar el caché de la API
NOTIFY pgrst, 'reload schema';

-- VERIFICACIÓN:
-- SELECT * FROM pg_policies WHERE tablename = 'leads';
