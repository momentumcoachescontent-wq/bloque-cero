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


## Actualización de memoria — Fase 2.1
### Ajustes públicos ejecutados
Se completó una limpieza visible del producto para reforzar que **Blueprint de Negocio** es el punto de entrada comercial del sistema.

#### Componentes públicos actualizados
- `src/components/ProductGrid.tsx`
- `src/pages/Diagnostic.tsx`
- `src/pages/BlueprintLanding.tsx`
- `src/components/Navbar.tsx`
- `src/components/HeroSection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/DownloadsSection.tsx`
- `src/pages/Login.tsx`
- `src/pages/dashboard/DashboardIndex.tsx`
- `src/pages/Terminos.tsx`

#### Resultado funcional
- Radar deja de ser visible como producto independiente en la experiencia pública
- Blueprint de Negocio queda posicionado como Bloque 01
- `/blueprint-info` queda como puerta comercial pública
- `/diagnostico` permanece como ruta técnica transitoria para intake

#### Integración adicional del ecosistema
Se incorpora a la memoria del proyecto la referencia operativa de n8n:
- `https://n8n-n8n.z3tydl.easypanel.host/home/workflows`

Esta URL complementa la referencia base de la instancia y debe considerarse parte del mapa operativo del ecosistema para revisar workflows activos durante siguientes fases.

## Skills adicionales recomendados para continuar
A partir del nuevo alcance y de los repositorios de referencia compartidos, se identifican estas capacidades externas como útiles para siguientes fases.

### 1. Marketing / growth skills
**Referencia:** `coreyhaines31/marketingskills`

**Valor para Bloque Cero:**
- copywriting orientado a conversión
- CRO para landing y formularios
- content strategy
- customer research
- analytics tracking
- email sequence
- social content

**Aplicación recomendada:**
Fase 2.2 y Fase 4, para optimizar captación, posicionamiento del Blueprint y contenidos por vertical.

### 2. Framework de skills y metodología agentic
**Referencia:** `obra/superpowers`

**Valor para Bloque Cero:**
- disciplina de spec-first / plan-first
- revisión estructurada antes de implementación
- skills composables para desarrollo y debugging
- metodología reusable para fases técnicas más complejas

**Aplicación recomendada:**
Fase 3 en adelante, especialmente para migración de dominio, refactor y workflows de implementación más controlados.

### 3. Referencia de patrones SaaS
**Referencia:** `eriktaveras/django-saas-boilerplate`

**Valor para Bloque Cero:**
- inspiración para tenancy, auth, billing y estructura SaaS
- patrones de onboarding y organización de producto SaaS
- utilidad conceptual, no para adopción directa del stack

**Aplicación recomendada:**
Como benchmark de arquitectura de producto, no como base técnica directa, dado que Bloque Cero hoy vive en React + Supabase + n8n, no en Django.

## Conclusión operativa
Para seguir avanzando, no hace falta incorporar un nuevo framework técnico al repo de inmediato. Sí conviene incorporar **skills de marketing/growth** y **disciplina metodológica de desarrollo** como referencia operativa en próximas fases.


## Actualización de memoria — Fase 3A
### Consolidación lógica del dominio
Se inició una fase de alineación interna para que el sistema deje de pensar públicamente en Radar vs Blueprint y empiece a operar con dos etapas de un mismo flujo:
- **Blueprint Intake**
- **Blueprint Delivery**

### Alcance ejecutado
- hooks de fulfillment reinterpretados bajo un lifecycle unificado
- paneles administrativos renombrados hacia intake/delivery
- dashboard Blueprint con lenguaje menos dependiente del concepto Radar
- documentación de lifecycle canónico agregada en `docs/knowledge/blueprint_lifecycle.md`

### Decisión técnica clave
No se migró aún la base de datos. La consolidación en esta fase es **lógica y semántica**, no física. Esto reduce riesgo operativo mientras prepara la futura migración de esquema.

## Actualización de memoria — Fase 3B
### Objetivo estructural
La siguiente capa de implementación deja de ser semántica y pasa a ser estructural.

### Estado heredado al cierre de Fase 3A
- el sistema visible ya opera como Blueprint de Negocio
- el admin interno ya interpreta `leads` como Blueprint Intake
- el admin interno ya interpreta `blueprint_requests` como Blueprint Delivery
- la base física aún conserva el modelo histórico

### Decisión técnica de Fase 3B
Se adopta **`business_blueprints`** como entidad canónica objetivo del dominio.

### Enfoque de implementación
No se ejecuta migración física destructiva todavía.
Se implementa primero:
- especificación canónica
- estrategia de migración por etapas
- compatibilidad con n8n
- reducción progresiva de deuda entre `leads` y `blueprint_requests`

### Resultado esperado
Preparar una migración real sin romper producción, evitando que frontend, admin y automatizaciones sigan dependiendo del lenguaje histórico de Radar.

## Actualización de memoria — Fase 3B.1
### Implementación estructural publicada
Se publicó la primera capa estructural real de Fase 3B, orientada a introducir un modelo canónico sin romper compatibilidad con producción.

#### Commits publicados
- `daa9fd0` — `docs: define canonical business_blueprints model for phase 3B`
- `7cfe1a8` — `feat: add canonical business blueprint read model`
- `b58e19f` — `feat: add canonical n8n payload adapter for fulfillment`

#### Activos incorporados
- `docs/knowledge/business_blueprints_spec.md`
- `src/types/businessBlueprints.ts`
- `src/hooks/useBusinessBlueprints.ts`
- `src/lib/businessBlueprintPayloads.ts`

#### Superficies actualizadas
- `src/hooks/useOmniFeed.ts`
- `src/hooks/useFulfillmentQueue.ts`
- `src/pages/admin/FulfillmentAdmin.tsx`

#### Resultado arquitectónico
- ya existe un read model canónico de `business_blueprints`
- admin y fulfillment empiezan a depender del caso unificado y no sólo del modelo heredado
- n8n ya puede recibir un payload de compatibilidad con bloque canónico embebido
- sigue sin ejecutarse migración física de base, por decisión deliberada de seguridad operativa

#### Estado de Seguridad y Orquestación
- El sistema ha alcanzado un nivel de **Zero-Trust Frontend**. Ninguna URL de infraestructura externa (n8n, APIs de terceros) está expuesta en el código cliente.
- **Ecosistema Agentic:** El servidor `n8n-mcp` ha sido instalado y conectado exitosamente en el entorno local (Claude Code). 
- **Próximos Pasos (Nueva Sesión):** Se iniciará la Fase 4/5 (Bloque F - Reportes) con el agente teniendo visibilidad directa de los flujos de n8n mediante las nuevas herramientas MCP.

## Actualización de memoria — Fase 4 (Infraestructura y Verticales)
### Estado de la Infraestructura
- **Storage:** Los buckets `radar_deliverables` y `blueprint_deliverables` están plenamente operativos en Supabase con reglas RLS públicas para lectura.
- **Base de Datos:** El script `setup_storage_fase4.sql` ha sido ejecutado, añadiendo campos de soporte para URLs de archivos en `leads` y `blueprint_requests`.
- **Automatización:** Conectividad establecida con `n8n-mcp`, permitiendo una auditoría profunda de flujos desde el agente.

### Sincronización del Dominio
- El modelo canónico `business_blueprints` ha sido adoptado en la capa de tipos (`src/types/businessBlueprints.ts`) y hooks (`src/hooks/useBusinessBlueprints.ts`).
- El panel de **FulfillmentAdmin** ya filtra y presenta la información bajo la lógica de **Blueprint Intake** y **Blueprint Delivery**, aunque los datos físicos residan en tablas heredadas.

### Skills Consolidados
Se han formalizado 6 bibliotecas de habilidades en `.agents/skills/` para guiar el desarrollo futuro:
- `bloque-cero-agentic-methodology`
- `bloque-cero-aprendizajes`
- `bloque-cero-domain-logic`
- `bloque-cero-growth-marketing`
- `bloque-cero-n8n-orchestrator`
- `bloque-cero-ui-standards`

## Conclusión de Sincronización (Abril 2026)
El sistema está listo para la **Fase 5 (Automatización de Reportes)**. La deuda técnica de dominio está bajo control gracias a los adapters de compatibilidad, permitiendo postergar la migración física SQL hasta una ventana de mantenimiento de bajo riesgo.

