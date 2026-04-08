# Technical Memory — Bloque Cero

## Objetivo del documento
Registrar el estado técnico real del proyecto al inicio de la nueva etapa de implementación, identificar desalineaciones y servir como memoria acumulativa para próximas decisiones.

## Snapshot de inicio
**Fecha:** 2026-04-07  
**Estado del repo local:** limpio  
**Branch:** `main`  
**Remote:** `origin -> https://github.com/momentumcoachescontent-wq/bloque-cero.git`

## Stack detectado
- **Frontend:** React + Vite + TypeScript
- **UI:** Shadcn + TailwindCSS
- **Estado / datos:** React Query
- **Backend:** Supabase
- **Automatización:** n8n self-hosted
- **Hosting:** Lovable

## Estado real del código

### Rutas detectadas
- `/`
- `/login`
- `/diagnostico`
- `/privacidad`
- `/terminos`
- `/contacto`
- `/blueprint-info`
- `/dashboard`
- `/dashboard/perfil`
- `/dashboard/blueprint`
- `/dashboard/mvp`
- `/dashboard/kit-operacional`
- `/dashboard/automatizaciones`
- `/dashboard/agentes-ia`
- `/admin`
- `/admin/fulfillment`
- `/admin/usuarios`
- `/admin/sistema`

### Componentes / módulos relevantes
- `src/components/DiagnosticForm.tsx`
- `src/pages/Diagnostic.tsx`
- `src/pages/BlueprintLanding.tsx`
- `src/pages/dashboard/BlueprintPage.tsx`
- `src/hooks/useOmniFeed.ts`
- `src/lib/diagnosticScoring.ts`
- `src/components/admin/AdminRadarExpanded.tsx`
- `src/components/admin/AdminBlueprintExpanded.tsx`

## Lectura funcional actual

### Radar
Existe un flujo de diagnóstico con:
- formulario multi-step
- scoring heurístico
- evaluación Big 6
- persistencia en tabla `leads`
- recomendación de bloque

### Blueprint
Existe un flujo dependiente del Radar con:
- selección de lead previo
- captura de respuestas ampliadas
- selección de formatos de entrega
- creación de `blueprint_requests`
- disparo de webhook a n8n desde frontend

### Admin
Existe una lectura unificada tipo feed que mezcla:
- leads Radar
- solicitudes Blueprint

## Hallazgos de arquitectura

### 1. Desalineación entre documentación y código
La documentación histórica describe un proyecto casi vacío, pero el código ya tiene múltiples rutas, formularios, dashboard y admin.

### 2. Producto partido en dos entidades conceptuales
Radar y Blueprint están implementados como escalones conectados, pero siguen separados a nivel de:
- narrativa
- rutas
- entidades de datos
- admin

### 3. Tipado de Supabase inconsistente
Existen definiciones paralelas y no completamente sincronizadas:
- `src/types/database.types.ts`
- `src/integrations/supabase/types.ts`

### 4. Integración n8n disparada desde cliente
Actualmente el webhook de Blueprint se dispara desde el frontend. Esto es práctico para avanzar, pero frágil para producción y gobernanza.

### 5. Riesgo de deriva conceptual
El repo mezcla:
- visión de agencia-producto
- prototipo comercial
- workflows operativos
- narrativa enterprise/consultoría de alto tono

Eso genera incoherencia entre oferta, UX y dominio.

## Modelo de dominio actual

### Entidades visibles
- `profiles`
- `leads`
- `blueprint_requests`

### Limitación principal
El modelo actual representa la historia de implementación, no el estado objetivo del producto. La separación `lead -> blueprint_request` debe revisarse frente al nuevo bloque unificado de **Blueprint de Negocio**.

## Decisiones recomendadas para próximas fases

### Fase 2
- redefinir el journey del producto unificado
- revisar CTAs y navegación pública
- decidir si `/blueprint-info` se mantiene, se absorbe o se redirige

### Fase 3
- definir si se migra a una entidad unificada tipo `assessments`
- mover disparos críticos a backend o función controlada
- normalizar estados y entregables
- sanear tipos y contratos de datos

### Fase 4+
- modularizar capacidades para verticales
- separar core reusable vs. personalización por vertical
- mapear capacidades transversales: multicanal, IA, offline-first

## Riesgos técnicos prioritarios
1. Acumulación de deuda conceptual
2. Modelo de datos divergente del producto real
3. Dependencia excesiva del cliente para disparar automatizaciones
4. Tipado desincronizado
5. Complejidad creciente del admin si no se redefine el dominio

## Criterio de implementación a partir de ahora
No agregar nuevas capas de complejidad sin antes:
- alinear documentación
- alinear UX
- alinear dominio
- alinear automatizaciones con lifecycle real

## Próximo checkpoint sugerido
El siguiente documento a producir después de esta memoria debe ser una especificación funcional del **Blueprint de Negocio** y un mapa de migración del dominio actual al dominio objetivo.
