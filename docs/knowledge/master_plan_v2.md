# Master Plan v2 — Bloque Cero

## Propósito
Este documento redefine el plan maestro de Bloque Cero a partir del estado real del repositorio y de los cambios de alcance aprobados.

## Decisiones Rectoras
1. **Radar de Idea y Blueprint de Negocio se unifican** en un solo bloque: **Blueprint de Negocio**
2. Se mantienen los bloques posteriores de construcción y operación
3. Se agregan verticales y capacidades transversales con criterio de viabilidad y complejidad
4. La evolución del proyecto se ejecutará en **6 fases**

## Arquitectura de Oferta

### Núcleo comercial
1. **Blueprint de Negocio**
2. **MVP de Validación**
3. **Kit Operacional 1.0**
4. **Automatización Inicial**
5. **Operación Inteligente con IA**

### Verticales prioritarias
- **CRM Vertical para servicios**
- **Gestión de Negocios Locales**

### Capacidades transversales
- Automatización con IA generativa
- Integración multicanal vía WhatsApp + email
- Integraciones con n8n, storage y mensajería
- Offline-first selectivo

## Matriz de evaluación

| Línea | Tipo | Valor comercial | Complejidad | Viabilidad |
|------|------|-----------------|-------------|------------|
| Blueprint de Negocio | Núcleo | Alta | Media | Alta |
| MVP de Validación | Núcleo | Alta | Media | Alta |
| Kit Operacional 1.0 | Núcleo | Alta | Media | Alta |
| Automatización Inicial | Núcleo | Alta | Media | Alta |
| Operación Inteligente con IA | Núcleo | Alta | Media-Alta | Media-Alta |
| CRM Vertical para servicios | Vertical | Muy alta | Media | Alta |
| Gestión de Negocios Locales | Vertical | Alta | Media-Alta | Media-Alta |
| IA generativa aplicada | Capability | Alta | Media-Alta | Alta si se acota por proceso |
| Multicanal WhatsApp + email | Capability | Muy alta | Media-Alta | Alta |
| Multicanal incluyendo redes | Capability | Alta | Alta | Media |
| Offline-first generalizado | Arquitectura | Media | Alta | Media-Baja |

## Fases de Implementación

### Fase 1 — Reenfoque estratégico y plan maestro
**Objetivo:** alinear discurso, documentación y estructura del producto.

**Entregables:**
- actualización de README
- actualización de project overview
- actualización de business context
- creación de master plan v2
- creación de memoria técnica inicial

**Resultado esperado:** lenguaje de producto coherente y base documental actualizada.

---

### Fase 2 — Consolidación del núcleo comercial y UX
**Objetivo:** convertir la unificación conceptual en una experiencia de producto coherente.

**Trabajo principal:**
- redefinir flujo de Blueprint de Negocio
- revisar rutas `/diagnostico`, `/blueprint-info` y `/dashboard/blueprint`
- unificar mensajes, CTAs y narrativa comercial
- definir salidas del diagnóstico: resumen, blueprint extendido, recomendación de siguiente bloque

**Resultado esperado:** una sola experiencia de entrada para descubrimiento y estructuración.

---

### Fase 3 — Refactor de dominio y backend operativo
**Objetivo:** alinear modelo de datos y flujos con el nuevo producto.

**Trabajo principal:**
- revisar separación entre `leads` y `blueprint_requests`
- definir modelo objetivo (`assessments` o extensión progresiva del esquema actual)
- normalizar estados, tipados y entregables
- consolidar feed administrativo
- reducir lógica frágil en frontend
- fortalecer integración Supabase + n8n

**Resultado esperado:** backend coherente con el lifecycle comercial y operativo.

---

### Fase 4 — Verticalización de servicios
**Objetivo:** empacar soluciones vendibles sobre la base común.

**Trabajo principal:**
- definir módulos y alcance de CRM Vertical para servicios
- definir subverticales o patrón base de Negocios Locales
- identificar módulos compartidos reutilizables
- traducir capacidades técnicas a oferta clara

**Resultado esperado:** dos verticales con forma comercial y operativa clara.

---

### Fase 5 — Automatización multicanal + IA aplicada
**Objetivo:** elevar el valor operativo y diferenciar la propuesta.

**Trabajo principal:**
- priorizar WhatsApp + email
- dejar redes sociales en fase posterior
- automatizar captación, seguimiento, onboarding y soporte
- aplicar IA a clasificación, respuesta sugerida, resumen y propuesta

**Resultado esperado:** operación más conectada, medible y menos manual.

---

### Fase 6 — Escalamiento, resiliencia y offline-first selectivo
**Objetivo:** robustecer la plataforma para crecimiento real.

**Trabajo principal:**
- observabilidad y logging
- reintentos y manejo de errores
- criterios de offline-first para módulos específicos
- estrategia de sincronización y conflictos
- endurecimiento operativo

**Resultado esperado:** base más resiliente y lista para escalar verticalmente.

## Secuencia recomendada
1. Fase 1
2. Fase 2
3. Fase 3
4. Fase 4
5. Fase 5
6. Fase 6

## Skills / capacidades requeridas

### Negocio-producto
- blueprint de negocio
- modelado de ofertas por vertical
- diseño de journeys comerciales
- empaquetado de servicios y upsell por bloques

### Técnicas
- modelado de dominio multi-tenant
- diseño de workflows n8n
- gobierno de esquema Supabase
- RLS y control de acceso
- arquitectura de integraciones
- documentación técnica viva

### IA aplicada
- scoring contextual
- extracción estructurada
- clasificación de leads
- redacción asistida
- copiloto operativo
- automatización generativa acotada por proceso

## Riesgo de implementación
El mayor riesgo es avanzar en automatizaciones y verticales sin antes corregir el núcleo conceptual y el modelo de dominio. La prioridad de ejecución debe respetar la secuencia planteada.

## Inicio de ejecución
Con la aprobación del usuario, la ejecución formal inicia en la **Fase 1** con documentación, memoria técnica y alineación estratégica.
