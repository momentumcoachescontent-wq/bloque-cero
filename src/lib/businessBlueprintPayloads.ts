import { BusinessBlueprint } from "@/types/businessBlueprints";

export interface BusinessBlueprintPayload {
  blueprintId: string;
  publicId: string;
  lifecycleStage: BusinessBlueprint['lifecycleStage'];
  client: {
    name: string;
    email: string;
    phone: string | null;
  };
  business: {
    name: string;
    channel: string | null;
  };
  intake: {
    score: number | null;
    recommendation: string | null;
    nextBlockRecommendation: string | null;
    payload: BusinessBlueprint['intakePayload'];
  };
  delivery: {
    status: string | null;
    progressDay: number | null;
    requestedFormats: string[];
    payload: BusinessBlueprint['expansionPayload'];
  };
  legacy: {
    sourceLeadId: string | null;
    sourceBlueprintRequestId: string | null;
  };
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface N8nCompatibilityPayload {
  clientName: string;
  clientEmail: string;
  projectId: string;
  projectType: 'radar' | 'blueprint';
  blueprintId: string;
  lifecycleStage: BusinessBlueprint['lifecycleStage'];
  intakeAnalysisUrl: string | null;
  blueprintPdf: string | null;
  blueprintPitch: string | null;
  blueprintInfographic: string | null;
  businessBlueprint: BusinessBlueprintPayload;
}

export const toBusinessBlueprintPayload = (
  blueprint: BusinessBlueprint
): BusinessBlueprintPayload => ({
  blueprintId: blueprint.id,
  publicId: blueprint.publicId,
  lifecycleStage: blueprint.lifecycleStage,
  client: {
    name: blueprint.clientName,
    email: blueprint.clientEmail,
    phone: blueprint.clientPhone,
  },
  business: {
    name: blueprint.businessName,
    channel: blueprint.channel,
  },
  intake: {
    score: blueprint.intakeScore,
    recommendation: blueprint.intakeRecommendation,
    nextBlockRecommendation: blueprint.nextBlockRecommendation,
    payload: blueprint.intakePayload,
  },
  delivery: {
    status: blueprint.deliveryStatus,
    progressDay: blueprint.deliveryProgressDay,
    requestedFormats: blueprint.requestedFormats,
    payload: blueprint.expansionPayload,
  },
  legacy: {
    sourceLeadId: blueprint.sourceLeadId,
    sourceBlueprintRequestId: blueprint.sourceBlueprintRequestId,
  },
  timestamps: {
    createdAt: blueprint.createdAt,
    updatedAt: blueprint.updatedAt,
  },
});

export const toN8nCompatibilityPayload = (
  blueprint: BusinessBlueprint,
  projectType: 'radar' | 'blueprint'
): N8nCompatibilityPayload => ({
  clientName: blueprint.clientName,
  clientEmail: blueprint.clientEmail,
  projectId: blueprint.id,
  projectType,
  blueprintId: blueprint.id,
  lifecycleStage: blueprint.lifecycleStage,
  intakeAnalysisUrl: projectType === 'radar' ? blueprint.lead?.analysis_file_url || null : null,
  blueprintPdf: projectType === 'blueprint' ? blueprint.blueprintRequest?.pdf_url || null : null,
  blueprintPitch: projectType === 'blueprint' ? blueprint.blueprintRequest?.presentation_url || null : null,
  blueprintInfographic: projectType === 'blueprint' ? blueprint.blueprintRequest?.infographic_url || null : null,
  businessBlueprint: toBusinessBlueprintPayload(blueprint),
});
