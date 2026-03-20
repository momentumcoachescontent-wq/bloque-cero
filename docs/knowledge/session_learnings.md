# Session Learnings — Bloque Cero

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
