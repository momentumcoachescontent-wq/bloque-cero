# Session Learnings — Bloque Cero

---
## Sesión 002 — 2026-03-23 (Transmutando el Error en Resiliencia Estructural)

### Contexto
Auditoría profunda de seguridad sobre el esquema de Supabase. El sistema presentaba "Puntos Ciegos" (autosabotaje): funciones inexistentes (`get_user_role()`), perfiles frágiles en el AuthContext, reglas que permitían spam en `leads` y reglas destructivas de administradores en `projects`.

### Lo que fallaba (Las Sombras)
- Políticas de seguridad dependiendo de `get_user_role()` cuando esta función no existía en la DB.
- Frontend AuthContext paralizado sin fallbacks en caso de que el disparador de base de datos fallara.
- `leads` permitiendo entradas sin filtro (`WITH CHECK (true)`).
- `projects` permitiendo borrado ciego por admins (`FOR ALL`).

### Decisiones Tomadas (La Cura)
- Inyectar identidades reales: Crear función garantizada `get_user_role()` usando `SECURITY DEFINER`.
- Abrazar el conflicto: Añadir mecanismo de reintento y fallback en Memoria Virtual (`AuthContext.tsx`) para proteger al usuario local.
- Imponer límites: Reemplazar `WITH CHECK (true)` en las políticas abiertas por reglas de validación mínima (como Regex para emails en el DB layer).
- Freno de destrucción: Trocear políticas `FOR ALL` de administradores hacia solo `SELECT/UPDATE`.
- Documentar estas *Leyes de Resiliencia Inquebrantable* en `SKILL.md` para blindar todos los desarrollos futuros bajo estos preceptos.

---
## Sesión 001 — 2026-03-19 (Sesión de Arranque)

### Contexto
Primera sesión de trabajo del agente. Objetivo: analizar el proyecto existente y generar un plan de robustecimiento completo.

### Lo que se intentó
- Leer repositorio GitHub del proyecto
- Acceder a documentos de Google (Plan de Negocio, Prompts, Estrategia de Precios)
- Explorar Supabase dashboard
- Navegar la app en producción (Lovable)
- Leer código fuente de los componentes React

### Lo que funcionó
- GitHub repo accesible (repo público) — se leyeron package.json, App.tsx, Index.tsx, ProductGrid.tsx, HeroSection.tsx, Footer.tsx
- La app en https://bloque-cero.lovable.app/ está activa y fue explorada con el browser subagent
- Screenshots capturados de: Hero section y Metodología section
- Supabase project ID identificado: ghbdarbyompzhwnqrxjz
- Stack técnico confirmado completamente

### Lo que falló
- **Google Docs requieren autenticación** — Los tres documentos (Plan de Negocio, Prompts, Estrategia de Precios) redirigen al login de Google. No es posible leerlos con herramientas de scraping.
- Supabase dashboard requiere autenticación — no se pudo leer el schema actual

### Causas Raíz
- Google Docs están en modo "requiere cuenta Google para ver" (no público-sin-login)
- Para futuras sesiones: compartir los docs como "Cualquier persona con el enlace → Lector"

### Decisiones Tomadas
- Proceder con el plan basado en la información visible (GitHub + Lovable + metadatos de los docs)
- El OG description de los Google Docs proveyó fragmentos estratégicos valiosos:
  - Plan de Negocio: "4 capas de arquitectura + 6 micro-productos escalonados"
  - Prompts: "System Prompt para dar contexto a IA antes de trabajar en micro-productos"
  - Precios: "Psicología del emprendedor LATAM: sensibilidad al precio, aversión al riesgo, fatiga de suscripciones"
- Crear toda la base de conocimiento desde cero con lo extraído

### Consideraciones
- El proyecto está en etapa muy temprana — solo existe la landing page
- No hay rutas internas, auth, ni backend activo todavía
- Hay potencial de que el README del repo esté desactualizado (solo dice "Welcome to Lovable project")

### Preguntas sin resolver
- ¿Cuál es el pricing exacto de cada bloque? (Google Doc inaccesible)
- ¿Ya existe algún cliente real? ¿hay datos en Supabase?
- ¿Existe instancia n8n activa?
- ¿El flujo de "Iniciar Diagnóstico" (botón en la nav) lleva a algún formulario o está vacío?
- ¿Cuál es el email/WhatsApp del negocio para el CTA de contacto?
- ¿Se tiene dominio propio? (bloquecero.com o similar)

### Próximos Pasos Recomendados
1. Hacer públicos los Google Docs para que el agente pueda leerlos en futuras sesiones
2. Ejecutar el plan de robustecimiento por fases (ver implementation_plan.md)
3. Implementar Fase 1: Diagnóstico funcional + Supabase Auth
4. Definir el schema completo de la base de datos antes de escribir código

---
## Sesión 004 — 2026-05-20 (Monetización y Vigilancia Estratégica)

### Contexto
Implementación del túnel de ingresos (Stripe) y la infraestructura de observabilidad (Telemetría). El objetivo fue cerrar el ciclo de negocio permitiendo el cobro por los activos generados.

### Lo que funcionó
- **Paywall Infranqueable**: Se implementó una lógica de `is_premium` que bloquea visualmente los Blueprints no pagados con un efecto blur elegante.
- **Checkout Híbrido**: La redirección a Stripe desde el Dashboard central funciona sin fricciones mediante la Edge Function `stripe-checkout`.
- **Telemetría Automática**: La tabla `system_logs` ya está registrando eventos críticos, permitiendo una visibilidad real sobre fallos en el despacho de n8n.
- **Golden Loops**: Los scripts de semilla ahora generan ejemplos de alta conversión que sirven como demostraciones comerciales.

### Lecciones Aprendidas
- **Gobernanza de Datos**: La importancia de los webhooks asíncronos para reconciliar estados de pago sin intervención humana. El webhook es el "Cerebro Silencioso" que desbloquea la bóveda.
- **Psicología del Paywall**: El uso de términos como "Bóveda Estratégica" y "Desbloqueo Arquitectónico" refuerza el valor del producto sobre el precio, alineándose con la identidad *Beyond Fear*.

### Decisiones Tomadas
- Ejecutar migraciones SQL incrementales (`05_stripe_monetization.sql`) en lugar de refactors masivos para mantener la operatividad y reducir el riesgo de downtime.
- Centralizar los secretos de Stripe exclusivamente en las Edge Functions de Supabase para evitar fugas en el cliente.
