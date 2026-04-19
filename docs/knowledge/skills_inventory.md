# Skills Inventory — Bloque Cero

Este documento cataloga las capacidades especializadas integradas en el entorno agéntico de Bloque Cero. Estos skills deben invocarse ante cualquier intervención técnica o creativa.

## Catálogo de Habilidades (.agents/skills/)

### 1. [Agentic Methodology](file:///.agents/skills/bloque-cero-agentic-methodology/SKILL.md)
- **Propósito:** Mantener la disciplina de desarrollo *Spec-First*.
- **Cuándo usar:** Antes de cualquier refactorización o nueva integración masiva.
- **Mandamiento:** "Nunca inicies sin documentar el diseño en `docs/knowledge/`".

### 2. [Aprendizajes](file:///.agents/skills/bloque-cero-aprendizajes/SKILL.md)
- **Propósito:** Evitar la repetición de errores y capitalizar patrones de resiliencia.
- **Cuándo usar:** Al diseñar interfaces de "espera psicológica" o esquemas de datos heterogéneos.
- **Clave:** Uso estratégico de campos JSONB para mitigación de esquemas rígidos.

### 3. [Domain Logic](file:///.agents/skills/bloque-cero-domain-logic/SKILL.md)
- **Propósito:** Gobernar la transición hacia el modelo canónico `business_blueprints`.
- **Cuándo usar:** Al modificar hooks, pantallas de admin o contratos con n8n.
- **Clave:** Priorizar el read model canónico sobre las tablas base.

### 4. [Growth Marketing](file:///.agents/skills/bloque-cero-growth-marketing/SKILL.md)
- **Propósito:** Asegurar que el copy y el CRO mantengan el estatus premium.
- **Cuándo usar:** Al crear landings para nuevas verticales o mensajes transaccionales.
- **Tono:** "Beyond Fear" (Provocativo, Sanador, Estratégico).

### 5. [n8n Orchestrator](file:///.agents/skills/bloque-cero-n8n-orchestrator/SKILL.md)
- **Propósito:** El cerebro asíncrono del fulfillment.
- **Cuándo usar:** Al expandir flujos de scoring, generación de PDF o notificaciones multicanal.
- **Herramienta:** Uso de `n8n-mcp` para auditoría de workflows.

### 6. [UI Standards](file:///.agents/skills/bloque-cero-ui-standards/SKILL.md)
- **Propósito:** Mantener la estética visual de "Cabina Táctica".
- **Cuándo usar:** En cada nuevo componente de UI o pantalla de Dashboard.
- **Clave:** Glassmorphism, Tailwind 100%, Lucide Icons y animaciones orgánicas.

### 7. [Document Fulfillment](file:///.agents/skills/bloque-cero-document-fulfillment/SKILL.md)
- **Propósito:** Dictaminar la arquitectura Backend/n8n para generación de PDF ("Beyond Fear").
- **Cuándo usar:** Al orquestar la generación de entregables digitales Premium para el Blueprint.
- **Clave:** Headless rendering en n8n y guardado directo en Supabase Storage (Zero Frontend Rendering).

---

## Cómo Invocar Skills
Para asegurar la coherencia del sistema, el agente debe declarar el uso de estos skills al inicio de cada tarea compleja:
*"Siguiendo el skill de **Methodology** y los **UI Standards**, procederé con..."*
