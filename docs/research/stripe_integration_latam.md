# Estrategia de Monetización: Stripe LATAM (Bloque F)

Este documento detalla la arquitectura para implementar cobros únicos y recurrentes en Bloque Cero, optimizados para México, Colombia y el resto de Latinoamérica.

## 1. Arquitectura de Pago: Stripe Checkout

Se recomienda el uso de **Stripe Checkout** (Pre-built) por encima de custom elements debido a:
- **Cumplimiento Automático:** Maneja 3D Secure y regulaciones locales sin código extra.
- **Métodos Locales:** Activa automáticamente **OXXO** (MX) y **PSE** (CO) según el país del cliente.
- **Responsive:** Experiencia web y móvil premium nativa.

### Flujo de Usuario
1. El usuario hace clic en "Desbloquear Blueprint Premium".
2. El Frontend llama a una `Edge Function` de Supabase o API de Next.js.
3. Se crea una `Checkout Session` y se devuelve una URL.
4. Redirección a Stripe -> Pago -> Redirección de éxito a Bloque Cero.

## 2. Integración con Supabase (Fulfillment Reallity)

**REGLA DE ORO:** Nunca otorgar acceso desde el frontend (success URL). El acceso se otorga **únicamente** mediante Webhooks.

### Evento: `checkout.session.completed`
- **Webhook Handler:** Una función en Supabase que valide la firma de Stripe.
- **Lógica de Negocio:**
    - Buscar el `business_blueprint` usando el `client_reference_id` enviado en la sesión.
    - Actualizar `is_premium = true`.
    - Disparar notificación de "Pago recibido" vía WhatsApp.

### Modelo de Datos (Extensión de `business_blueprints`)
Se deben añadir los siguientes campos:
- `stripe_customer_id`: Identificador de cliente en Stripe.
- `stripe_session_id`: Para trazabilidad de la transacción.
- `payment_status`: `pending`, `paid`, `failed`.
- `tier`: `free` vs `premium`.

## 3. Métodos de Pago Específicos (LATAM)

| País | Método Clave | Descripción |
| :--- | :--- | :--- |
| **México** | OXXO | Pago en efectivo en tiendas de conveniencia. Requiere manejo de pagos asíncronos (el webhook llega 24h después). |
| **Colombia** | PSE | Transferencia bancaria directa. Instantáneo. |
| **Chile** | Webpay | (Vía pasarela Stripe) Tarjetas de crédito/débito locales. |

## 4. Plan de Implementación Técnica

1. **Configuración Dashboard:** Activar métodos de pago locales en el panel de Stripe.
2. **Endpoint de Sesión:** Crear `/api/create-checkout-session`.
3. **Webhook Listener:** Implementar servidor de webhooks con manejo de idempotencia (evitar duplicados).
4. **UI Update:** Añadir el State de "Premium Locked" en la vista del Blueprint.

## 5. Próximos Pasos Sugeridos

- [ ] Definición de precios en MXN (Ej. $499 MXN) y COP (Ej. $99,000 COP).
- [ ] Creación de productos en el Dashboard de Stripe (Test Mode).
- [ ] Configuración del Webhook Secret en las variables de entorno de Supabase.
