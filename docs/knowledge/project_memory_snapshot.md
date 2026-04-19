# Project Memory Snapshot — Bloque Cero (Abril 2026)

## La Esencia del Sistema
Bloque Cero no es solo un CRM o una landing page; es una **maquinaria de transformación de caos en estructura**. Su propósito es reducir la carga psicológica del emprendedor mediante la entrega de **Sistemas Mínimos Operables (SMO)**.

## Decisiones Arquitectónicas Inamovibles (Beyond Fear)
1. **Zero-Trust Frontend:** Ninguna URL de infraestructura sensible (n8n, Supabase Secret Keys) toca el cliente. Todo se orquesta vía `n8n-bridge`.
2. **Estética de Cabina Táctica:** El diseño visual debe proyectar autoridad y control (Glassmorphism, Dark Mode, Lucide Icons).
3. **Resiliencia Geográfica de Datos:** Se favorece la estabilidad operativa sobre el purismo del esquema. Los adapters (`src/lib/`) permiten que el sistema "piense" en el futuro (Modelo Canónico) mientras vive en el presente (Tablas Heredadas).
4. **Fulfillment Asíncrono:** La entrega de valor (Blueprints) tiene un ciclo de vida de hasta 7 días, gestionado mediante una cola de cumplimiento administrada.

## Hitos Técnicos Alcanzados
- **Consolidación de Dominio:** Transición semántica de Radar/Legacy hacia **Blueprint de Negocio**.
- **Infraestructura de Storage:** Buckets seguros para la entrega automática de activos digitales.
- **Orquestación n8n:** Workflows de scoring y generación de Blueprints vinculados al ciclo de vida del usuario.

## El Futuro Inmediato (Bloque F)
El sistema está posicionado para la **Automatización Avanzada**. El próximo gran salto es la generación autónoma de reportes estratégicos que se depositen directamente en el dashboard del cliente.
