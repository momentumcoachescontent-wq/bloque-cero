-- ==============================================================================
-- FASE 4: CONSOLIDACIÓN DE DOMINIO - BLOQUE D
-- Creación de la tabla canónica business_blueprints y migración de datos
-- ==============================================================================

-- 1. CREACIÓN DE LA TABLA MAESTRA
CREATE TABLE IF NOT EXISTS public.business_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id TEXT UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Trazabilidad y Relaciones
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    source_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    source_blueprint_id UUID REFERENCES public.blueprint_requests(id) ON DELETE SET NULL,
    
    -- Datos del Cliente (Desnormalizados para velocidad y CRM)
    client_name TEXT,
    client_email TEXT,
    client_phone TEXT,
    business_name TEXT,
    
    -- Diagnóstico (Intake)
    intake_score INTEGER,
    intake_recommendation TEXT,
    intake_payload JSONB DEFAULT '{}'::jsonb,
    
    -- Estado y Operación (Delivery)
    -- Stages: captured, scored, expanded, in_progress, completed, archived
    lifecycle_stage TEXT DEFAULT 'captured',
    delivery_progress INTEGER DEFAULT 0,
    requested_formats TEXT[] DEFAULT '{}',
    
    -- URLs de Entregables (Consolidado de Fase 4 Storage)
    pdf_url TEXT,
    presentation_url TEXT,
    infographic_url TEXT,
    
    -- Métricas de Verticalización (CRM)
    cac_estimated NUMERIC DEFAULT 0,
    ltv_estimated NUMERIC DEFAULT 0,
    sla_risk_score INTEGER DEFAULT 0, -- 0 to 100
    
    -- Campo para notas internas del Coach
    admin_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. HABILITAR SEGURIDAD (RLS)
ALTER TABLE public.business_blueprints ENABLE ROW LEVEL SECURITY;

-- Política: Clientes ven lo suyo
DROP POLICY IF EXISTS "Users can view their own blueprints" ON public.business_blueprints;
CREATE POLICY "Users can view their own blueprints" 
ON public.business_blueprints FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Política: Admins ven TODO
DROP POLICY IF EXISTS "Admins can view ALL blueprints" ON public.business_blueprints;
CREATE POLICY "Admins can view ALL blueprints" 
ON public.business_blueprints FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. MIGRACIÓN INICIAL (HIDRATACIÓN)
-- Nota: Esto asume que queremos crear un Blueprint por cada Lead existente que no tenga uno ya.

INSERT INTO public.business_blueprints (
    source_lead_id,
    created_at,
    client_name,
    client_email,
    client_phone,
    business_name,
    intake_score,
    intake_payload,
    lifecycle_stage
)
SELECT 
    l.id,
    l.created_at,
    l.name,
    l.email,
    l.whatsapp,
    (l.diagnostic_answers->>'business_name'),
    l.score,
    l.diagnostic_answers,
    CASE 
        WHEN l.is_analysis_generated THEN 'scored'
        ELSE 'captured'
    END
FROM public.leads l
WHERE NOT EXISTS (
    SELECT 1 FROM public.business_blueprints bb WHERE bb.source_lead_id = l.id
);

-- 4. VINCULACIÓN CON REQUESTS DE BLUEPRINT EXISTENTES
UPDATE public.business_blueprints bb
SET 
    source_blueprint_id = br.id,
    user_id = br.user_id,
    requested_formats = ARRAY(
        SELECT format 
        FROM unnest(ARRAY['pdf', 'presentation', 'infographic']) AS format
        WHERE 
            (format = 'pdf' AND br.format_pdf) OR
            (format = 'presentation' AND br.format_presentation) OR
            (format = 'infographic' AND br.format_infographic)
    ),
    lifecycle_stage = CASE 
        WHEN br.status = 'completed' THEN 'completed'
        WHEN br.status = 'in_progress' THEN 'expanded'
        ELSE 'scored'
    END,
    delivery_progress = br.progress_day,
    pdf_url = br.pdf_url,
    presentation_url = br.presentation_url,
    infographic_url = br.infographic_url
FROM public.blueprint_requests br
WHERE bb.source_lead_id = br.lead_id;

-- Notificar al PostgREST que recargue el esquema.
NOTIFY pgrst, 'reload schema';
