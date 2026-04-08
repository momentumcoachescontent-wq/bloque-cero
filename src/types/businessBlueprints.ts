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
  sourceBlueprintRequestId: string | null;
  lifecycleStage: BusinessBlueprintStage;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  businessName: string;
  channel: string | null;
  intakeScore: number | null;
  intakeRecommendation: string | null;
  nextBlockRecommendation: string | null;
  intakePayload: Lead['diagnostic_answers'] | null;
  expansionPayload: BlueprintRequest['diagnostic_answers'] | null;
  requestedFormats: string[];
  deliveryStatus: string | null;
  deliveryProgressDay: number | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  ownerId: string | null;
  lead: Lead | null;
  blueprintRequest: BlueprintRequest | null;
}

const getRequestedFormats = (req: BlueprintRequest | null): string[] => {
  if (!req) return [];
  const formats: string[] = [];
  if (req.format_pdf) formats.push('pdf');
  if (req.format_presentation) formats.push('presentation');
  if (req.format_infographic) formats.push('infographic');
  return formats;
};

const inferLifecycleStage = (lead: Lead | null, req: BlueprintRequest | null): BusinessBlueprintStage => {
  if (req) {
    if (req.status === 'completed' || (req.progress_day || 0) >= 7) return 'delivered';
    return 'queued_for_delivery';
  }

  if (lead?.score != null) return 'scored';
  return 'captured';
};

const getBusinessName = (lead: Lead | null, req: BlueprintRequest | null): string => {
  return (
    req?.diagnostic_answers?.business_name ||
    lead?.business_name ||
    lead?.diagnostic_answers?.business_name ||
    lead?.diagnostic_answers?.n8n_payload?.business_profile?.business_idea ||
    'Blueprint de Negocio'
  );
};

const getClientName = (lead: Lead | null, req: BlueprintRequest | null): string => {
  return req?.diagnostic_answers?.name || lead?.name || 'Cliente Blueprint';
};

const getClientEmail = (lead: Lead | null, req: BlueprintRequest | null): string => {
  return req?.diagnostic_answers?.email || lead?.email || 'N/A';
};

const getRecommendation = (lead: Lead | null): string | null => {
  return lead?.diagnostic_answers?.recommended_block || lead?.diagnostic_answers?.verdict || null;
};

export const mapToBusinessBlueprint = (
  lead: Lead | null,
  req: BlueprintRequest | null
): BusinessBlueprint => {
  const baseId = req?.id || lead?.id || crypto.randomUUID();
  const createdAt = req?.created_at || lead?.created_at || new Date().toISOString();
  const updatedAt = req?.updated_at || lead?.updated_at || createdAt;

  return {
    id: baseId,
    publicId: `bp-${baseId.slice(0, 8)}`,
    sourceLeadId: lead?.id || req?.lead_id || null,
    sourceBlueprintRequestId: req?.id || null,
    lifecycleStage: inferLifecycleStage(lead, req),
    clientName: getClientName(lead, req),
    clientEmail: getClientEmail(lead, req),
    clientPhone: lead?.whatsapp || null,
    businessName: getBusinessName(lead, req),
    channel: lead?.diagnostic_answers?.n8n_payload?.business_profile?.channel || null,
    intakeScore: lead?.score || null,
    intakeRecommendation: getRecommendation(lead),
    nextBlockRecommendation: lead?.diagnostic_answers?.recommended_block || null,
    intakePayload: lead?.diagnostic_answers || null,
    expansionPayload: req?.diagnostic_answers || null,
    requestedFormats: getRequestedFormats(req),
    deliveryStatus: req?.status || null,
    deliveryProgressDay: req?.progress_day || null,
    createdAt,
    updatedAt,
    isActive: (req?.status || '').toLowerCase() !== 'archived',
    ownerId: req?.user_id || null,
    lead,
    blueprintRequest: req,
  };
};

export const mapCollectionsToBusinessBlueprints = (
  leads: Lead[],
  blueprintRequests: BlueprintRequest[]
): BusinessBlueprint[] => {
  const leadMap = new Map(leads.map(lead => [lead.id, lead]));
  const usedLeadIds = new Set<string>();

  const fromRequests = blueprintRequests.map(req => {
    const lead = req.lead_id ? leadMap.get(req.lead_id) || null : null;
    if (lead?.id) usedLeadIds.add(lead.id);
    return mapToBusinessBlueprint(lead, req);
  });

  const intakeOnly = leads
    .filter(lead => !usedLeadIds.has(lead.id))
    .map(lead => mapToBusinessBlueprint(lead, null));

  return [...fromRequests, ...intakeOnly].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
