-- =============================================================================
-- DEPURACIÓN SELECTIVA DE PRUEBAS (ROBUSTA) - BLOQUE CERO
-- =============================================================================

DO $$
DECLARE
  test_emails TEXT[] := ARRAY[
    'ealvareze1@hotmail.com', 
    'neto.alvarez@gmail.com'
  ];
  test_pattern TEXT := '%@test.com';
BEGIN
  RAISE NOTICE 'Iniciando limpieza de datos de prueba...';

  -- 1. business_blueprints
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_blueprints') THEN
    DELETE FROM public.business_blueprints WHERE client_email = ANY(test_emails) OR client_email LIKE test_pattern;
    RAISE NOTICE 'Tabla business_blueprints depurada.';
  END IF;
  
  -- 2. contact_requests
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_requests') THEN
    DELETE FROM public.contact_requests WHERE email = ANY(test_emails) OR email LIKE test_pattern;
    RAISE NOTICE 'Tabla contact_requests depurada.';
  END IF;

  -- 3. blueprint_requests
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blueprint_requests') THEN
    DELETE FROM public.blueprint_requests WHERE user_id IN (SELECT id FROM public.profiles WHERE email = ANY(test_emails) OR email LIKE test_pattern);
    RAISE NOTICE 'Tabla blueprint_requests depurada.';
  END IF;

  -- 4. leads
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
    DELETE FROM public.leads WHERE email = ANY(test_emails) OR email LIKE test_pattern;
    RAISE NOTICE 'Tabla leads depurada.';
  END IF;

  RAISE NOTICE 'Limpieza completada exitosamente.';
END $$;
