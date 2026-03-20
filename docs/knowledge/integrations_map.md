# Integrations Map — Bloque Cero

## Mapa de Integraciones

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO (Navegador)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           Lovable Hosting (Frontend SPA)                    │
│           https://bloque-cero.lovable.app/                  │
│           Vite + React + Shadcn + TailwindCSS               │
└──────────────────────────┬──────────────────────────────────┘
                           │ Supabase JS Client
                           ▼
                    ┌─────────────────────────────────────────┐
                    │         Supabase Project                │
                    │  ID: ghbdarbyompzhwnqrxjz               │
                    │                                         │
                    │  ┌────────────┐  ┌──────────────────┐  │
                    │  │ PostgreSQL │  │   Supabase Auth  │  │
                    │  │ (Multi-    │  │  (JWT + OAuth)   │  │
                    │  │  tenant)   │  └──────────────────┘  │
                    │  └────────────┘                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │      Edge Functions (Deno)       │   │
                    │  │  - process-payment               │   │
                    │  │  - send-diagnostic-report        │   │
                    │  │  - create-lead                   │   │
                    │  └──────────────────────────────────┘   │
                    └──────────────────┬──────────────────────┘
                                       │ Webhooks / HTTP
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │   n8n (Automatización) — EasyPanel       │
                    │   https://n8n-n8n.z3tydl.easypanel.host/ │
                    │  - Onboarding de nuevo cliente           │
                    │  - Notificaciones WhatsApp/Email         │
                    │  - CRM básico (seguimiento de leads)     │
                    │  - Entrega de entregables                │
                    └──────┬─────────────────┬─────────────────┘
                           │                 │
                           ▼                 ▼
                    ┌──────────┐     ┌──────────────┐
                    │ WhatsApp │     │  Email SMTP  │
                    │ (Meta    │     │  (Resend /   │
                    │  API)    │     │  SendGrid)   │
                    └──────────┘     └──────────────┘

[Render.com — Seguimiento de despliegues / Health checks]
```

## Integraciones Actuales (Estado: Marzo 2026)

| Integración | Estado | Prioridad | Notas |
|-------------|--------|-----------|-------|
| GitHub → Lovable (auto-deploy) | 🟡 Configurar env vars | Alta | CI/CD nativo Lovable |
| Render.com (monitoring) | 🔴 Pendiente | Media | Health checks y seguimiento de despliegues |
| Supabase Auth | 🔴 Pendiente | Alta | Magic Link + Google |
| Supabase DB | 🔴 Pendiente | Alta | Schema sin definir |
| n8n (EasyPanel) | 🟢 Instancia activa | Media | https://n8n-n8n.z3tydl.easypanel.host/ |
| WhatsApp Business | 🔴 Pendiente | Media | Via n8n |
| Stripe | 🔴 Pendiente | Alta | Pagos de bloques en MXN |
| Email (Resend) | 🔴 Pendiente | Media | Via n8n o Supabase |

## Flujos de Integración Planeados

### Flujo 1: Lead → Cliente
```
Landing Page → Formulario Diagnóstico → Supabase (lead) → 
n8n Webhook → WhatsApp notificación al equipo → 
Propuesta → Pago (Stripe) → Supabase (cliente activo) → 
n8n → Email bienvenida + acceso al dashboard
```

### Flujo 2: Entrega de Bloque
```
Equipo completa bloque → n8n workflow → 
Supabase (estado = entregado) → Email notificación → 
Dashboard cliente muestra entregable
```

### Flujo 3: Diagnóstico Automático (IA)
```
Usuario completa quiz diagnóstico → Supabase Edge Function → 
IA procesa respuestas → Genera informe personalizado → 
n8n → Email con informe → Lead tag en Supabase
```
