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

## 3. Filosofía del Fulfillment Admin (Cola Omnicanal)
Las pantallas maestras (`AdminIndex.tsx` y `FulfillmentAdmin.tsx`) son "Omnicanales". Analizan el universo entero.
- **Radar Items**: Provienen de `leads`. Se listan cronológicamente. Su estado avanza mediante operaciones manuales (botones de "Dictamen Generado" y "Enviado").
- **Blueprint Items**: Provienen de `blueprint_requests`. Conviven en la misma lista que los Radares, pero requieren lógica visual diferente. Sus estados cambian con un control deslizante de "Días" y finalizan al cargar los documentos (Upload) y Enviar (Send).

## Directriz de Intervención:
- Nunca modificar la estructura JSON del `diagnostic_answers` sin considerar retrocompatibilidad.
- Ante la duda, verificar en la interfaz de Supabase si existen Forreign Keys activas (ej. `blueprint_requests.user_id -> profiles.id`). Si no existen, es imperativo solucionarlo con un cruce local de datos `items.find(id)`.
