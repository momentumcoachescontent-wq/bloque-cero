// ============================================================
// Bloque Cero — Configuración centralizada
// Las credenciales públicas están aquí por diseño (son públicas).
// NUNCA pongas service_role key aquí.
// ============================================================

export const config = {
  supabase: {
    url: 'https://ghbdarbyompzhwnqrxjz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYmRhcmJ5b21wemh3bnFyeGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTcxMjAsImV4cCI6MjA4OTUzMzEyMH0.ioR_knb3DEDHXsLZcwY574dJr2HwT-0AkvFTnXIC8iU',
  },
  app: {
    name: 'Bloque Cero',
    version: '1.0.0',
    environment: 'production' as const,
  },
  // La URL del webhook de n8n NO va aquí — el frontend
  // llama a la Edge Function /functions/v1/notify-blueprint
  // que internamente conoce la URL de n8n.
  edgeFunctions: {
    notifyBlueprint: 'https://ghbdarbyompzhwnqrxjz.supabase.co/functions/v1/notify-blueprint',
    appConfig: 'https://ghbdarbyompzhwnqrxjz.supabase.co/functions/v1/app-config',
  },
} as const;

export type Config = typeof config;
