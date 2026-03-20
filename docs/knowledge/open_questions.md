# Open Questions — Bloque Cero

## Preguntas Críticas (Bloquean decisiones técnicas)

| ID   | Pregunta | Para quién | Impacto |
|------|----------|-----------|---------|
| OQ-01 | ¿Cuál es el pricing aprobado y final para cada bloque? | Fundador | Definir componentes de precios en la UI |
| OQ-02 | ¿Existe ya algún cliente real o lead calificado? | Fundador | Priorizar dashboard vs. captación |
| OQ-03 | ¿El botón "Iniciar Diagnóstico" debe llevar a un formulario multi-paso o a un chat IA? | Fundador | Flujo de Bloque 1 (Radar de Idea) |
| OQ-04 | ¿Se tiene dominio propio (ej: bloquecero.com)? | Fundador | Configuración Cloudflare Pages |
| OQ-05 | ¿Stripe o Mercado Pago para los pagos? | Fundador | Depende del mercado principal (USD vs. MXN/BRL/COP) |
| OQ-06 | ¿n8n Cloud o self-hosted? | Fundador | Costo mensual + mantenimiento |
| OQ-07 | ¿Los Google Docs pueden hacerse legibles sin login? | Fundador | Permitir que el agente acceda en sesiones futuras |

## Preguntas de Diseño (Afectan la arquitectura)

| ID   | Pregunta | Impacto |
|------|----------|---------|
| OQ-08 | ¿Cada cliente ve solo su progreso en la escalera, o también hay un panel admin? | Schema de DB y rutas |
| OQ-09 | ¿Los entregables son documentos PDF, links, acceso a sistemas? ¿Cómo se entregan? | Flujo de entrega y Supabase Storage |
| OQ-10 | ¿Se quiere multilenguaje (ES + PT para Brasil)? | Arquitectura i18n |
| OQ-11 | ¿Qué nivel de automatización tiene el Radar de Idea? ¿Es manual o IA genera el informe? | Edge Functions + IA |
| OQ-12 | ¿Cuál es el email institucional del negocio? | SMTP configuration, footer, contacto |

## Preguntas de Contenido

| ID   | Pregunta | Impacto |
|------|----------|---------|
| OQ-13 | ¿Hay testimonios de clientes reales para agregar a la landing? | Social proof y conversión |
| OQ-14 | ¿Qué incluye exactamente cada bloque (entregables específicos)? | Página de servicios detallada |
| OQ-15 | ¿Cuál es el tiempo de entrega promedio por bloque? | Promise de velocidad en la landing |
