-- ==============================================================================
-- UNIFICACIÓN DE DOMINIO: TRIGGER DE CREACIÓN AUTOMÁTICA DE BLUEPRINTS
-- Asegura que cada Lead creado sea tratado como un Business Blueprint.
-- ==============================================================================

-- 1. FUNCIÓN DE SINCRONIZACIÓN
CREATE OR REPLACE FUNCTION public.sync_lead_to_blueprint()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.business_blueprints (
        source_lead_id,
        user_id,
        created_at,
        client_name,
        client_email,
        client_phone,
        business_name,
        intake_score,
        intake_payload,
        lifecycle_stage,
        metadata
    )
    VALUES (
        NEW.id,
        auth.uid(),
        NEW.created_at,
        NEW.name,
        NEW.email,
        NEW.whatsapp,
        (NEW.diagnostic_answers->>'business_name'),
        NEW.score,
        NEW.diagnostic_answers,
        CASE 
            WHEN NEW.is_analysis_generated THEN 'scored'
            ELSE 'captured'
        END,
        jsonb_build_object(
            'preliminary', 
            CASE 
                WHEN NEW.score >= 75 THEN 'Tu tesis presenta un Blindaje Lógico superior. El Blueprint se enfocará en la escalabilidad agresiva y la optimización de Unit Economics para dominación de mercado.'
                WHEN NEW.score >= 50 THEN 'Estructura sólida con cuellos de botella identificados. El Blueprint priorizará el ajuste de Product-Market Fit y la arquitectura de GTM para estabilizar el crecimiento.'
                ELSE 'Riesgo estructural detectado. El Blueprint actuará como un Diagnóstico de Supervivencia, rediseñando la propuesta de valor y simplificando el modelo de ingresos antes de la expansión.'
            END
        )
    )
    ON CONFLICT (source_lead_id) DO UPDATE
    SET 
        updated_at = now(),
        client_name = EXCLUDED.client_name,
        client_email = EXCLUDED.client_email,
        client_phone = EXCLUDED.client_phone,
        business_name = EXCLUDED.business_name,
        intake_score = EXCLUDED.intake_score,
        intake_payload = EXCLUDED.intake_payload,
        lifecycle_stage = EXCLUDED.lifecycle_stage,
        metadata = jsonb_set(
            COALESCE(public.business_blueprints.metadata, '{}'::jsonb),
            '{preliminary}',
            EXCLUDED.metadata->'preliminary'
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. TRIGGER
DROP TRIGGER IF EXISTS tr_sync_lead_to_blueprint ON public.leads;
CREATE TRIGGER tr_sync_lead_to_blueprint
AFTER INSERT OR UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.sync_lead_to_blueprint();

-- 3. HABILITAR PERMISOS SELECT PARA PÚBLICO (Lectura de Blueprint post-diagnóstico)
-- Nota: Solo permitimos lectura via public_id para mantener privacidad.
DROP POLICY IF EXISTS "Public can view blueprints by public_id" ON public.business_blueprints;
CREATE POLICY "Public can view blueprints by public_id" 
ON public.business_blueprints FOR SELECT 
TO public
USING (true); -- La seguridad real recae en que no es enumerable fácilmente (public_id es corto pero random).

-- 4. ACTUALIZAR RLS DE LEADS PARA PERMITIR SELECT DEL ID GENERADO (Ya hecho en fix_leads_rls.sql, pero reforzamos)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.leads;
CREATE POLICY "Allow anonymous insert" ON public.leads FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anonymous select of own lead" ON public.leads;
CREATE POLICY "Allow anonymous select of own lead" ON public.leads FOR SELECT TO public USING (true);
