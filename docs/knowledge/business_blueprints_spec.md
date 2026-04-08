# Business Blueprints Spec — Fase 3B

## Propósito
Definir la entidad canónica objetivo para consolidar el dominio de **Blueprint de Negocio** sin romper compatibilidad con el modelo heredado basado en `leads` y `blueprint_requests`.

## Decisión central
La entidad canónica del dominio pasa a ser **`business_blueprints`**.

Durante la transición:
- `leads` se interpreta como **Blueprint Intake heredado**
- `blueprint_requests` se interpreta como **Blueprint Delivery heredado**
- frontend, admin y automatizaciones deben migrar gradualmente hacia contratos **Blueprint-first**

## Objetivos de Fase 3B
- reducir deuda conceptual entre `leads` y `blueprint_requests`
- definir una estructura canónica de caso
- preparar migración progresiva sin romper producción
- mantener compatibilidad con n8n durante la transición
- desacoplar payloads externos de la semántica histórica de Radar

## Entidad objetivo

### Nombre sugerido
- `business_blueprints`

### Alternativas evaluadas
- `assessments`
- `venture_cases`

### Resolución
Se adopta **`business_blueprints`** como nombre canónico por coherencia con el producto visible y con el lifecycle ya estabilizado en Fase 3A.

## Responsabilidades de la entidad
`business_blueprints` debe representar un caso unificado de negocio desde intake hasta delivery.

Debe cubrir:
- identidad del caso
- contacto principal
- intake estructurado
- scoring inicial
- expansión estratégica
- solicitud de entregables
- estado del lifecycle
- trazabilidad operativa
- referencias al modelo heredado
- compatibilidad con automatizaciones

## Campos canónicos sugeridos

### Identidad y trazabilidad
- `id`
- `public_id`
- `source_lead_id`
- `source_blueprint_request_id`
- `created_at`
- `updated_at`

### Contacto
- `client_name`
- `client_email`
- `client_phone`
- `business_name`
- `channel`

### Intake
- `intake_payload`
- `intake_score`
- `intake_recommendation`
- `intake_complexity`
- `intake_completed_at`

### Expansión estratégica
- `expansion_payload`
- `priority_block`
- `next_block_recommendation`

### Delivery
- `requested_formats`
- `delivery_status`
- `delivery_progress_day`
- `delivery_payload`
- `delivered_at`

### Estado canónico
- `lifecycle_stage`
- `is_active`
- `owner_id`
- `metadata`

## Lifecycle canónico
- `captured`
- `scored`
- `expanded`
- `queued_for_delivery`
- `delivered`
- `converted_to_next_block`
- `archived`

## Mapping desde modelo heredado

### Desde `leads`
Mapear como:
- intake inicial
- contacto principal
- score base
- diagnóstico estructural
- recomendación de siguiente bloque

### Desde `blueprint_requests`
Mapear como:
- expansión estratégica
- formatos solicitados
- progreso operativo
- estado de entrega
- artefactos generados

## Estrategia de implementación

### Etapa 1 — Capa canónica de lectura
No romper escritura actual.

Acciones:
- crear mapper canónico en frontend/admin
- exponer objetos con semántica `business_blueprints`
- mantener `leads` y `blueprint_requests` como fuentes heredadas

### Etapa 2 — Contratos unificados
Acciones:
- definir payload canónico para UI
- definir payload canónico para automatizaciones
- introducir adapters de compatibilidad para n8n

### Etapa 3 — Consolidación de escritura
Acciones:
- evaluar vista materializada o tabla real
- comenzar dual-write controlado o sincronización derivada
- reducir dependencia directa de nombres heredados

### Etapa 4 — Migración estructural
Acciones:
- mover lecturas y escrituras principales a `business_blueprints`
- mantener legado sólo como compatibilidad temporal
- preparar retiro gradual de la semántica vieja

## Vista vs tabla

### Opción A — Vista canónica
Útil si:
- se busca unificar lectura rápido
- aún no conviene mover escrituras
- se quiere minimizar riesgo en producción

### Opción B — Tabla real
Útil si:
- se requiere escritura directa
- se necesita historial más controlado
- se necesita performance o gobierno más fuerte del lifecycle

## Recomendación actual
Comenzar por **capa canónica + vista lógica**, no por migración física inmediata.

## Compatibilidad con n8n
Durante la transición deben coexistir dos niveles:

### Contrato interno canónico
Payload basado en `business_blueprints`.

### Contrato externo transitorio
Payload adaptado a lo que los workflows actuales de n8n esperan hoy.

## Regla para automatizaciones
Ningún workflow nuevo debe depender semánticamente del concepto **Radar**.

## Cambios mínimos esperados en código

### Frontend / admin
- centralizar mapeo de caso unificado
- dejar de exponer separación conceptual como producto
- usar `lifecycle_stage` como referencia primaria

### Integraciones
- agregar adapter para payloads n8n
- introducir identificador canónico por caso
- preparar futura salida de webhooks críticos fuera del cliente

## Criterio de cierre de Fase 3B
Fase 3B se considera cerrada cuando exista:
- especificación canónica del modelo objetivo
- estrategia de migración por etapas
- compatibilidad explícita con n8n
- contrato unificado listo para implementación técnica
