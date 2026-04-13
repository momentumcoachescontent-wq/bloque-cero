-- ==============================================================================
-- FASE 4: EL BÚNKER DE ARCHIVOS (SUPABASE STORAGE & SCHEMA UPDATE)
-- ==============================================================================

-- 1. CREACIÓN DE BUCKETS PÚBLICOS
-- Estos buckets alojarán los entregables y serán leíbles por cualquiera que tenga el link único,
-- asegurando que cuando el cliente reciba el correo (con URL encriptada/UUID), pueda descargar.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('radar_deliverables', 'radar_deliverables', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blueprint_deliverables', 'blueprint_deliverables', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICAS DE SEGURIDAD PARA STORAGE (RLS)
-- Limpiar políticas previas si el script se vuelve a ejecutar
DROP POLICY IF EXISTS "Public Access for Radar" ON storage.objects;
DROP POLICY IF EXISTS "Public Access for Blueprint" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Radar" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Blueprint" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Radar" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Blueprint" ON storage.objects;

-- Permitir a usuarios anónimos o autenticados LEER los archivos (ya que los mandaremos por correo).
CREATE POLICY "Public Access for Radar" ON storage.objects FOR SELECT USING (bucket_id = 'radar_deliverables');
CREATE POLICY "Public Access for Blueprint" ON storage.objects FOR SELECT USING (bucket_id = 'blueprint_deliverables');

-- Permitir a los administradores (usuarios autenticados) SUBIR/ACTUALIZAR archivos.
CREATE POLICY "Admin Upload Radar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'radar_deliverables');
CREATE POLICY "Admin Upload Blueprint" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blueprint_deliverables');
CREATE POLICY "Admin Update Radar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'radar_deliverables');
CREATE POLICY "Admin Update Blueprint" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'blueprint_deliverables');

-- 3. AÑADIR COLUMNAS DE URL EN LAS TABLAS PARA MAPEAR LOS ARCHIVOS
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS analysis_file_url TEXT;

ALTER TABLE public.blueprint_requests 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS presentation_url TEXT,
ADD COLUMN IF NOT EXISTS infographic_url TEXT;

-- 4. ACTUALIZAR VISTAS PARA REFLEJAR NUEVOS ESQUEMAS
-- Notificar al PostgREST que recargue el esquema.
NOTIFY pgrst, 'reload schema';
