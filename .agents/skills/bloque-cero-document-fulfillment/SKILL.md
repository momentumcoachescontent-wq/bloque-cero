---
name: bloque-cero-document-fulfillment
description: Arquitectura y estándares para la generación automatizada de reportes Premium (PDFs) y su entrega al cliente.
---

# Bloque Cero Document Fulfillment Skill

Este skill define la doctrina de ingeniería para transformar los datos en crudo (Scoring + Expansión) en un activo digital (PDF) de alta consultoría ("Beyond Fear"). Su cumplimiento es estricto en la **Fase 5 (Automatización de Reportes)**.

## 1. El Mandamiento de la Entrega
El PDF final no es un recibo; es el producto. Debe exudar **autoridad, claridad y un diseño Premium**. No se permiten reportes planos, sin márgenes ni tipografía jerarquizada.

## 2. Arquitectura de Generación (El Pipeline)
La generación de documentos nunca debe ocurrir en el Front-end (cliente). Es un proceso exclusivo de Backend/Orquestación (n8n).

1. **Ingesta:** `n8n` recupera el payload final desde Supabase (`business_blueprints` o la tabla legada en transición).
2. **Transformación (IA):** Los nodos de IA en n8n interpretan las respuestas en crudo para generar prosa consultiva (Copywriting estratégico).
3. **Plantillaje (Templating):** Inyección de textos en una plantilla estandarizada. *Preferencia arquitectónica: HTML/CSS fuertemente tipificado y alineado a UI Standards, inyectado mediante un motor como Handlebars dentro de n8n.*
4. **Renderizado (PDF Generation):** Transformación vía API externa confiable (ej. API de renderizado PDF, Gotenberg hosteado u otro nodo nativo).
5. **Almacenamiento (Storage):** El Buffer resultante se carga directamente al bucket `blueprint_deliverables` de Supabase a través de su API Rest.
6. **Notificación (Lifecycle):** Supabase actualiza el caso a `status: delivered` y añade el `file_url`, lo que gatilla notificaciones (Webhook/n8n -> WhatsApp/Email).

## 3. Consideraciones de Diseño UI (Reportes)
- **Tipografía:** Usar fuentes limpias y serias (Inter, Roboto, Helvetica, etc.) integradas en el PDF.
- **Portadas:** Títulos imponentes, uso intenso del espacio negativo, fondo oscuro (Dark Mode, opcional pero altamente preferido si encaja con "Beyond Fear").
- **Elementos Visuales:** Si se incluyen gráficos o "Radares", deben renderizarse antes como imágenes (Base64) para su correcto empotrado en el PDF.
- **Tono de Voz:** Revisar siempre `bloque-cero-growth-marketing` para inyectar el tono sanador/provocativo en los análisis de debilidades de la empresa.

## 4. Gestión de Asincronía
- El proceso toma tiempo. En el Frontend, el estado `queued_for_delivery` debe mostrar el Wireframing/Skeleton animado, nunca paralizar el navegador.

## 5. Implementación Crítica
Para todo nuevo workflow de Fulfillment de PDFs liderado por este skill:
- Crea los templates en archivos `.html` controlados en versión dentro de una carpeta `/templates` (para auditoría).
- Emplea un Node `HTTP Request` en n8n validado siempre mediante secretos (Supabase JWT/Service Role) para inyectar el PDF en el Bucket de Storage.
