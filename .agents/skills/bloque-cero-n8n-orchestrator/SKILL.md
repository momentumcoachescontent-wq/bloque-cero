---
name: bloque-cero-n8n-orchestrator
description: Cerebro de orquestación y automatización inteligente para Bloque Cero (Fulfillment IA).
---

# Bloque Cero: n8n Orchestrator Skill

Este skill centraliza la "inteligencia de cumplimiento" del proyecto. Define cómo la plataforma interactúa con n8n para transformar datos crudos en activos de consultoría premium.

## 1. Misión
Garantizar que cada interacción asíncrona (Scoring, Blueprint, Notificaciones) mantenga el tono provovativo y sanador de "Más allá del Miedo" y cumpla con los estándares técnicos de seguridad backend.

## 2. Contratos de Datos (Bridge)
Todas las llamadas deben pasar por la Edge Function `n8n-bridge`.

### Acciones Soportadas:
- `score`: Triaje inicial y bienvenida.
- `dispatch`: Notificación de entrega de archivos (PDF/Pitch).
- `blueprint`: Generación profunda del Bloque 01.

## 3. Lógica de Prompting (IA en n8n)
Para la generación de reportes (Fase 5), usa este perfil base:
> "Actúa como un Coach Senior en Psicología Aplicada especializado en resiliencia operativa. Tu objetivo es convertir el caos del cliente en un Blueprint estructurado. Usa un lenguaje directo, altamente profesional (estilo McKinsey/Gartner) pero con el toque transformacional de Bloque Cero."

## 4. Gestión con n8n-mcp (Recomendado)
Si el servidor `n8n-mcp` está activo, puedes usar los siguientes comandos (si el cliente los soporta):
- `list_workflows`: Para verificar que los flujos de Bloque Cero estén activos.
- `get_workflow`: Para auditar la lógica de un nodo de IA específico.
- `execute_workflow`: Para pruebas manuales de generación de reportes.

### Instalación de n8n-mcp:
1. Clonar: `https://github.com/czlonkowski/n8n-mcp`
2. Configurar `N8N_API_KEY` y `N8N_URL`.
3. Añadir a la configuración de tu cliente MCP (Claude Desktop / Cursor).

## 5. Referencia de Archivos
- Especificaciones: `docs/n8n/README.md`
- Plantillas: `docs/n8n/*.json`
