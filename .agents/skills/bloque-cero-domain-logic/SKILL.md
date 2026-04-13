---
name: bloque-cero-domain-logic
description: Reglas de arquitectura de negocio para Bloque Cero (Leads, Radar, Blueprint, Fulfillment)
---

# Bloque Cero Domain Logic

## Introducción
Bloque Cero es un ecosistema operativo ("Laboratorio de Cumplimiento") diseñado por estrategas para incubar y refinar negocios en fases iniciales. Esta guía define los conceptos clave de la base de datos y su flujo lógico.

## 1. Concepto Fundamental: El `Lead` (Radar de Idea / Escáner)
La tabla `leads` es el punto de entrada de todo prospecto. Representa a un emprendedor que llena un formulario y recibe un diagnóstico computarizado.
- **n8n_payload**: Columna `jsonb`. Almacena los "Inputs" crudos (country, business_idea, dolores, etc).
- **score**: Calificación numérica obtenida (0 a 100).
- **status**: Estado textual (ej: 'New').
- **diagnostic_answers**: Objeto `jsonb` masivo inyectado por un webhook externo (n8n). Contiene:
  - `verdict`: Veredicto AI ("Sigue Adelante", "Pivote urgente").
  - `recommended_block`: Siguiente producto recomendado (ej. "Blueprint").
  - `big6`: Array de 6 objetos calificando ejes estructurales (Nombre, Calificación, Razón, Señal Alto/Medio/Bajo).
  - Y metadatos del cliente pre-registro (nombre, negocio, email).

## 2. Concepto Avanzado: El `Blueprint Request` (Ingeniería de Producto)
La tabla `blueprint_requests` representa a un "lead" que compró o activó la Fase 2 (Construcción del Modelo).
- Se liga al prospecto mediante **`lead_id`**. (Asegurarse de usar Client-Side Joins o Foreign Keys válidas al extraer o renderizar información conjunta).
- **progress_day**: Entero (1 a 7). Representa el ciclo semanal de SLA (Service Level Agreement).
- **format_pdf, format_presentation, format_infographic**: Booleanos. Indican qué formatos documentales solicitó el usuario.

## 3. Modelo Canónico: `business_blueprints` (Fase 3B+)
Para reducir la complejidad de la herencia `leads` -> `blueprint_requests`, el sistema transiciona hacia un objeto canónico **`business_blueprints`**.
- **Blueprint Intake**: Representado por los datos de descubrimiento (antes en `leads`).
- **Blueprint Delivery**: Representado por el ciclo de cumplimiento y archivos (antes en `blueprint_requests`).
- **Estados Unificados**: `draft`, `processing`, `delivered`, `archived`.

## 4. Filosofía del Fulfillment Admin (Cola Omnicanal)
Las pantallas maestras (`AdminIndex.tsx` y `FulfillmentAdmin.tsx`) son "Omnicanales". Analizan el universo entero.
- **Intake Items**: Entradas de descubrimiento que requieren validación.
- **Delivery Items**: Proyectos en construcción con SLA de 7 días.

## Directriz de Intervención:
- **Priorizar el Modelo Canónico**: Al crear nuevos hooks o componentes, usar `src/types/businessBlueprints.ts` en lugar de los tipos base de Supabase cuando sea posible.
- **Resiliencia Geográfica**: Dado que la migración física SQL puede demorar, usar los adapters en `src/lib/businessBlueprintPayloads.ts` para mapear datos heterogéneos al modelo canónico.
- Nunca modificar la estructura JSON del `diagnostic_answers` sin considerar retrocompatibilidad.
- Ante la duda, verificar en la interfaz de Supabase si existen Foreign Keys activas.
