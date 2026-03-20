# External Sources Registry — Bloque Cero

## Fuentes Externas Consultadas

| Título | URL | Tipo | Relevancia | Fiabilidad | Fecha | Hallazgos | Impacto |
|--------|-----|------|-----------|-----------|-------|-----------|---------|
| GitHub: bloque-cero | https://github.com/momentumcoachescontent-wq/bloque-cero | Repositorio | Crítica | Alta | 2026-03-19 | Stack: Vite+React+Shadcn+Supabase; solo Index route; package.json con dependencias completas | Stack y estructura del proyecto |
| Lovable App (producción) | https://bloque-cero.lovable.app/ | App Web | Crítica | Alta | 2026-03-19 | Landing page funcional: hero, escalera 6 bloques, TechStack. Sin auth ni dashboard | Estado actual del frontend |
| Supabase Dashboard | https://supabase.com/dashboard/project/ghbdarbyompzhwnqrxjz | Dashboard | Crítica | Alta | 2026-03-19 | JS-rendered, no se puede leer sin login. Project ID confirmado: ghbdarbyompzhwnqrxjz | Backend activo, schema desconocido |
| Google Doc: Plan de Negocio | https://docs.google.com/document/d/1cNtBahZ-ujKCKx1kIOclTWaE7E7AKZwTZPqhUbrd9VE | Documento | Crítica | Alta | 2026-03-19 | OG: "4 capas + 6 micro-productos"; requiere auth para leer | Confirmó el modelo de 6 bloques |
| Google Doc: Prompts | https://docs.google.com/document/d/1TrB7kh667uiWxXuKN571aRdQRCgQxO5zHfkog_WSGN8 | Documento | Alta | Alta | 2026-03-19 | OG: "System Prompt base + prompts por MVP"; requiere auth | Confirma strategy de IA para prompts |
| Google Doc: Precios | https://docs.google.com/document/d/1HuYM2MMFfunNahI3P_BSOypN2M-_9uHqLd7lCwDMdHs | Documento | Alta | Alta | 2026-03-19 | OG: "Psicología LATAM: precio inicial, aversión al riesgo, fatiga suscripciones"; requiere auth | Definió la estrategia de precios asumida |

## Notas sobre Restricciones
- Los tres Google Docs requieren login con cuenta Google — para futuras sesiones deben hacerse públicos (sin login)
- El Supabase Dashboard es una SPA — no se puede leer con fetch simple, requiere autenticación de API
- La Lovable App fue completamente explorada via browser subagent y screenshots capturados
