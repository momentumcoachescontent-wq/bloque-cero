import { Lead, BlueprintRequest } from "@/types/database.types";

export type BusinessBlueprintStage =
  | 'captured'
  | 'scored'
  | 'expanded'
  | 'queued_for_delivery'
  | 'delivered'
  | 'converted_to_next_block'
  | 'archived';

export interface BusinessBlueprint {
  id: string;
  publicId: string;
  sourceLeadId: string | null;
  sourceBlueprintId: string | null; // Renamed from sourceBlueprintRequestId to match DB
  userId: string | null;
  lifecycleStage: BusinessBlueprintStage;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  businessName: string;
  intakeScore: number | null;
  intakeRecommendation: string | null;
  intakePayload: any | null;
  deliveryProgress: number | null;
  requestedFormats: string[];
  pdfUrl: string | null;
  presentationUrl: string | null;
  infographicUrl: string | null;
  cacEstimated: number;
  ltvEstimated: number;
  slaRiskScore: number;
  adminNotes: string | null;
  isPremium: boolean;
  stripeCustomerId: string | null;
  stripeSessionId: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  metadata: any;
}

/**
 * Mapea una fila de la base de datos (snake_case) al objeto de la aplicación (camelCase)
 */
export const mapRowToBusinessBlueprint = (row: any): BusinessBlueprint => {
  return {
    id: row.id,
    publicId: row.public_id,
    sourceLeadId: row.source_lead_id,
    sourceBlueprintId: row.source_blueprint_id,
    userId: row.user_id,
    lifecycleStage: (row.lifecycle_stage || 'captured') as BusinessBlueprintStage,
    clientName: row.client_name || 'Cliente Blueprint',
    clientEmail: row.client_email || 'N/A',
    clientPhone: row.client_phone,
    businessName: row.business_name || 'Blueprint de Negocio',
    intakeScore: row.intake_score,
    intakeRecommendation: row.intake_recommendation,
    intakePayload: row.intake_payload,
    deliveryProgress: row.delivery_progress,
    requestedFormats: row.requested_formats || [],
    pdfUrl: row.pdf_url,
    presentationUrl: row.presentation_url,
    infographicUrl: row.infographic_url,
    cacEstimated: Number(row.cac_estimated || 0),
    ltvEstimated: Number(row.ltv_estimated || 0),
    slaRiskScore: Number(row.sla_risk_score || 0),
    adminNotes: row.admin_notes,
    isPremium: row.is_premium || false,
    stripeCustomerId: row.stripe_customer_id,
    stripeSessionId: row.stripe_session_id,
    paymentStatus: row.payment_status || 'pending',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: row.metadata || {},
  };
};

// Mantener compatibilidad temporal con el mapeador viejo por si acaso hay otros consumidores
export const mapCollectionsToBusinessBlueprints = (
  leads: Lead[],
  blueprintRequests: BlueprintRequest[]
): BusinessBlueprint[] => {
  // Nota: Este mapeador ahora es "deprecado" en favor de la tabla física,
  // pero lo mantenemos devolviendo el formato nuevo si se requiere.
  return []; 
};
