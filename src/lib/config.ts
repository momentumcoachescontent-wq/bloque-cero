// ============================================================
// Bloque Cero — Configuración centralizada v3
// Última actualización: 2026-03-26 — Fases 0-3 completadas
// NUNCA uses import.meta.env — todo va aquí.
// ============================================================

const SUPABASE_URL = 'https://ghbdarbyompzhwnqrxjz.supabase.co';

export const config = {
  supabase: {
    url: SUPABASE_URL,
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYmRhcmJ5b21wemh3bnFyeGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTcxMjAsImV4cCI6MjA4OTUzMzEyMH0.ioR_knb3DEDHXsLZcwY574dJr2HwT-0AkvFTnXIC8iU',
  },
  app: {
    name: 'Bloque Cero',
    version: '1.0.0',
    environment: 'production' as const,
  },
  edgeFunctions: {
    notifyBlueprint:  `${SUPABASE_URL}/functions/v1/notify-blueprint`,
    notifyOnboarding: `${SUPABASE_URL}/functions/v1/notify-onboarding`,
    adminDashboard:   `${SUPABASE_URL}/functions/v1/admin-dashboard`,
    clientPortal:     `${SUPABASE_URL}/functions/v1/client-portal`,
    appConfig:        `${SUPABASE_URL}/functions/v1/app-config`,
  },
} as const;

export type Config = typeof config;
