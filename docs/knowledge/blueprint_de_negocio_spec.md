# Blueprint de Negocio — Especificación Funcional

## Decisión de producto
**Blueprint de Negocio** se establece como el nombre oficial del bloque unificado. La experiencia visible de **Radar de Idea** queda absorbida dentro de este flujo y deja de existir como producto independiente a nivel comercial.

## Objetivo del bloque
Convertir una idea, servicio o negocio incipiente en una lectura estructurada de viabilidad, arquitectura mínima, prioridades operativas y siguiente paso recomendado.

## Qué absorbe del Radar
El nuevo Blueprint de Negocio incorpora internamente las capacidades que antes pertenecían a Radar:
- intake inicial
- scoring heurístico
- evaluación de viabilidad
- análisis Big 6
- clasificación inicial del caso
- recomendación de siguiente bloque

## Qué conserva del Blueprint histórico
- profundización estratégica
- lectura estructurada del modelo
- selección de formatos de entrega
- salida accionable para MVP, operación o automatización

## Tipo de usuario objetivo
- emprendedor con idea en fase temprana
- negocio de servicios sin sistema de seguimiento claro
- negocio local que requiere estructura operativa
- cliente que necesita decidir si construir, ordenar o automatizar primero

## Entradas del flujo

### 1. Datos de contacto
- nombre
- email
- WhatsApp

### 2. Datos del negocio o idea
- nombre del negocio
- descripción de la idea
- tipo de negocio
- audiencia
- país
- ticket
- canal de venta

### 3. Variables operativas
- dependencia logística
- necesidad de pagos especiales
- etapa actual
- dolores principales
- tiempo disponible

### 4. Profundización estratégica
El flujo debe incorporar preguntas extendidas que hoy viven separadas en Blueprint, pero integradas al journey principal.

## Salidas del flujo

### Salida base
- score de viabilidad
- complejidad estimada
- riesgos principales
- lectura Big 6
- recomendación de siguiente bloque

### Salida extendida
- blueprint estructurado del negocio
- hipótesis operativa
- propuesta de arquitectura mínima
- recomendación de entregables posteriores

### Salida premium futura
- PDF ejecutivo
- presentación
- infografía / canvas operativo

## Relación con el resto del portafolio
- si el usuario necesita validar demanda → **MVP de Validación**
- si necesita orden operativo → **Kit Operacional 1.0**
- si ya opera pero está saturado → **Automatización Inicial**
- si necesita asistencia inteligente → **Operación Inteligente con IA**

## Reglas de producto
1. El usuario entra por un solo bloque visible: **Blueprint de Negocio**
2. Radar deja de mostrarse como producto separado
3. La experiencia debe sentirse continua, no como dos formularios pegados
4. El resultado debe servir tanto para venta como para activación interna
5. Las salidas deben escalar en profundidad sin duplicar entidades innecesarias

## Implicaciones UX
- revisar `/diagnostico`
- revisar `/blueprint-info`
- revisar `/dashboard/blueprint`
- unificar CTAs de landing, catálogo y dashboard
- retirar lenguaje que siga presentando Radar como producto independiente

## Implicaciones de datos
- el flujo actual de `leads` + `blueprint_requests` representa una separación histórica
- el modelo objetivo debe representar un solo caso de Blueprint de Negocio con diferentes niveles de profundidad y entregables

## Estado recomendado de transición
### Fase 2
- unificar naming y UX
- mantener compatibilidad temporal con modelo actual

### Fase 3
- rediseñar dominio y lifecycle
- consolidar entidades o definir jerarquía explícita entre intake, assessment y deliverables

## Criterio de éxito
El usuario debe percibir que Bloque Cero ofrece un solo punto de entrada inteligente para entender su negocio, no una escalera confusa entre Radar y Blueprint.
