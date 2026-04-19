# Análisis de Skills y Herramientas — Bloque Cero

Este documento presenta el diagnóstico actual de las herramientas locales del proyecto y las habilidades agénticas (skills) configuradas, junto con recomendaciones para la Fase 5 (Automatización y Reportes).

## 1. Herramientas Locales Disponibles (Stack Core)
Según el análisis del entorno y `package.json`, el arsenal técnico local es sólido y moderno:

### Frontend & UI
- **React 18 + Vite + TypeScript:** Framework rápido y fuertemente tipado.
- **Shadcn UI (sobre Radix) + Tailwind CSS:** Sistema de diseño robusto para la estética "Beyond Fear".
- **Framer Motion / Tailwindcss-Animate:** Para animaciones orgánicas y de transición.
- **Lucide React:** Iconografía vectorial uniforme.

### Estado & Datos
- **TanStack React Query:** Gestión de estado servidor/cliente.
- **Supabase-js:** Cliente oficial para interactuar con la base de datos y autenticación de Supabase.
- **React Hook Form + Zod:** Manejo estricto de validación de formularios (usado en el Intake/Radar).

### Calidad & Testing
- **Vitest & Playwright:** Herramientas configuradas para pruebas unitarias y pruebas End-to-End (E2E).
- **ESLint:** Linter para mantener la limpieza del código.

### Infraestructura (Detectada por contexto y archivos)
- **Supabase (Base de datos, Auth, Storage, Edge Functions vía `n8n-bridge`).**
- **n8n (Self-hosted) + n8n-mcp:** Orquestador para lógica de negocio asíncrona.
- **Bun:** Gestor de paquetes ultrarrápido (en base al archivo `bun.lockb`).

## 2. Análisis de Skills Agénticos Locales (en `.agents/skills/`)
Actualmente contamos con 6 skills hiper-especializados en la arquitectura del proyecto:

1. **`bloque-cero-agentic-methodology`**: Garantiza el desarrollo planificado (Spec-First).
2. **`bloque-cero-aprendizajes`**: Captura patrones de supervivencia (ej. resiliencia con JSONB).
3. **`bloque-cero-domain-logic`**: Controla la transición de Radar hacia `business_blueprints`.
4. **`bloque-cero-growth-marketing`**: Mantiene el copywriting puro "Más allá del Miedo".
5. **`bloque-cero-n8n-orchestrator`**: Define las reglas para interactuar con n8n.
6. **`bloque-cero-ui-standards`**: Vigila la coherencia visual (Dark Mode, Glassmorphism).

**Diagnóstico:** Los skills actuales son excelentes para proteger el modelo de negocio y el frontend, pero tienen una **brecha técnica operativa** de cara a la generación de archivos y validación E2E.

## 3. Catálogo Global (vía `antigravity-awesome-skills`)

Dado que se ha implementado el suite completo de **Antigravity Awesome Skills**, el entorno agéntico cuenta ahora con cientos de capacidades de nivel mundial. Tras validar la biblioteca completa contra las necesidades arquitectónicas y de producto (Fase 5 y Verticales), he identificado las **adiciones estratégicas más valiosas que debemos activar**:

### A. Para la Generación de "Beyond Fear" (Copy & Experiencia)
Para que los Blueprints no parezcan simples reportes automatizados, sino consultoría de alto nivel:
*   **`copywriting-psychologist` & `ux-persuasion-engineer`:** Vitales para inyectar aversión a la pérdida y autoridad en los entregables.
*   **`emotional-arc-designer` & `trust-calibrator`:** Para diseñar el flujo de "paso a paso" (Intake -> Delivery) reduciendo la ansiedad de espera.
*   **`design-spells` & `high-end-visual-design`:** Para refinar las interfaces del Dashboard con microinteracciones que eleven la percepción de valor de la plataforma.

### B. Para la Orquestación y Generación de Reportes (Fase 5)
Para dominar el backend asíncrono y la compilación de NFTs documentales:
*   **`n8n-workflow-patterns` & `n8n-mcp-tools-expert`:** Críticos. Resolverán cómo el orquestador se comunica con Supabase Storage para inyectar los buffers de PDF.
*   **`n8n-validation-expert`:** Para auditar por qué un webhook o nodo de RAG falla silenciosamente.

### C. Para la Gobernanza Técnica (Frontend & DB)
Para estructurar el código antes del escalamiento masivo:
*   **`typescript-expert` & `react-patterns` & `shadcn`:** Elevan la estrictez del código, limpiando deuda técnica en los hooks de estado.
*   **`database-design` & `database-migrations-sql-migrations`:** Se invocarán exclusivamente cuando decidamos hacer la migración física ("fuerte") a la tabla `business_blueprints`.
*   **`playwright-skill`:** Para configurar E2E Testing sobre el embudo de conversión y asegurar que nadie rompa el Intake.

### B. Skills Locales a Crear (Para el proyecto Bloque Cero)
Sugiero crear estos archivos en `.agents/skills/` para darle contexto persistente a futuras instancias:

1.  **`bloque-cero-document-fulfillment` (NUEVO SKILL)**
    *   **Objetivo:** Normar la generación gráfica de los archivos PDF, Pitch Decks o reportes de consultoría.
    *   **Desafío:** ¿Se generarán vía HTML-to-PDF en Supabase Edge, a través de n8n con APIs de terceros (ej. APITemplate, PDFMonkey), o directamente con código nativo en Node dentro de n8n? Este skill definiría esa decisión arquitectónica estandarizada.
2.  **`bloque-cero-security-bridge` (ACTUALIZAR / NUEVO)**
    *   **Objetivo:** Consolidar formalmente las reglas Zero-Trust Frontend, documentando explícitamente cómo debe interactuar el JWT de Supabase con `n8n-bridge` de manera unificada.

## 4. Conclusión y Siguientes Pasos
El arsenal de herramientas de Bloque Cero es moderno y capaz. Sin embargo, para no estancarnos en la **Fase 5**, debemos decidir la arquitectura exacta de **"Cómo convertir datos de n8n en un PDF premium"**.

**¿Procedemos a crear el skill `bloque-cero-document-fulfillment` para fijar la arquitectura de generación de PDF?**
