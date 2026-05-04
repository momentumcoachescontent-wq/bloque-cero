import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'npm:stripe@^14.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Initialize Supabase Client with Service Role Key to bypass RLS to update blueprints
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  // Stripe validation requires the raw body
  const body = await req.text()
  const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  let event;
  try {
    if (!signature || !endpointSecret) {
      throw new Error('Falta firma o webhook secret no configurado.')
    }
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: unknown) {
    const message = getErrorMessage(err)
    console.error(`Webhook signature verification failed.`, message)
    return new Response(JSON.stringify({ error: message }), { status: 400 })
  }

  try {
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const blueprintId = session.client_reference_id; // Public ID / UUID
      const customerId = session.customer as string;
      const sessionId = session.id;

      if (blueprintId) {
        console.log(`Marcando blueprint [${blueprintId}] como pagado.`)

        const { error } = await supabaseAdmin
          .from('business_blueprints')
          .update({
             is_premium: true,
             payment_status: 'paid',
             stripe_customer_id: customerId,
             stripe_session_id: sessionId
          })
          // Asumimos que mandamos el "public_id" en la redirección original, 
          // o adaptamos si mandamos un UUID interno usando 'id'.
          // Validar con UI. Intentaremos por public_id por seguridad:
          .eq('public_id', blueprintId)

        if (error) {
           console.error("Error actualizando base de datos:", error.message)
           throw error
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err: unknown) {
    const message = getErrorMessage(err)
    console.error(`Webhook handler failed.`, message)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
})
