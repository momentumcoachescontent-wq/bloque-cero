---
name: bloque-cero-document-fulfillment
description: Reglas de arquitectura y cumplimiento para la generación documental (PDF/Fulfillment) en Bloque Cero.
---

# Bloque Cero: Ley Documental y Fulfillment (Fase 5)

Este documento centraliza los mandamientos irrefutables para la orquestación y entrega de reportes premium (Business Blueprints en formato PDF), erradicando el "miedo a entregar de forma inconsistente".

## 1. Arquitectura de Generación Documental (Zero-Trust Delivery)

Ninguna generación de documentos debe depender del frontend. El cliente solicita, pero no fabrica.
Todas las operaciones de renderizado PDF, empaquetado y entrega se realizan Backend-First bajo el siguiente flujo:

1. **Trigger de Orquestación:** El usuario envía su petición a través del frontend. Supabase o n8n reciben la petición.
2. **Motor de Enriquecimiento (n8n):** Antes de crear el documento, la IA evalúa y nutre las respuestas (Scoring + Diagnóstico).
3. **Renderizado (Generador de PDF):** El nodo de n8n o un servicio headless (ej., Puppeteer/Playwright/API de pdf) compila la plantilla `.hbs` o `.md` inyectando los datos de la base de datos.
4. **Almacenamiento (Supabase Storage):** El PDF final generado se almacena **obligatoriamente** en el bucket privado/público `radar_deliverables` bajo una convención estricta: `[uuid-del-blueprint].pdf`.
5. **Notificación (Webhook/Email):** Se notifica al cliente que su Blueprint está listo con un `signed-url` para acceso seguro.

## 2. Convenciones Estrictas de Almacenamiento

- **Ruta Fija:** Todo entregable final se almacena en el bucket de storage de Supabase (nunca se manda directamente adjunto por correo sin respaldo).
- **Control de Acceso:** Los Blueprints premium no pueden tener permisos de lectura anónima universales (`public`). Solo el `user_id` autenticado (o vía URL firmada).
- **Metadatos Obligatorios:** El campo `metadata` de la tabla `business_blueprints` debe actualizarse con el link interno del archivo.

## 3. Filosofía Estética del Documento

El PDF no es un reporte técnico; es una herramienta de cirugía de mercado (diseñado bajo la esencia "Más allá del Miedo").
Debe usar la identidad visual de Bloque Cero: tipografía `Space Grotesk` para encabezados agresivos y colores corporativos austeros. Cero paja y diseño de alto impacto.

## 4. Mitigación de Fallos (Resiliencia Operativa)

- Si la generación del PDF se detiene o el nodo falla, n8n debe despachar un error a nuestro canal interno de alertas (Ej. Discord o Slack).
- Bajo ningún escenario se debe dejar al usuario en un estado de "Cargando infinito" esperando su archivo.
