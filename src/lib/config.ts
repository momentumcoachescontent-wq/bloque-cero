// ============================================================
// Bloque Cero — Configuración centralizada v3
// Última actualización: 2026-04-12 — Refactor de Seguridad (Fase 4 Inicio)
// Precaución: Variables sensibles deben inyectarse mediante CI/CD o .env
// ============================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const config = {
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  app: {
    name: 'Bloque Cero',
    version: '1.0.0',
    environment: 'production' as const,
  },
  contact: {
    whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || 'https://wa.me/521234567890',
    email: import.meta.env.VITE_CONTACT_EMAIL || 'hola@bloquecero.com'
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
