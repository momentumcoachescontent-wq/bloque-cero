# Risks & Assumptions — Bloque Cero

## Riesgos

| ID   | Riesgo | Probabilidad | Impacto | Mitigación |
|------|--------|-------------|---------|-----------|
| R-01 | **Lovable lock-in**: Si el código se sigue editando solo en Lovable sin exportar a GitHub, puede generar conflictos con cambios manuales | Media | Alto | Establecer flujo: Lovable exporta → feature branch → PR → main |
| R-02 | **Supabase free tier limits**: El plan gratuito tiene límites de DB (500MB), Auth (50K MAU) y Edge Functions (500K invocaciones/mes) | Baja (inicial) | Medio | Monitorear desde el principio; migrar a Pro ($25/mo) cuando sea necesario |
| R-03 | **Sin variables de entorno en Lovable**: Sin `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Lovable, el frontend no conecta a Supabase | Alta | Alto | Configurar env vars en Lovable → Settings antes de iniciar Fase 1. El CI/CD GitHub→Lovable ya es nativo. |
| R-04 | **Google Docs inaccesibles**: Documentos estratégicos clave no son legibles por agentes IA porque requieren login | Alta | Medio | Cambiar permisos a "Cualquier persona → Lector" o migrar a docs en el repo |
| R-05 | **n8n requiere monitoreo**: La instancia n8n en EasyPanel/Hostinger puede caer silenciosamente | Media | Medio | Usar Render.com para health-checks o configurar alertas en EasyPanel. Instancia ya activa: https://n8n-n8n.z3tydl.easypanel.host/ |
| R-06 | **Ausencia de pagos**: Sin pasarela de pagos no hay conversión de leads | Alta | Crítico | Integrar Stripe o Mercado Pago como prioridad Semana 2-3 |
| R-07 | **Competencia de Gig Platforms**: Fiverr/Upwork ofrecen servicios similares más baratos | Media | Medio | Diferenciarse con velocidad, sistema (no freelancer), y escalera de valor |
| R-08 | **Equipo de 1**: Si el único operador (el fundador) no puede entregar, el negocio para | Media | Alto | Documentar todos los procesos; crear SOPs en n8n; contratar primer VA |

## Supuestos

| ID   | Supuesto | Riesgo si es falso |
|------|----------|-------------------|
| A-01 | El fundador tiene acceso completo a Supabase, Lovable, Render.com y GitHub | Bloqueo operativo |
| A-02 | Se puede invertir ~$50-100/mes en infraestructura desde el mes 1 | Necesidad de ajustar stack |
| A-03 | La audiencia objetivo (LATAM) usa WhatsApp como canal principal | Revisar canal o agregar otros |
| A-04 | El "Diagnóstico" como lead magnet gratuito es suficiente para generar leads | Necesita validación con tráfico real |
| A-05 | El stack Vite+React+Shadcn puede mantenerse sin cambiar a Next.js | Si se necesita SSR para SEO, migración costosa |
| A-06 | Los Google Docs estratégicos (precios, prompts, plan) están alineados con lo implementado | Necesita revisión manual |
