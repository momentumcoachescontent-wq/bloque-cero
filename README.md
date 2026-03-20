# Bloque Cero

> **"Convertimos tu idea en un Sistema Mínimo Operable."**

Agencia-producto para emprendedores en Latinoamérica. Entregamos micro-MVPs funcionales, rápido y sin consultoría teórica. Sin proyectos monolíticos de meses — operamos por bloques.

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

---

## 🏗️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend / Hosting | Lovable.app (Vite + React + Shadcn + TailwindCSS) |
| Repositorio | GitHub (auto-sync con Lovable) |
| Base de Datos | Supabase (PostgreSQL + RLS) |
| Autenticación | Supabase Auth (Magic Link + OAuth) |
| Edge Functions | Supabase Edge Functions (Deno/TypeScript) |
| Automatización | n8n self-hosted (EasyPanel/Hostinger) |
| Pagos | Stripe (MXN) |
| Monitoring / Webhooks | Render.com |

---

## 🪜 La Escalera de Bloques (Metodología)

| # | Bloque | Descripción |
|---|--------|-------------|
| 01 | **Radar de Idea** | Diagnóstico de viabilidad rápido y estructurado |
| 02 | **Blueprint de Negocio** | Modelo documentado en formato accionable |
| 03 | **MVP de Validación** | Prototipo funcional para usuarios reales |
| 04 | **Kit Operacional 1.0** | Herramientas base para el Día 1 |
| 05 | **Automatización Inicial** | Conexión de procesos clave con flujos automatizados |
| 06 | **Operación Inteligente (IA)** | IA para escalar decisiones y optimizar operaciones |

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
# → http://localhost:8080
```

### Build de producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
bloque-cero/
├── src/
│   ├── pages/           # Rutas (Index, NotFound, Diagnostic, Login, Dashboard...)
│   ├── components/      # Componentes reutilizables (Navbar, Hero, ProductGrid...)
│   │   └── ui/          # Componentes Shadcn UI
│   ├── lib/             # Cliente Supabase, utils
│   ├── hooks/           # Hooks personalizados (useAuth...)
│   ├── context/         # Contextos React (AuthContext)
│   └── App.tsx          # Router raíz
├── supabase/
│   ├── migrations/      # Migrations SQL (schema + RLS policies)
│   └── functions/       # Edge Functions Deno
├── docs/
│   └── knowledge/       # Base de conocimiento del proyecto (para agente IA)
└── n8n/
    └── workflows/       # Workflows de automatización n8n (JSON)
```

---

## 🤖 Agente IA (Antigravity)

Este proyecto usa **Antigravity** (Google DeepMind) como agente de desarrollo. El directorio `docs/knowledge/` contiene la base de conocimiento estructurada que el agente usa para mantener contexto entre sesiones:

| Archivo | Contenido |
|---------|-----------|
| `project_overview.md` | Resumen ejecutivo y estado actual |
| `tech_stack.md` | Stack técnico completo y decisiones |
| `architecture_decisions.md` | ADRs (Architecture Decision Records) |
| `business_context.md` | Modelo de negocio y contexto |
| `integrations_map.md` | Mapa de integraciones y servicios |
| `risks_and_assumptions.md` | Riesgos identificados y supuestos |
| `open_questions.md` | Preguntas abiertas pendientes de respuesta |
| `backlog_insights.md` | Ideas de backlog priorizadas |
| `domain_glossary.md` | Glosario del dominio |
| `session_learnings.md` | Aprendizajes de sesiones anteriores |

---

## 📋 Modelo de Negocio

| Modalidad | Tipo | Descripción |
|-----------|------|-------------|
| **Build** | Pago único (OTC) | Entregables a la carta por bloque |
| **Run** | Suscripción (MRR) | Mantenimiento, soporte y evolución |

---

## 🗺️ Roadmap

- [x] **Fase 0** — Base de conocimiento y estructura del repo
- [ ] **Fase 1** — Conexión Supabase + Schema inicial (Semana 1)
- [ ] **Fase 2** — Diagnóstico funcional + Auth con Magic Link (Semana 2)
- [ ] **Fase 3** — Dashboard de cliente + Pagos Stripe (Semana 3)
- [ ] **Fase 4** — Automatización n8n: onboarding, notificaciones, seguimiento (Semana 4)

---

## 🤝 Contribuir

El flujo de trabajo es:

```
Lovable Editor → GitHub (auto-sync) → PR → main → Lovable Hosting
```

Para cambios de código desde fuera de Lovable:
1. Crea un branch desde `main`
2. Haz tus cambios y push
3. Crea un Pull Request → `main`
4. Lovable detecta el merge automáticamente

---

*Bloque Cero © 2026 — Construido con ❤️ para emprendedores LATAM*
