-- ==============================================================================
-- FIX: RESTRICCIÓN DE UNICIDAD PARA TRIGGER DE UNIFICACIÓN
-- Corrige el error 42P10 al asegurar que source_lead_id sea único.
-- ==============================================================================

-- 1. Asegurar que no haya duplicados accidentales antes de aplicar la restricción
-- (En caso de que pruebas fallidas hayan insertado datos sin el trigger)
DELETE FROM public.business_blueprints a
USING public.business_blueprints b
WHERE a.id < b.id 
  AND a.source_lead_id = b.source_lead_id;

-- 2. Añadir la restricción UNIQUE necesaria para ON CONFLICT
ALTER TABLE public.business_blueprints 
ADD CONSTRAINT business_blueprints_source_lead_id_key UNIQUE (source_lead_id);

-- 3. Opcional: Reforzar que el public_id sea único (ya debería estar pero aseguramos)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'business_blueprints_public_id_key') THEN
        ALTER TABLE public.business_blueprints ADD CONSTRAINT business_blueprints_public_id_key UNIQUE (public_id);
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
