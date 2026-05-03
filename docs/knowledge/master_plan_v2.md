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

### Fase 3 — Refactor de dominio y backend operativo [COMPLETADA]
**Objetivo:** alinear modelo de datos y flujos con el nuevo producto.

**Resultado:**
- Tabla canónica `business_blueprints` definida y con read-model activo.
- Orquestación segura vía `n8n-bridge` activa y verificada.
- Eliminación de hardcoding en Contacto y Admin (Auditoría Abril 2026).
- **Nota:** Se eliminó la simulación en paneles administrativos; ahora reportan salud real.

---

### Fase 4 — Verticalización de servicios [COMPLETADA/ESTABILIZADA]
**Objetivo:** empacar soluciones vendibles sobre la base común.

**Trabajo principal:**
- Configuración de Storage Buckets para entregables (Activos).
- Adopción de la "Ley Documental" (Skill de Fulfillment) para estandarización.
- Refactor de `DownloadsSection` para uso de bucket `radar_deliverables`.

---

### Fase 5 — Automatización Avanzada y Reportes (Bloque F) [COMPLETADA]
**Objetivo:** elevar el valor percibido del Blueprint mediante entregables de alta consultoría.

**Trabajo principal:**
- Upgrade UX: Migrar de Polling a **Supabase Realtime** para redirección inmediata.
- Arquitectura Zero-Trust y estabilización técnica.
- Investigación de monetización (Stripe LATAM).

---

### Fase 6 — Go-To-Market (GTM) y "Golden Loops" [COMPLETADA]
**Objetivo:** Generar "Casos de Uso Perfectos" (Golden Loops) que sirvan como material de venta y demuestren el ecosistema completo funcionando por vertical.

**Resultado:**
- Inyección de Casos de Éxito: Scripts de semilla activos (`seed_golden_loops.sql`) con rutas reales `/b/demo-psicologia`, `/b/demo-agencia`.
- Refinamiento Analítico: Dashboards operativos que muestran la robustez de la solución.
- URLs Públicas: Capacidad de compartir demostraciones funcionales de alta consultoría.

---

### Fase 7 — Escalamiento, resiliencia y telemetría [COMPLETADA]
**Objetivo:** robustecer la plataforma para crecimiento real y visibilidad operativa.

**Resultado:**
- Sistema de Telemetría: Tabla `system_logs` activa capturando latencia y errores.
- Observabilidad: Dashboards internos que permiten monitorear la salud del despacho de n8n.
- Endurecimiento Operativo: RLS optimizado y manejo de errores centralizado.

---

### Fase 8 — Monetización (Stripe LATAM) [COMPLETADA]
**Objetivo:** Establecer la capa de ingresos mediante el desbloqueo de activos premium.

**Trabajo principal:**
- Infraestructura de Pagos: Edge Functions `stripe-checkout` y `stripe-webhook` desplegadas.
- Paywall Estratégico: Bloqueo visual (blur) y control de acceso en `BlueprintPage.tsx`.
- Checkout Dinámico: Soporte para cobros en MXN ($499) y reconciliación automática de `is_premium`.

---

### Fase 9 — Optimización de Conversión (CRO) y Expansión [SIGUIENTE PASO]
**Objetivo:** Maximizar el retorno de la inversión y expandir el catálogo de servicios.

**Trabajo principal:**
- A/B Testing del Paywall: Probar diferentes niveles de ofuscación y copys de "confronte".
- Expansión de Verticales: Implementar Blueprints especializados para E-commerce y Real Estate.
- Dashboards de Negocio para Clientes: Visualización de KPIs de crecimiento post-traumático del negocio.
- Integración de Agenda: Conexión directa con consultoría humana tras el pago del Blueprint.

---

## Secuencia de Ejecución
1. Fase 1 al 8 (Completadas)
2. Fase 9 (CRO & Expansión)
3. Fase 10 (Escalamiento Masivo)

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
