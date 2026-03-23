-- ==============================================================================
-- RENACIMIENTO OPERATIVO (PURGA DE DATOS)
-- Ejecuta este script bajo mucha precaución. Vaciará todos los análisis.
-- ==============================================================================

-- 1. Vaciar solicitudes de plano táctico
DELETE FROM blueprint_requests;

-- 2. Vaciar leads y respuestas iniciales del radar
DELETE FROM leads;

-- 3. Vaciar respuestas detalladas de diagnóstico (si tienes otra tabla que lo almacene, aunque 'leads' ya guarda algunas en JSON y 'blueprint_requests' igual).
-- DELETE FROM diagnostic_responses; -- (Descomentar y ajustar si existe tabla específica)

-- NOTA: Este comando purifica la base para validar de cero.
