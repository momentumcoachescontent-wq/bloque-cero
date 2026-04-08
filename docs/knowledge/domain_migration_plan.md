# Domain Migration Plan — Blueprint de Negocio

## Objetivo
Definir la transición desde el modelo actual, donde Radar y Blueprint están separados, hacia un dominio coherente donde **Blueprint de Negocio** es el bloque unificado.

## Estado actual

### Entidades observadas
- `profiles`
- `leads`
- `blueprint_requests`

### Semántica actual
- `leads` guarda contacto + intake + scoring Radar
- `blueprint_requests` guarda profundización estratégica y formatos de salida

## Problema del modelo actual
El esquema refleja la historia de implementación, no el producto objetivo. Eso produce:
- duplicidad conceptual
- duplicidad de UX
- duplicidad de administración
- complejidad para reporting y lifecycle

## Modelo objetivo conceptual
Se recomienda migrar hacia una estructura con una entidad principal de caso de negocio, por ejemplo:
- `business_blueprints`
- `assessments`
- `venture_cases`

Nombre sugerido a evaluar técnicamente: `business_blueprints`

## Responsabilidades del modelo objetivo
La entidad principal debe contener o relacionar:
- datos de contacto
- intake del caso
- scoring
- análisis extendido
- estado del caso
- entregables generados
- siguiente bloque recomendado
- trazabilidad de automatizaciones

## Estrategia de migración por fases

### Etapa A — Compatibilidad funcional
Mantener `leads` y `blueprint_requests`, pero tratarlos como partes del mismo lifecycle.

**Acciones:**
- unificar naming en frontend
- mapear estados compartidos
- dejar claro en admin que ambos pertenecen a Blueprint de Negocio

### Etapa B — Capa de agregación
Crear una capa lógica que unifique lectura y reporting sin romper almacenamiento existente.

**Acciones:**
- feed unificado por caso
- mapping de campos comunes
- estado canónico del lifecycle

### Etapa C — Consolidación de dominio
Diseñar e implementar la entidad objetivo.

**Acciones:**
- crear nueva tabla o vista materializable
- definir migración de datos históricos
- redirigir escritura del frontend al nuevo modelo
- desacoplar naming heredado del Radar

## Recomendación técnica inicial
No migrar físicamente la base aún. Primero:
1. estabilizar UX y naming
2. definir lifecycle canónico
3. diseñar contrato de datos objetivo
4. luego ejecutar migración de esquema

## Lifecycle canónico sugerido
1. `captured`
2. `scored`
3. `expanded`
4. `ready_for_delivery`
5. `delivered`
6. `converted_to_next_block`

## Impacto en frontend
### Rutas a revisar
- `/diagnostico`
- `/blueprint-info`
- `/dashboard/blueprint`
- catálogo principal en landing

### Componentes a revisar
- `src/components/ProductGrid.tsx`
- `src/pages/Diagnostic.tsx`
- `src/pages/BlueprintLanding.tsx`
- `src/pages/dashboard/BlueprintPage.tsx`
- `src/hooks/useOmniFeed.ts`
- componentes admin asociados

## Impacto en backend / integraciones
- revisar payloads enviados a n8n
- definir identificador canónico por caso
- evitar que automatizaciones dependan de semántica vieja de Radar
- preparar futura centralización de disparos fuera del cliente

## Riesgos de migración
1. romper compatibilidad con datos existentes
2. mezclar nombres nuevos con lógica vieja
3. dejar admin a medias durante transición
4. seguir agregando features sobre tablas heredadas sin contrato claro

## Resultado esperado
Al finalizar Fase 3, Blueprint de Negocio debe existir como concepto unificado en:
- discurso comercial
- rutas visibles
- lifecycle de datos
- lectura administrativa
- automatizaciones
