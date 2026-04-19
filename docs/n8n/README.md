# Arquitectura de Orquestación n8n (Bloque Cero)

Esta documentación define los contratos de datos y la lógica esperada para los workflows de n8n que alimentan la plataforma Bloque Cero a través del `n8n-bridge` (Supabase Edge Function).

## Webhooks Requeridos

El `n8n-bridge` redirige peticiones a tres URLs principales que deben estar configuradas como secretos en Supabase:

### 1. Webhook de Scoring (`N8N_SCORE_URL`)
**Disparado por:** `DiagnosticForm.tsx` (después de guardar un Lead).
**Propósito:** Procesamiento asíncrono del primer contacto.
**Payload Esperado:**
```json
{
  "name": "Nombre Cliente",
  "email": "cliente@correo.com",
  "whatsapp": "5212345678",
  "diagnostic_answers": {
    "business_name": "...",
    "idea_description": "...",
    "n8n_payload": { ... },
    "big6": [ ... ],
    "verdict": "..."
  },
  "score": 85,
  "id": "uuid-lead",
  "created_at": "timestamp"
}
```
**Lógica Sugerida:**
1. Enviar correo de bienvenida con el score inicial.
2. (Opcional) Notificar vía Slack/WhatsApp al equipo de ventas.

---

### 2. Webhook de Despacho (`N8N_DISPATCH_URL`)
**Disparado por:** `FulfillmentAdmin.tsx` (manualmente por un admin).
**Propósito:** Notificar al cliente que sus entregables (PDF, Pitch, etc.) ya están listos.
**Payload Esperado:**
```json
{
  "clientName": "...",
  "clientEmail": "...",
  "projectId": "...",
  "projectType": "radar | blueprint",
  "blueprintId": "...",
  "lifecycleStage": "delivered",
  "intakeAnalysisUrl": "...",
  "blueprintPdf": "...",
  "blueprintPitch": "...",
  "blueprintInfographic": "...",
  "businessBlueprint": { ... }
}
```
**Lógica Sugerida:**
1. Filtrar por `projectType`.
2. Enviar correo formal con los enlaces directos a los archivos almacenados en Supabase Storage.
3. Actualizar el estado en Hubspot/CRM externo si aplica.

---

### 3. Webhook de Blueprint (`N8N_BLUEPRINT_URL`)
**Disparado por:** `BlueprintPage.tsx` (tras completar el Wizard técnico).
**Propósito:** Generación profunda del Blueprint de Negocio (Bloque 01 extendido).
**Payload Esperado:**
```json
{
  "type": "nuevo_blueprint_request",
  "request_id": "...",
  "user_id": "...",
  "lead_id": "...",
  "intake_answers": { ... },
  "diagnostic_answers": { ... },
  "created_at": "...",
  "format_configuration": {
    "pdf": true,
    "presentation": false,
    "infographic": true
  }
}
```
**Lógica Sugerida:**
1. **Análisis IA:** Procesar las respuestas del Deep Diagnostic de 11 preguntas.
2. **Generación de Archivos:** Crear PDF, Presentación y/o Infografía usando servicios como BannerBear, Documint o Google Slides API.
3. **Writeback:** Subir archivos a Supabase Storage y actualizar la tabla `business_blueprints` con las URLs definitivas.

## Seguridad
Todos los webhooks deben configurar autenticación por `Header` (Token) si es posible, aunque el `n8n-bridge` ya actúa como una capa de protección al no exponer estas URLs al navegador del cliente final.
