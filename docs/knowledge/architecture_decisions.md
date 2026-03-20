# Architecture Decisions — Bloque Cero

## ADR-001: Stack Tecnológico
**Fecha:** 2026-03-19  
**Estado:** ACEPTADO  
**Decisión:** Stack: Lovable (Frontend/Hosting) + Supabase (Backend) + n8n en EasyPanel (Automatización) + GitHub (Repositorio)

**Contexto:** Se necesita un stack económico, sin servidores que mantener, con base de datos robusta y ciclo UI→deploy rápido.

**Consecuencias:**
- (+) Lovable provee hosting, colaboración de UI y exportación a GitHub en un flujo integrado
- (+) Supabase provee Auth, DB, Edge Functions en un solo servicio con tier gratuito generoso
- (+) n8n ya está instanciado en EasyPanel/Hostinger — sin costo adicional de hosting
- (+) Costo operativo mínimo en etapas tempranas
- (-) Lovable tiene límites de uso según el plan contratado
- (-) No se puede usar Next.js (Lovable genera Vite+React SPA sin SSR)

---

## ADR-002: Frontend como SPA con Vite + React — Hospedado en Lovable
**Fecha:** 2026-03-19  
**Estado:** ACEPTADO  
**Decisión:** El frontend vive en Lovable (editor + hosting). La app es un SPA Vite + React + Shadcn exportada a GitHub.

**Contexto:** Lovable es el origen del código y también el host actual de la app. El repositorio GitHub se sincroniza automáticamente con cada cambio en Lovable.

**Arquitectura de deploy:**
```
Lovable Editor → GitHub (auto-sync) → Lovable Hosting (producción)
```

**Consecuencias:**
- (+) Ciclo de diseño→deploy muy rápido con Lovable
- (+) GitHub como fuente de verdad: el agente puede leer y proponer código via PRs
- (+) Componentes Shadcn UI disponibles de fábrica
- (-) SEO limitado sin SSR (mitigable con meta tags + schema.org)
- (-) Rutas protegidas requieren guards del lado cliente (ProtectedRoute)
- (-) Para cambios de código fuera de Lovable: push a GitHub → Lovable detecta el cambio

---

## ADR-003: Supabase como Backend-as-a-Service
**Fecha:** 2026-03-19  
**Estado:** ACEPTADO  
**Decisión:** Todo el backend vive en Supabase (Postgres, Auth, Edge Functions)

**Contexto:** No hay servidor Node/Express dedicado. La lógica de negocio se distribuye entre:
- Supabase Edge Functions (TypeScript/Deno) — lógica sensible y APIs
- Lovable Hosting — sirve el SPA estático (Vite+React), sin proxy adicional
- n8n — orquestación de workflows y automatizaciones

**Consecuencias:**
- (+) Sin gestión de infraestructura de servidor
- (+) Row-Level Security (RLS) para seguridad de datos por usuario
- (-) Cold start en Edge Functions (mitigable con warm-up)
- (-) Vendor lock-in parcial con Supabase

---

## ADR-004: n8n como Motor de Automatización
**Fecha:** 2026-03-19  
**Estado:** PENDIENTE IMPLEMENTACIÓN  
**Decisión:** n8n manejará: onboarding de clientes, notificaciones, CRM básico, integración WhatsApp

**Contexto:** Los workflows de negocio (confirmación de pedido, entrega de diagnóstico, seguimiento) son automatizables sin código custom.

**Consecuencias:**
- (+) Sin código para lógica de negocio recurrente
- (+) Visual y fácil de modificar por el equipo no técnico
- (+) Ya instanciado en EasyPanel/Hostinger: https://n8n-n8n.z3tydl.easypanel.host/ — sin costo adicional
- ✅ Decisión tomada: **self-hosted en EasyPanel** (instancia existente)

---

## ADR-005: Supabase Auth como sistema de identidad
**Fecha:** 2026-03-19  
**Estado:** PENDIENTE IMPLEMENTACIÓN  
**Decisión:** Usar Supabase Auth con Magic Link y/o Google OAuth

**Contexto:** Los clientes necesitan un panel donde ver el estado de sus proyectos/bloques adquiridos.

**Consecuencias:**
- (+) Auth nativo integrado con RLS de Supabase
- (+) Magic Link reduce fricción de registro
- (-) Requiere configurar SMTP o Email Provider en Supabase

---

## ADR-006: Arquitectura Multi-tenant por cliente
**Fecha:** 2026-03-19  
**Estado:** DEFINICIÓN PENDIENTE  
**Decisión:** Cada cliente/empresa es un `tenant` en la base de datos con RLS

**Consecuencias:**
- (+) Un solo proyecto Supabase sirve a todos los clientes
- (+) RLS garantiza aislamiento de datos
- (-) Diseño de esquema multi-tenant requiere cuidado inicial
