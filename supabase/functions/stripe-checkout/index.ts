import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'npm:stripe@^14.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { blueprint_id, email, return_url } = await req.json()
    
    if (!blueprint_id) {
        throw new Error('Missing blueprint_id')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Validar usuario
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Inicializar Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
        throw new Error('STRIPE_SECRET_KEY no configurado en entorno')
    }
    const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16', // Versión reciente estable
        httpClient: Stripe.createFetchHttpClient(),
    })

    // Crear la sesión
    // Nota: Estamos asumiendo precios on-the-fly para mayor flexibilidad
    const sessionUrl = return_url || req.headers.get('origin') || 'http://localhost:5173'
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email || user.email,
        client_reference_id: blueprint_id,
        line_items: [
            {
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: 'Desbloqueo Estratégico de Blueprint',
                        description: 'Acceso a roadmap de 90 días, análisis financiero y arquitectura de sistemas avanzada.',
                    },
                    unit_amount: 49900, // $499.00 MXN (Stripe requiere en centavos)
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${sessionUrl}/dashboard/blueprint?id=${blueprint_id}&success=true`,
        cancel_url: `${sessionUrl}/dashboard/blueprint?id=${blueprint_id}&canceled=true`,
        metadata: {
            blueprint_id,
            user_id: user.id
        }
    })

    // Actualizamos el blueprint para almacenar la referencia a la sesión (opcional para rastreo manual por sysadmins)
    await supabaseClient
        .from('business_blueprints')
        .update({ stripe_session_id: session.id })
        .eq('public_id', blueprint_id) // o usar 'id' si el cliente pasa id. Validar según diseño final.
        
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    const message = getErrorMessage(error)
    console.error('Error en stripe-checkout:', message)
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: message === 'Unauthorized' ? 401 : 400,
    })
  }
})
