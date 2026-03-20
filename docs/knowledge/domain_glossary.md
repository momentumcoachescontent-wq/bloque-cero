# Domain Glossary — Bloque Cero

## Términos del Negocio

| Término | Definición |
|---------|-----------|
| **Bloque** | Una unidad de trabajo/entregable comprable individualmente (equivale a un micro-MVP) |
| **SMO (Sistema Mínimo Operable)** | El estado mínimo funcional de un negocio digital — puede operar y cobrar |
| **Escalera de Bloques** | La secuencia ordenada de 6 bloques que lleva a un emprendedor del caos al SMO |
| **Radar de Idea** | Bloque 1: Diagnóstico de viabilidad rápido y estructurado |
| **Blueprint de Negocio** | Bloque 2: Documentación del modelo de negocio en formato accionable |
| **MVP de Validación** | Bloque 3: Prototipo funcional para probar con usuarios reales |
| **Kit Operacional 1.0** | Bloque 4: Herramientas y configuración base para operar el día 1 |
| **Automatización Inicial** | Bloque 5: Conexión de procesos críticos con flujos automatizados (n8n) |
| **Operación Inteligente** | Bloque 6: Integración de IA para escalar decisiones y optimizar |
| **Agencia-Producto** | Modelo de negocio donde se venden productos (bloques) predefinidos, no proyectos custom sin fin |
| **OTC (One-Time Cost)** | Build tier — pago único por un bloque entregado |
| **MRR (Monthly Recurring Revenue)** | Run tier — suscripción mensual de mantenimiento/evolución |
| **LATAM** | Latinoamérica — mercado objetivo del proyecto |
| **Diagnóstico** | Evaluación inicial del estado de la idea/negocio del cliente (flujo de onboarding) |
| **Entregable** | El artefacto concreto que recibe el cliente al finalizar un bloque |

## Términos Técnicos

| Término | Definición |
|---------|-----------|
| **Edge Function** | Función serverless ejecutada en el edge de Cloudflare o Supabase |
| **Worker** | Cloudflare Worker — función JavaScript en el edge global |
| **RLS (Row-Level Security)** | Política de Supabase que filtra datos por usuario automáticamente |
| **Tenant** | Cliente/empresa que usa el sistema — cada uno tiene sus datos aislados |
| **Webhook** | Endpoint HTTP que recibe eventos de sistemas externos (n8n, Stripe, etc.) |
| **Workflow** | Secuencia automatizada de pasos en n8n |
| **RAG** | Retrieval-Augmented Generation — IA que busca en base de conocimiento antes de responder |
| **Magic Link** | Link de autenticación sin contraseña enviado por email (Supabase Auth) |
| **SPA** | Single Page Application — la arquitectura frontend actual (Vite + React) |
| **Lovable** | Plataforma de generación colaborativa de UI que exporta código React a GitHub |

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **Cliente** | Emprendedor que compró uno o más bloques |
| **Agente** | El equipo de Bloque Cero que entrega el bloque |
| **Admin** | Administrador del sistema (puede ver todos los clientes y bloques) |
| **Lead** | Prospecto que completó el diagnóstico pero no compró aún |
