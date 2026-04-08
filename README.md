# Bloque Cero

> **"Convertimos tu idea en un Sistema Mínimo Operable."**

Bloque Cero es una agencia-producto para emprendedores y negocios en Latinoamérica. Diseñamos, construimos y operamos sistemas mínimos funcionales para validar ideas, ordenar operaciones y escalar con automatización e IA aplicada.

[![Lovable](https://img.shields.io/badge/hosted%20on-Lovable-8b5cf6?style=flat-square)](https://bloque-cero.lovable.app/)
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ecf8e?style=flat-square)](https://supabase.com/dashboard/project/ghbdarbyompzhwnqrxjz)
[![GitHub](https://img.shields.io/badge/repo-GitHub-181717?style=flat-square&logo=github)](https://github.com/momentumcoachescontent-wq/bloque-cero)

---

## 🔗 Links

| Recurso | URL |
|---------|-----|
| App (producción) | https://bloque-cero.lovable.app/ |
| Supabase Dashboard | https://supabase.com/dashboard/project/ghbdarbyompzhwnqrxjz |
| n8n (automatización) | https://n8n-n8n.z3tydl.easypanel.host/ |
| Repo GitHub | https://github.com/momentumcoachescontent-wq/bloque-cero |

---

## 🏗️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend / Hosting | Lovable.app (Vite + React + Shadcn + TailwindCSS) |
| Repositorio | GitHub (sync con Lovable) |
| Base de Datos | Supabase (PostgreSQL + RLS) |
| Autenticación | Supabase Auth |
| Automatización | n8n self-hosted (EasyPanel/Hostinger) |
| Integraciones futuras | WhatsApp, email, CRM, IA aplicada |

---

## 🧱 Portafolio objetivo

### Núcleo comercial

| # | Bloque | Descripción |
|---|--------|-------------|
| 01 | **Blueprint de Negocio** | Unifica Radar de Idea + Blueprint de Negocio en un solo flujo de descubrimiento, scoring, arquitectura inicial y recomendación de ruta |
| 02 | **MVP de Validación** | Prototipo funcional para validar oferta y captar usuarios reales |
| 03 | **Kit Operacional 1.0** | Herramientas base de operación para el día 1 |
| 04 | **Automatización Inicial** | Integración de procesos clave con workflows automatizados |
| 05 | **Operación Inteligente con IA** | IA aplicada a ventas, soporte, seguimiento y operación |

### Verticales prioritarias
- **CRM Vertical para servicios**
- **Gestión de Negocios Locales**

### Capacidades transversales
- Automatización de procesos con IA generativa
- Integración multicanal vía WhatsApp + email
- Integraciones operativas con CRM, formularios, storage y notificaciones
- Offline-first selectivo para casos de uso concretos

---

## 🚦 Estado actual del proyecto

El repositorio ya cuenta con una base funcional superior a la descrita en la documentación original.

### Implementado o parcialmente implementado
- Landing pública funcional
- Catálogo de bloques
- Ruta de diagnóstico (`/diagnostico`)
- Flujo de Blueprint montado sobre leads previos
- Dashboard de cliente
- Panel administrativo
- Integración frontend con Supabase
- Disparo de webhook a n8n desde cliente
- React Query para cache y fetch de datos

### Pendientes estructurales
- Unificar Radar + Blueprint a nivel de producto y dominio
- Normalizar modelo de datos
- Actualizar narrativa comercial y documentación
- Definir verticales oficiales
- Formalizar estrategia multicanal e IA aplicada
- Evaluar offline-first solo en módulos prioritarios

---

## 🗺️ Plan de implementación vigente

El proyecto entra ahora a un plan de implementación en **6 fases**:

| Fase | Nombre | Objetivo |
|------|--------|----------|
| 1 | Reenfoque estratégico y plan maestro | Actualizar alcance, documentación y portafolio |
| 2 | Consolidación del núcleo comercial y UX | Unificar la experiencia de Blueprint de Negocio |
| 3 | Refactor de dominio y backend operativo | Alinear modelo de datos, admin y workflows |
| 4 | Verticalización de servicios | Empaquetar CRM para servicios y gestión de negocios locales |
| 5 | Automatización multicanal + IA aplicada | Orquestar canales, seguimiento e inteligencia operativa |
| 6 | Escalamiento y resiliencia | Endurecer operación, observabilidad y offline-first selectivo |

Documentación fuente del plan:
- `docs/knowledge/master_plan_v2.md`
- `docs/knowledge/technical_memory.md`

---

## 🚀 Setup Local

### Pre-requisitos
- Node.js >= 18
- `npm` o `pnpm`

### Instalación

```bash
git clone https://github.com/momentumcoachescontent-wq/bloque-cero.git
cd bloque-cero
npm install
```

### Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
VITE_SUPABASE_URL=https://ghbdarbyompzhwnqrxjz.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### Correr en desarrollo

```bash
npm run dev
```

### Build de producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```text
bloque-cero/
├── src/
├── supabase/
├── docs/
│   └── knowledge/
├── public/
└── README.md
```

Archivos clave de conocimiento:
- `docs/knowledge/project_overview.md`
- `docs/knowledge/business_context.md`
- `docs/knowledge/architecture_decisions.md`
- `docs/knowledge/integrations_map.md`
- `docs/knowledge/master_plan_v2.md`
- `docs/knowledge/technical_memory.md`

---

## 🤝 Flujo de trabajo

```text
Lovable Editor → GitHub (sync) → main → Lovable Hosting
```

Para cambios desde fuera de Lovable:
1. partir de `main`
2. hacer cambios
3. validar localmente
4. push y PR si aplica
5. verificar impacto sobre el sync con Lovable

---

*Bloque Cero © 2026 — Construido para emprendedores y operadores que necesitan sistema, no humo.*
