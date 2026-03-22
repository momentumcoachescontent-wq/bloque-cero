/**
 * ─── Motor de Scoring de Perfil de Negocio ─────────────────────────────────
 *
 * Arquitectura: scoring estático basado en proxies regionales calibrados con:
 *   • WDI / Banco Mundial — tamaño de mercado y capacidad de pago
 *   • CEPALSTAT           — contexto social y cobertura digital LATAM
 *   • Enterprise Surveys  — obstáculos para empresas (competencia informal, crédito)
 *   • UNCTAD / UIT        — readiness digital, e-commerce, infraestructura
 *
 * El objeto `BusinessProfile` es el payload que también se envía a n8n/IA
 * para enriquecer la recomendación en background (Fase 3).
 *
 * Fuentes de referencia usadas para calibrar las tablas:
 *   WDI: https://data.worldbank.org/indicator/NY.GDP.PCAP.CD
 *   CEPAL: https://estadisticas.cepal.org
 *   UIT D-score: https://www.itu.int/en/ITU-D/Statistics/Pages/IDI/default.aspx
 *   Enterprise Surveys (informal competition): https://www.enterprisesurveys.org
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type BusinessType =
  | "saas" | "ecommerce" | "marketplace" | "servicio_local"
  | "educacion" | "fintech" | "logistica" | "contenido";

export type Audience = "b2b" | "b2c" | "mixto";
export type TicketLevel = "bajo" | "medio" | "alto";
export type SalesChannel = "digital" | "fisica" | "hibrida";
export type Etapa = "idea" | "validando" | "operando" | "escalando";
export type TiempoDisponible = "dias" | "semanas" | "meses";

export interface BusinessProfile {
  // Contacto
  country: string;          // ISO-2: MX, CO, AR, BR, CL, PE…
  // Negocio
  business_idea: string;    // Descripción abierta de la idea
  type: BusinessType;
  audience: Audience;
  // Mercado
  ticket: TicketLevel;
  channel: SalesChannel;
  // Operación
  needs_logistics: boolean;
  needs_special_payments: boolean;
  // Contexto actual
  etapa: Etapa;
  dolores: string[];
  otro_detalle?: string | null;
  tiempo: TiempoDisponible;
}

export interface Big6Indicator {
  name: string;
  score: number; // 1 to 5
  signal: "Alto" | "Medio" | "Bajo";
  rationale: string;
}

export type FinalVerdict = "Avanzar" | "Avanzar con nicho" | "Pivotear" | "No priorizar";

export interface ScoringResult {
  viability_score: number;           // 0-100
  complexity_level: "baja" | "media" | "alta";
  digital_readiness_required: "baja" | "media" | "alta";
  regulatory_risk: "bajo" | "medio" | "alto";
  
  // Big 6 Framework
  big6: Big6Indicator[];
  verdict: FinalVerdict;
  
  recommended_block: string;
  recommended_block_num: number;
  rationale: string;
  key_risks: string[];
  quick_wins: string[];
  n8n_payload: N8nPayload;           // Payload listo para enviar a n8n/IA en Fase 3
}

export interface N8nPayload {
  country: string;
  business_profile: {
    business_idea: string;
    type: string;
    audience: string;
    channel: string;
    ticket: string;
    logistics_dependency: "ninguna" | "baja" | "media" | "alta";
    payments_dependency: "baja" | "media" | "alta";
    regulatory_sensitivity: "baja" | "media" | "alta";
    etapa: string;
    dolores: string[];
    tiempo: string;
  };
  scores: {
    viability: number;
    market_size_index: number;
    digital_readiness_index: number;
    regulatory_index: number;
    execution_index: number;
  };
}

// ─── Tablas de datos regionales (LATAM) ──────────────────────────────────────
// Fuente calibrada: WDI 2023, CEPAL 2023, UIT IDI 2023

interface CountryProfile {
  name: string;
  gdpPerCapita: number;       // USD — WDI NY.GDP.PCAP.CD
  digitalReadiness: number;   // 0-1  — UIT IDI normalizado para LATAM
  bankingPenetration: number; // 0-1  — WDI FX.OWN.TOTL.ZS / 100
  informalEconomy: number;    // 0-1  — Enterprise Surveys / CEPAL (compe. informal)
  ecommerceReadiness: number; // 0-1  — UNCTAD B2C e-commerce index normalizado
  marketSize: number;         // 0-1  — Población ajustada por PIB/poder adquisitivo
}

const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  MX: { name: "México",      gdpPerCapita: 10800, digitalReadiness: 0.64, bankingPenetration: 0.49, informalEconomy: 0.56, ecommerceReadiness: 0.62, marketSize: 0.90 },
  CO: { name: "Colombia",    gdpPerCapita: 6500,  digitalReadiness: 0.60, bankingPenetration: 0.58, informalEconomy: 0.62, ecommerceReadiness: 0.55, marketSize: 0.72 },
  AR: { name: "Argentina",   gdpPerCapita: 10200, digitalReadiness: 0.70, bankingPenetration: 0.71, informalEconomy: 0.44, ecommerceReadiness: 0.68, marketSize: 0.68 },
  BR: { name: "Brasil",      gdpPerCapita: 8900,  digitalReadiness: 0.68, bankingPenetration: 0.84, informalEconomy: 0.38, ecommerceReadiness: 0.74, marketSize: 1.00 },
  CL: { name: "Chile",       gdpPerCapita: 15800, digitalReadiness: 0.78, bankingPenetration: 0.87, informalEconomy: 0.29, ecommerceReadiness: 0.77, marketSize: 0.52 },
  PE: { name: "Perú",        gdpPerCapita: 6200,  digitalReadiness: 0.55, bankingPenetration: 0.43, informalEconomy: 0.73, ecommerceReadiness: 0.48, marketSize: 0.58 },
  EC: { name: "Ecuador",     gdpPerCapita: 5700,  digitalReadiness: 0.52, bankingPenetration: 0.51, informalEconomy: 0.65, ecommerceReadiness: 0.43, marketSize: 0.38 },
  UY: { name: "Uruguay",     gdpPerCapita: 17200, digitalReadiness: 0.80, bankingPenetration: 0.73, informalEconomy: 0.25, ecommerceReadiness: 0.71, marketSize: 0.25 },
  BO: { name: "Bolivia",     gdpPerCapita: 3500,  digitalReadiness: 0.42, bankingPenetration: 0.38, informalEconomy: 0.77, ecommerceReadiness: 0.30, marketSize: 0.22 },
  PY: { name: "Paraguay",    gdpPerCapita: 5200,  digitalReadiness: 0.46, bankingPenetration: 0.35, informalEconomy: 0.70, ecommerceReadiness: 0.35, marketSize: 0.20 },
  VE: { name: "Venezuela",   gdpPerCapita: 1500,  digitalReadiness: 0.38, bankingPenetration: 0.55, informalEconomy: 0.82, ecommerceReadiness: 0.22, marketSize: 0.30 },
  GT: { name: "Guatemala",   gdpPerCapita: 4600,  digitalReadiness: 0.44, bankingPenetration: 0.41, informalEconomy: 0.72, ecommerceReadiness: 0.34, marketSize: 0.28 },
  CR: { name: "Costa Rica",  gdpPerCapita: 12800, digitalReadiness: 0.72, bankingPenetration: 0.68, informalEconomy: 0.38, ecommerceReadiness: 0.60, marketSize: 0.20 },
  PA: { name: "Panamá",      gdpPerCapita: 14600, digitalReadiness: 0.68, bankingPenetration: 0.62, informalEconomy: 0.40, ecommerceReadiness: 0.57, marketSize: 0.18 },
  DO: { name: "Rep. Dominicana", gdpPerCapita: 9300, digitalReadiness: 0.56, bankingPenetration: 0.52, informalEconomy: 0.52, ecommerceReadiness: 0.46, marketSize: 0.30 },
  OTHER: { name: "Otro",     gdpPerCapita: 6000,  digitalReadiness: 0.55, bankingPenetration: 0.50, informalEconomy: 0.60, ecommerceReadiness: 0.45, marketSize: 0.40 },
};

// ─── Perfiles por tipo de negocio ───────────────────────────────────────────

interface BusinessTypeProfile {
  digitalDependency: number;      // 0-1: qué tan dependiente es del entorno digital
  regulatoryBurden: number;       // 0-1: carga regulatoria intrínseca
  logisticsComplexity: number;    // 0-1: complejidad logística base
  minTicketViability: TicketLevel;// Ticket mínimo para ser viable
  scalabilityIndex: number;       // 0-1: potencial de escala
}

const BUSINESS_TYPE_PROFILES: Record<BusinessType, BusinessTypeProfile> = {
  saas:           { digitalDependency: 0.95, regulatoryBurden: 0.20, logisticsComplexity: 0.00, minTicketViability: "medio", scalabilityIndex: 0.95 },
  ecommerce:      { digitalDependency: 0.80, regulatoryBurden: 0.30, logisticsComplexity: 0.75, minTicketViability: "bajo",  scalabilityIndex: 0.70 },
  marketplace:    { digitalDependency: 0.90, regulatoryBurden: 0.45, logisticsComplexity: 0.50, minTicketViability: "medio", scalabilityIndex: 0.90 },
  servicio_local: { digitalDependency: 0.30, regulatoryBurden: 0.25, logisticsComplexity: 0.40, minTicketViability: "bajo",  scalabilityIndex: 0.35 },
  educacion:      { digitalDependency: 0.75, regulatoryBurden: 0.20, logisticsComplexity: 0.10, minTicketViability: "bajo",  scalabilityIndex: 0.80 },
  fintech:        { digitalDependency: 0.90, regulatoryBurden: 0.85, logisticsComplexity: 0.05, minTicketViability: "medio", scalabilityIndex: 0.85 },
  logistica:      { digitalDependency: 0.55, regulatoryBurden: 0.50, logisticsComplexity: 0.90, minTicketViability: "medio", scalabilityIndex: 0.65 },
  contenido:      { digitalDependency: 0.85, regulatoryBurden: 0.10, logisticsComplexity: 0.00, minTicketViability: "bajo",  scalabilityIndex: 0.70 },
};

// ─── Lógica de scoring ───────────────────────────────────────────────────────

function getCountryProfile(country: string): CountryProfile {
  return COUNTRY_PROFILES[country.toUpperCase()] ?? COUNTRY_PROFILES["OTHER"];
}

function scaleScore(value: number, min = 0, max = 1): number {
  return Math.round(Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)));
}

export function buildBusinessProfile(form: {
  country: string;
  business_idea: string;
  type: BusinessType;
  audience: Audience;
  ticket: TicketLevel;
  channel: SalesChannel;
  needs_logistics: boolean;
  needs_special_payments: boolean;
  etapa: Etapa;
  dolores: string[];
  otro_detalle?: string | null;
  tiempo: TiempoDisponible;
}): BusinessProfile {
  return { ...form };
}

export function scoreBusinessProfile(profile: BusinessProfile): ScoringResult {
  const country = getCountryProfile(profile.country);
  const bizType = BUSINESS_TYPE_PROFILES[profile.type];

  // ── 1. Market Size Index (WDI proxy) ──────────────────────────
  // SaaS/digital: el tamaño de mercado importa pero el país puede tener acceso global
  // Servicio local: depende fuertemente del tamaño y PIB local
  const channelModifier = profile.channel === "digital" ? 0.3 : 0; // digital puede exportar
  const marketSizeIndex = Math.min(1, country.marketSize + channelModifier);

  // ── 2. Digital Readiness Index (UNCTAD/UIT proxy) ─────────────
  // Qué tan bien soporta el país un negocio con esa dependencia digital
  const digitalGap = bizType.digitalDependency - country.digitalReadiness;
  // Gap negativo = el país supera la demanda del negocio (good)
  const digitalReadinessIndex = Math.max(0, 1 - Math.max(0, digitalGap) * 1.5);

  // ── 3. Regulatory Index (Enterprise Surveys/CEPAL proxy) ──────
  const regulatoryBase = 1 - bizType.regulatoryBurden;
  const paymentsModifier = profile.needs_special_payments ? -0.2 : 0;
  const informalCompetitionPenalty = country.informalEconomy * 0.3; // Competencia informal
  const regulatoryIndex = Math.max(0, regulatoryBase + paymentsModifier - informalCompetitionPenalty);

  // ── 4. Execution Index (etapa + tiempo + dolores) ─────────────
  const etapaScores: Record<Etapa, number> = { idea: 0.4, validando: 0.6, operando: 0.75, escalando: 0.90 };
  const tiempoScores: Record<TiempoDisponible, number> = { dias: 0.6, semanas: 0.80, meses: 1.0 };
  const dolorPenalty = profile.dolores.length > 3 ? 0.1 : 0; // demasiados dolores = exceso de scope
  const executionIndex = ((etapaScores[profile.etapa] + tiempoScores[profile.tiempo]) / 2) - dolorPenalty;

  // ── 5. Viability Score compuesto ──────────────────────────────
  const ticketMod: Record<TicketLevel, number> = { bajo: -0.05, medio: 0, alto: 0.10 };
  const audienceMod: Record<Audience, number> = { b2b: 0.05, b2c: 0, mixto: 0.02 };
  const logisticsPenalty = (profile.needs_logistics && !["ecommerce", "logistica"].includes(profile.type)) ? 0.10 : 0;

  const rawScore =
    (marketSizeIndex * 0.20) +
    (digitalReadinessIndex * 0.25) +
    (regulatoryIndex * 0.20) +
    (executionIndex * 0.25) +
    (bizType.scalabilityIndex * 0.10) +
    ticketMod[profile.ticket] +
    audienceMod[profile.audience] -
    logisticsPenalty;

  const viabilityScore = Math.round(Math.max(10, Math.min(98, rawScore * 100)));

  // ── 6. BIG 6 FRAMEWORK (McKinsey/BCG style) ───────────────────
  
  // 1. Potencial de Demanda
  const demandScoreValue = scaleScore(marketSizeIndex + (profile.etapa === "escalando" ? 0.2 : 0) + (profile.audience === "b2b" ? 0.1 : 0));
  const demandScore = Math.min(5, Math.max(1, Math.round((demandScoreValue / 100) * 4) + 1));
  const demandSignal = demandScore >= 4 ? "Alto" : demandScore === 3 ? "Medio" : "Bajo";
  const demandRationale = demandScore >= 4 
    ? `El tamaño del mercado en ${country.name} y tu enfoque ${profile.audience} sugieren una oportunidad expansiva sólida.`
    : `Oportunidad de volumen limitada en ${country.name}; el nicho de demanda debe ser extremadamente preciso.`;

  // 2. Capacidad de Monetización
  const monetizationScoreValue = scaleScore((country.gdpPerCapita / 20000) + ticketMod[profile.ticket] + (profile.audience === "b2b" ? 0.2 : 0));
  const monetizationScore = Math.min(5, Math.max(1, Math.round((monetizationScoreValue / 100) * 4) + 1));
  const monetizationSignal = monetizationScore >= 4 ? "Alto" : monetizationScore === 3 ? "Medio" : "Bajo";
  const monetizationRationale = monetizationScore >= 4
    ? `El poder adquisitivo local soporta tu ticket ${profile.ticket}, indicando alta disposición a pagar en el segmento.`
    : `Fricción de precio detectada: el ticket ${profile.ticket} enfrentará resistencia frente al GDP per cápita de ${country.name}.`;

  // 3. Intensidad Competitiva / Saturación
  const competitionScoreValue = scaleScore(country.informalEconomy + (bizType.digitalDependency > 0.8 ? 0.2 : 0));
  const competitionScore = Math.min(5, Math.max(1, Math.round(((100 - competitionScoreValue) / 100) * 4) + 1)); // Invertido: menos inf/sat = mejor score
  const competitionSignal = competitionScore >= 4 ? "Alto" : competitionScore === 3 ? "Medio" : "Bajo";
  const competitionRationale = competitionScore >= 4
    ? `Baja saturación detectada. El mercado para ${profile.type} tiene un océano azul razonable disponible.`
    : `Entorno denso: alta penetración u oferta informal significa que la diferenciación será tú única barrera de defensa.`;

  // 4. Rentabilidad Potencial (Economía Unitaria)
  const profitabilityScoreValue = scaleScore(bizType.scalabilityIndex - logisticsPenalty + ticketMod[profile.ticket]);
  const profitabilityScore = Math.min(5, Math.max(1, Math.round((profitabilityScoreValue / 100) * 4) + 1));
  const profitabilitySignal = profitabilityScore >= 4 ? "Alto" : profitabilityScore === 3 ? "Medio" : "Bajo";
  const profitabilityRationale = profitabilityScore >= 4
    ? `Estructura de costos ligera. Escalar este modelo (${profile.type}) no destruirá tus márgenes operacionales.`
    : `Presión sobre unit economics debido a dependencia física o escalabilidad limitada intrínseca.`;

  // 5. Riesgo de Entrada y Operación
  const riskScoreValue = scaleScore(1 - (regulatoryIndex - (profile.needs_special_payments ? 0.2 : 0) - logisticsPenalty));
  const riskScore = Math.min(5, Math.max(1, Math.round((riskScoreValue / 100) * 4) + 1)); 
  const riskSignal = riskScore >= 4 ? "Bajo" : riskScore === 3 ? "Medio" : "Alto"; // Ojo, señal invertida para riesgo
  const riskRationale = riskScore >= 4
    ? `Barreras operativas limpias. Ejecución sin frenos regulatorios o dependencias de infraestructura pesada.`
    : `Alerta: licencias especiales, logística rígida o regulaciones financieras aumentan significativamente el costo de entrada.`;

  // 6. Readiness del Mercado / Facilidad de Adopción
  const readinessScoreValue = scaleScore(digitalReadinessIndex);
  const readinessScore = Math.min(5, Math.max(1, Math.round((readinessScoreValue / 100) * 4) + 1));
  const readinessSignal = readinessScore >= 4 ? "Alto" : readinessScore === 3 ? "Medio" : "Bajo";
  const readinessRationale = readinessScore >= 4
    ? `La madurez digital de ${country.name} está alineada con la fricción tecnológica de tu modelo.`
    : `La alfabetización o infraestructura digital del cliente promedio exigirá un onboarding largo y costoso.`;

  const big6: Big6Indicator[] = [
    { name: "Potencial de Demanda", score: demandScore, signal: demandSignal, rationale: demandRationale },
    { name: "Capacidad de Monetización", score: monetizationScore, signal: monetizationSignal, rationale: monetizationRationale },
    { name: "Saturación Competitiva", score: competitionScore, signal: competitionSignal, rationale: competitionRationale },
    { name: "Rentabilidad Potencial", score: profitabilityScore, signal: profitabilitySignal, rationale: profitabilityRationale },
    { name: "Riesgo de Entrada", score: riskScore, signal: riskSignal, rationale: riskRationale },
    { name: "Facilidad de Adopción", score: readinessScore, signal: readinessSignal, rationale: readinessRationale }
  ];

  // ── 7. Veredicto Final ────────────────────────────────────────
  let verdict: FinalVerdict;
  if (demandScore >= 4 && monetizationScore >= 3 && riskScore >= 3) {
    verdict = "Avanzar";
  } else if (demandScore >= 3 && competitionScore <= 2) {
    verdict = "Avanzar con nicho";
  } else if (demandScore >= 3 && (monetizationScore <= 2 || readinessScore <= 2)) {
    verdict = "Pivotear";
  } else {
    verdict = "No priorizar";
  }

  // ── 8. Dimensiones cualitativas legacy ───────────────────────
  const complexityLevel: ScoringResult["complexity_level"] =
    bizType.regulatoryBurden > 0.6 || logisticsPenalty > 0 ? "alta" :
    bizType.digitalDependency > 0.7 && country.digitalReadiness < 0.55 ? "media" : "baja";

  const digitalReadinessRequired: ScoringResult["digital_readiness_required"] =
    bizType.digitalDependency > 0.8 ? "alta" :
    bizType.digitalDependency > 0.5 ? "media" : "baja";

  const regulatoryRisk: ScoringResult["regulatory_risk"] =
    bizType.regulatoryBurden > 0.6 || profile.needs_special_payments ? "alto" :
    bizType.regulatoryBurden > 0.35 ? "medio" : "bajo";

  // ── 9. Bloque recomendado ─────────────────────────────────────
  let recommendedBlock: string;
  let recommendedBlockNum: number;
  let rationale: string;

  if (profile.etapa === "idea" || viabilityScore < 50) {
    recommendedBlock = "Radar de Idea";
    recommendedBlockNum = 1;
    if (viabilityScore >= 75) {
      rationale = `¡Excelente viabilidad general (${viabilityScore}/100)! Sin embargo, al estar en fase de idea, el paso crítico es aterrizarla. El Radar de Idea estructurará tu visión en un modelo claro y te ayudará a ratificar demanda antes de gastar en construcción.`;
    } else {
      rationale = `Tu idea enfrenta algunos retos estructurales iniciales (${viabilityScore}/100). El Radar de Idea es esencial para pivotar, encontrar un nicho más seguro y confirmar la viabilidad real antes de que inviertas tus recursos.`;
    }
  } else if (profile.etapa === "validando" || viabilityScore < 70) {
    recommendedBlock = "Blueprint de Negocio";
    recommendedBlockNum = 2;
    if (viabilityScore >= 75) {
      rationale = `Tienes una tracción de mercado muy prometedora (${viabilityScore}/100). Estás en el momento perfecto para el Blueprint de Negocio, que te dará los cimientos operativos robustos para escalar sin romperte.`;
    } else {
      rationale = `Hay señales de mercado en tu proyecto, pero con un score de ${viabilityScore}/100 advertimos fricción operativa. El Blueprint de Negocio te ayudará a ajustar y blindar tu modelo base antes de subir la inversión.`;
    }
  } else if (profile.etapa === "operando" && profile.dolores.includes("sin_sistema")) {
    recommendedBlock = "Kit Operacional 1.0";
    recommendedBlockNum = 4;
    rationale = `Ya tienes la tracción de ventas, pero careces de un sistema confiable. Para un proyecto de tu estilo, el caos operativo es el freno principal; el Kit Operacional te ordenará y profesionalizará de inmediato.`;
  } else if (profile.etapa === "operando" || profile.etapa === "escalando") {
    if (profile.dolores.includes("sin_automatizacion") || profile.dolores.includes("caos_operativo")) {
      recommendedBlock = "Automatización Inicial";
      recommendedBlockNum = 5;
      rationale = `Con operación activa y dolores en tareas manuales, este bloque te liberará tiempo valioso para delegar robóticamente procesos aburridos, permitiéndote escalar — especialmente relevante para tu ${profile.type}.`;
    } else {
      recommendedBlock = "MVP de Validación";
      recommendedBlockNum = 3;
      rationale = `Tienes una base lista para el mercado de prueba. El MVP de Validación te permitirá capturar clientes reales con iteraciones sumamente rápidas antes de invertir en una infraestructura de software completa.`;
    }
  } else {
    recommendedBlock = "Radar de Idea";
    recommendedBlockNum = 1;
    rationale = `Empecemos por ordenar y validar que esta propuesta ${profile.type} resuena comercialmente en el mercado de ${country.name}.`;
  }

  // ── 10. Riesgos y Quick Wins ───────────────────────────────────
  const keyRisks: string[] = [];
  const quickWins: string[] = [];

  // Riesgos
  if (country.informalEconomy > 0.6)
    keyRisks.push(`Alta competencia informal en ${country.name} — requieres de un diferenciador muy marcado o sufrirán tus márgenes.`);
  if (bizType.regulatoryBurden > 0.5 || profile.needs_special_payments)
    keyRisks.push(`Complejidad Regulatoria/Pagos: Asegura los procesos legales o fiscales de tu plataforma antes de salir al mercado público.`);
  if (bizType.digitalDependency > 0.75 && country.digitalReadiness < 0.60)
    keyRisks.push(`Fricción tecnológica: La infraestructura digital (Readiness) de ${country.name} podría limitar la velocidad de adopción de tu nicho.`);
  if (profile.needs_logistics && bizType.logisticsComplexity < 0.5)
    keyRisks.push(`Fricción física: Al requerir logística en tu modelo, la complejidad y costos de última milla penalizarán la rentabilidad.`);
  if (profile.ticket === "bajo" && profile.audience === "b2b")
    keyRisks.push(`CAC recovery complejo: Cobrar ticket 'bajo' a perfiles empresariales (B2B) rara vez es sostenible por lo lento del ciclo de venta.`);
  
  if (keyRisks.length === 0)
    keyRisks.push(`Falta de urgencia: Al tener un excelente perfil de bajo riesgo sistémico, tu mayor amenaza actual es ser demasiado lento ejecutando.`);

  // Quick Wins (Más variados)
  if (profile.channel === "digital" || profile.channel === "hibrida") {
    if (profile.etapa === "idea") quickWins.push(`Diseño de un 'Landing Page' MVP de prueba en menos de 48 hrs para medir clicks y captar la demanda real.`);
    else quickWins.push(`Auditoría exprés sobre tu actual embudo de venta digital para detectar en qué paso exacto se están escapando los clientes.`);
  }
  if (profile.audience === "b2b") {
    quickWins.push(`Extracción y mapeo en frío (vía LinkedIn) de 15 tomadores de decisión objetivo para agendar 3 entrevistas de descubrimiento cualitativo.`);
  }
  if (profile.etapa === "operando" || profile.etapa === "escalando") {
    if (profile.dolores.includes("sin_automatizacion")) quickWins.push(`Inventario de horas-hombre: mapear la tarea digital más repetitiva de tu semana para inyectarla en Zapier o Make este mismo viernes.`);
    else quickWins.push(`Ejercicio de simplificación del "Customer Journey" para erradicar un paso manual o fricción para el usuario en tu proceso de onboarding.`);
  }
  if (profile.dolores.includes("sin_ventas")) {
    quickWins.push(`Asesinar la distracción multicanal: Limita el esfuerzo de ventas a 1 solo canal esta semana y calcula sin piedad tu Costo de Adquisición de Clientes (CAC).`);
  }
  if (profile.ticket === "alto") {
    quickWins.push(`Reestructuración del 'Sales Pitch' para hablar exclusivamente en términos de Retorno de Inversión (ROI) para tu cliente premium.`);
  }
  if (profile.type === "ecommerce" || profile.needs_logistics) {
    quickWins.push(`Comparativa de consolidación de proveedores paqueteros locales o modelos de prepago (guías corporativas) para aliviar tu estrés logístico esta semana.`);
  }
  
  if (quickWins.length === 0) {
    quickWins.push(`Definición del Riesgo Cero: Crear una lista de tus 3 supuestos de modelo más arriesgados y probar el número uno esta misma semana.`);
  }

  // ── 11. Payload n8n/IA (Fase 3) ────────────────────────────────
  const logisticsDep = ({ ecommerce: "alta", logistica: "alta", servicio_local: "media" } as Record<string, "ninguna" | "baja" | "media" | "alta">)[profile.type] ?? (profile.needs_logistics ? "media" : "ninguna");
  const paymentsDep: "baja" | "media" | "alta" = profile.needs_special_payments ? "alta" : (profile.type === "fintech" ? "alta" : "baja");
  const regSensitivity: "baja" | "media" | "alta" = regulatoryRisk === "alto" ? "alta" : regulatoryRisk === "medio" ? "media" : "baja";

  const n8nPayload: N8nPayload = {
    country: profile.country,
    business_profile: {
      business_idea: profile.business_idea,
      type: profile.type,
      audience: profile.audience,
      channel: profile.channel,
      ticket: profile.ticket,
      logistics_dependency: logisticsDep,
      payments_dependency: paymentsDep,
      regulatory_sensitivity: regSensitivity,
      etapa: profile.etapa,
      dolores: profile.dolores,
      tiempo: profile.tiempo,
    },
    scores: {
      viability: viabilityScore,
      market_size_index: scaleScore(marketSizeIndex),
      digital_readiness_index: scaleScore(digitalReadinessIndex),
      regulatory_index: scaleScore(regulatoryIndex),
      execution_index: scaleScore(executionIndex),
    },
  };

  return {
    viability_score: viabilityScore,
    complexity_level: complexityLevel,
    digital_readiness_required: digitalReadinessRequired,
    regulatory_risk: regulatoryRisk,
    big6,
    verdict,
    recommended_block: recommendedBlock,
    recommended_block_num: recommendedBlockNum,
    rationale,
    key_risks: keyRisks.slice(0, 3),
    quick_wins: quickWins.slice(0, 3),
    n8n_payload: n8nPayload,
  };
}
