-- =============================================================================
-- CREACIÓN DE TABLA CONTACT_REQUESTS - BLOQUE CERO
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- new, read, replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Política de inserción pública (Cualquier usuario puede enviar mensaje)
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.contact_requests;
CREATE POLICY "Enable insert for everyone" ON public.contact_requests
    FOR INSERT WITH CHECK (true);

-- Política de lectura solo para Admins
DROP POLICY IF EXISTS "Admins can view all contact requests" ON public.contact_requests;
CREATE POLICY "Admins can view all contact requests" ON public.contact_requests
    FOR SELECT USING (public.get_user_role() = 'admin');

COMMENT ON TABLE public.contact_requests IS 'Almacena los mensajes enviados desde el formulario de contacto de la landing page.';
