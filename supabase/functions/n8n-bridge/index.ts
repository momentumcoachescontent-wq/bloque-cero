import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
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

    const { action, payload } = await req.json()

    // Mapeo de webhooks (Priorizar variables de entorno de Supabase)
    let webhookUrl = ''
    switch (action) {
      case 'score':
        webhookUrl = Deno.env.get('N8N_SCORE_URL') || 'https://primary-production-46e3.up.railway.app/webhook/bloque-cero-score'
        break
      case 'dispatch':
        webhookUrl = Deno.env.get('N8N_DISPATCH_URL') || 'https://n8n-n8n.z3tydl.easypanel.host/webhook/bloque-cero-dispatch'
        break
      case 'blueprint':
        webhookUrl = Deno.env.get('N8N_BLUEPRINT_URL') || 'https://n8n-n8n.z3tydl.easypanel.host/webhook/bloque-cero-blueprint'
        break
      case 'ping':
        return new Response(JSON.stringify({ message: 'pong', user_id: user.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      default:
        throw new Error('Acción no válida o no soportada')
    }

    console.log(`Proxying ${action} request for user ${user.id} to n8n...`)

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...payload, 
        _internal: {
          triggered_by: user.id,
          source: 'supabase-edge-function',
          timestamp: new Date().toISOString()
        }
      }),
    })

    const responseText = await n8nResponse.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { message: responseText }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: n8nResponse.status,
    })

  } catch (error: any) {
    console.error('Error in n8n-bridge:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message === 'Unauthorized' ? 401 : 400,
    })
  }
})
