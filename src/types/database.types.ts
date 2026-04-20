// src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          stripe_customer_id: string | null
          subscription_status: string | null
          role: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'> & { created_at?: string }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      leads: {
        Row: {
          id: string
          name: string | null
          email: string | null
          whatsapp: string | null
          business_name: string | null
          status: string | null
          score: number | null
          diagnostic_answers: {
            n8n_payload?: {
              country?: string
              business_profile?: {
                type?: string
                audience?: string
                channel?: string
                ticket?: string
                etapa?: string
                tiempo?: string
                logistics_dependency?: string
                payments_dependency?: string
                dolores?: string[]
                business_idea?: string
              }
            }
            verdict?: string
            recommended_block?: string
            analyst_conclusion?: string
            name?: string
            email?: string
            business_name?: string
            big6?: Array<{
              name: string
              score: number
              signal: 'Alto' | 'Medio' | 'Bajo'
              rationale: string
            }>
          } | null
          is_analysis_generated: boolean
          is_analysis_sent: boolean
          analysis_file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'created_at' | 'updated_at'> & { created_at?: string, updated_at?: string }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      blueprint_requests: {
        Row: {
          id: string
          user_id: string | null
          lead_id: string | null
          format_pdf: boolean
          format_presentation: boolean
          format_infographic: boolean
          pdf_url: string | null
          presentation_url: string | null
          infographic_url: string | null
          progress_day: number
          status: 'pending' | 'in_progress' | 'completed' | string
          created_at: string
          updated_at: string
          diagnostic_answers: Database['public']['Tables']['leads']['Row']['diagnostic_answers'] | null
        }
        Insert: Omit<Database['public']['Tables']['blueprint_requests']['Row'], 'created_at' | 'updated_at'> & { created_at?: string, updated_at?: string }
        Update: Partial<Database['public']['Tables']['blueprint_requests']['Insert']>
      }
      business_blueprints: {
        Row: {
          id: string
          public_id: string | null
          source_lead_id: string | null
          assigned_user_id: string | null
          lifecycle_stage: string
          delivery_progress: number
          intake_payload: Json | null
          metadata: Json | null
          version: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['business_blueprints']['Row'], 'created_at' | 'updated_at'> & { created_at?: string, updated_at?: string }
        Update: Partial<Database['public']['Tables']['business_blueprints']['Insert']>
      }
      system_logs: {
        Row: {
          id: string
          service_name: string
          log_level: string
          message: string
          latency_ms: number | null
          lead_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['system_logs']['Row'], 'created_at' | 'id'> & { created_at?: string, id?: string }
        Update: Partial<Database['public']['Tables']['system_logs']['Insert']>
      }
    }
    Views: {
      vw_orchestration_metrics: {
        Row: {
          total_intakes: number
          total_delivered: number
          delivery_success_rate: number
          avg_ttv_minutes: number
          total_invocations: number
          webhook_sla_percentage: number
          avg_latency_ms: number
        }
      }
    }
  }
}

// Helper types for easier imports
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type BlueprintRequest = Database['public']['Tables']['blueprint_requests']['Row']
export type BusinessBlueprint = Database['public']['Tables']['business_blueprints']['Row']
export type SystemLog = Database['public']['Tables']['system_logs']['Row']
