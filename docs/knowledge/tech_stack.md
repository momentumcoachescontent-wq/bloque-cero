# Tech Stack — Bloque Cero

## Stack del Proyecto

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Frontend / Hosting | **Lovable.app** | Editor de UI colaborativo + hosting de la app |
| Repositorio | GitHub | Versionado (auto-sync con Lovable) |
| Base de Datos | Supabase (Postgres) | RDBMS principal + Row-Level Security |
| Auth | Supabase Auth | Autenticación JWT + OAuth / Magic Link |
| Edge Functions | Supabase Edge Fn | Lógica de negocio serverless (Deno) |
| Automatización | n8n en EasyPanel | Orquestación de workflows (Hostinger) |
| Agente IA MCP | Supabase MCP | Conexión directa agente ↔ Supabase |

## Stack Actual del Frontend (Lovable / GitHub)

| Tecnología         | Versión | Rol |
|--------------------|---------|-----|
| Vite               | ^5.4    | Build tool |
| React              | ^18.3   | UI Framework |
| TypeScript         | ^5.8    | Type safety |
| Tailwind CSS       | ^3.4    | Utilidades CSS |
| Shadcn UI          | Latest  | Componentes accesibles |
| Radix UI           | Various | Primitivas de UI |
| React Router DOM   | ^6.30   | Routing SPA |
| TanStack Query     | ^5.83   | Server state management |
| Supabase JS        | ^2.99   | Cliente Supabase |
| React Hook Form    | ^7.61   | Manejo de formularios |
| Zod                | ^3.25   | Validación de esquemas |
| Recharts           | ^2.15   | Gráficas y visualización |
| Lucide React       | ^0.462  | Iconografía |

## Supabase Project
- **Project ID:** ghbdarbyompzhwnqrxjz
- **URL:** https://ghbdarbyompzhwnqrxjz.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/ghbdarbyompzhwnqrxjz

## GitHub Repository
- **Org:** momentumcoachescontent-wq
- **Repo:** bloque-cero
- **URL:** https://github.com/momentumcoachescontent-wq/bloque-cero
- **Branch principal:** main

## Estructura de Carpetas Actual (React)
```
src/
  App.tsx              — Router raíz (solo index + notfound)
  pages/
    Index.tsx          — Landing page principal
    NotFound.tsx       — 404
  components/
    Navbar.tsx
    HeroSection.tsx
    ProductGrid.tsx    — "La Escalera de Bloques"
    TechStack.tsx
    Footer.tsx
    ui/                — Componentes Shadcn
```

## Decisiones de Stack Confirmadas
1. **Lovable.app** es el editor de UI + la plataforma de hosting de la app
2. **GitHub** se sincroniza automáticamente con Lovable — es la fuente de verdad del código
3. **Supabase** es el backend único — no hay servidor Node/Express dedicado
4. **n8n** ya está instanciado en EasyPanel/Hostinger: https://n8n-n8n.z3tydl.easypanel.host/
5. **Stripe** con moneda MXN para pagos (al tipo de cambio del día)
6. **Supabase MCP** configurado para conexión directa agente ↔ Supabase

## Variables de Entorno Requeridas
```
VITE_SUPABASE_URL=https://ghbdarbyompzhwnqrxjz.supabase.co
VITE_SUPABASE_ANON_KEY=[anon key from Supabase dashboard]
```

## TO-DO Técnico
- [x] Configurar Supabase MCP en mcp_config.json
- [x] Instalar supabase-postgres-best-practices skill
- [ ] Restart Antigravity + completar OAuth flow de Supabase MCP
- [ ] Configurar variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Lovable
- [ ] Implementar Supabase Auth (Magic Link)
- [ ] Definir schema de base de datos en Supabase (via MCP)
- [ ] Crear workflows en n8n (https://n8n-n8n.z3tydl.easypanel.host/)
- [ ] Integrar Stripe con moneda MXN
