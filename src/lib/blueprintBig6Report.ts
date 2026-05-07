type JsonRecord = Record<string, unknown>;

export type BlueprintBig6ReportInput = {
  businessName?: string | null;
  clientEmail?: string | null;
  publicId?: string | null;
  metadata?: unknown;
  generatedAt?: string | null;
  fallbackReason?: string | null;
};

export const BLUEPRINT_BIG6_REPORT_VERSION = "blueprint_v2_big6_local_fallback_ai_assisted";
export const BLUEPRINT_INTELLIGENCE_ENGINE_ID = "n8n_bc_blueprint_intelligence_engine";

type AiSupportStatus = "ai_assisted" | "heuristic_only";

type AiSupport = {
  status: AiSupportStatus;
  sourceKeys: string[];
  executiveVerdict: string;
  strategicReading: string;
  diagnosis: string;
  operatingModel: string;
  risks: string;
  nextActions: string;
};

const AI_SUPPORT_CONTAINER_KEYS = [
  "blueprint_intelligence",
  "blueprint_ai",
  "ai_analysis",
  "ai_report",
  "ai_review",
  "canonical_context",
  "quality_gate",
  "n8n_result",
  "n8n_blueprint_intelligence",
];

const toMetadataRecord = (metadata: unknown): JsonRecord => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata as JsonRecord;
};

const normalizeText = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const collectTextValues = (value: unknown, depth = 0): string[] => {
  if (depth > 4 || value === null || value === undefined) return [];

  if (typeof value === "string") {
    const cleanValue = value.trim();
    return cleanValue ? [cleanValue] : [];
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectTextValues(entry, depth + 1));
  }

  if (typeof value === "object") {
    return Object.values(value as JsonRecord).flatMap((entry) => collectTextValues(entry, depth + 1));
  }

  return [];
};

const hasAny = (source: string, keywords: string[]) => keywords.some((keyword) => source.includes(keyword));

const getPathValue = (record: JsonRecord, path: string): unknown => {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
    return (current as JsonRecord)[segment];
  }, record);
};

const pickText = (record: JsonRecord, paths: string[]): string => {
  for (const path of paths) {
    const value = getPathValue(record, path);
    const direct = normalizeText(value);
    if (direct) return direct;

    if (value && typeof value === "object") {
      const nested = collectTextValues(value).join("\n").trim();
      if (nested) return nested;
    }
  }

  return "";
};

const extractAiSupport = (metadata: JsonRecord): AiSupport => {
  const sourceKeys = AI_SUPPORT_CONTAINER_KEYS.filter((key) => collectTextValues(metadata[key]).length > 0);

  return {
    status: sourceKeys.length > 0 ? "ai_assisted" : "heuristic_only",
    sourceKeys,
    executiveVerdict: pickText(metadata, [
      "blueprint_intelligence.executive_verdict",
      "blueprint_intelligence.veredicto_ejecutivo",
      "ai_analysis.executive_verdict",
      "ai_report.executive_verdict",
      "n8n_result.executive_verdict",
      "canonical_context.executive_verdict",
    ]),
    strategicReading: pickText(metadata, [
      "blueprint_intelligence.strategic_reading",
      "blueprint_intelligence.lectura_estrategica",
      "ai_analysis.strategic_reading",
      "ai_report.strategic_reading",
      "n8n_result.strategic_reading",
      "canonical_context.strategic_reading",
    ]),
    diagnosis: pickText(metadata, [
      "blueprint_intelligence.big6_diagnosis",
      "blueprint_intelligence.diagnostico_big6",
      "ai_analysis.big6_diagnosis",
      "ai_report.diagnosis",
      "n8n_result.diagnosis",
      "canonical_context.big6_diagnosis",
    ]),
    operatingModel: pickText(metadata, [
      "blueprint_intelligence.operating_model",
      "blueprint_intelligence.architectura_operativa",
      "ai_analysis.operating_model",
      "ai_report.operating_model",
      "n8n_result.operating_model",
      "canonical_context.operating_model",
    ]),
    risks: pickText(metadata, [
      "blueprint_intelligence.risks",
      "blueprint_intelligence.riesgos",
      "ai_analysis.risks",
      "ai_report.risks",
      "n8n_result.risks",
      "quality_gate.risks",
    ]),
    nextActions: pickText(metadata, [
      "blueprint_intelligence.next_actions",
      "blueprint_intelligence.siguientes_acciones",
      "ai_analysis.next_actions",
      "ai_report.next_actions",
      "n8n_result.next_actions",
      "canonical_context.next_actions",
    ]),
  };
};

const inferContext = (input: BlueprintBig6ReportInput) => {
  const metadata = toMetadataRecord(input.metadata);
  const sourceText = [input.businessName, ...collectTextValues(metadata)].join("\n").toLowerCase();
  const preliminary =
    normalizeText(metadata.preliminary) ||
    normalizeText(metadata.preliminary_markdown) ||
    normalizeText(metadata.preliminary_report) ||
    normalizeText(metadata.summary) ||
    normalizeText(metadata.idea_summary) ||
    normalizeText(metadata.business_summary);

  if (hasAny(sourceText, ["consultorio", "clínica", "clinica", "doctor", "médico", "medico", "paciente", "cita", "odont", "dental"])) {
    return {
      sector: "servicios de salud / consultorio",
      primaryPain: "pérdida de pacientes y citas por seguimiento manual, respuestas tardías y falta de trazabilidad comercial",
      idealClient: "pacientes o responsables de pacientes que necesitan agendar rápido, recibir confirmaciones claras y resolver dudas antes de acudir",
      antiSegment: "personas que solo buscan precio, no respetan citas, no responden confirmaciones o requieren atención fuera del alcance operativo actual",
      valuePromise: "convertir el consultorio en una operación más predecible: menos citas perdidas, mejor seguimiento y una experiencia más clara desde el primer contacto hasta la atención",
      recommendedBlock: "Bloque de Automatización Comercial y Seguimiento de Citas",
      operatingModel: "captura de prospectos/pacientes, clasificación por intención, confirmación automática, recordatorios, tablero de citas y seguimiento postconsulta",
      channelFocus: "WhatsApp, formularios web, Google Business Profile, referidos y redes sociales locales",
      preliminary,
    };
  }

  if (hasAny(sourceText, ["restaurante", "cafeter", "comida", "delivery", "reservación", "reservacion", "mesa"])) {
    return {
      sector: "restaurante / servicio local",
      primaryPain: "demanda irregular, baja captura de clientes recurrentes y operación comercial poco medible",
      idealClient: "clientes locales que valoran rapidez, experiencia consistente y facilidad para reservar, pedir o regresar",
      antiSegment: "clientes de compra única, altamente sensibles a descuentos o que no encajan con la experiencia/margen esperado",
      valuePromise: "transformar visitas aisladas en recurrencia medible mediante captura de datos, campañas simples y seguimiento operativo",
      recommendedBlock: "Bloque de Captura, Recurrencia y Promociones Medibles",
      operatingModel: "captura de clientes, promociones segmentadas, calendario comercial, medición de recompra y tablero de demanda",
      channelFocus: "Google Business Profile, Instagram, WhatsApp, referidos y campañas locales",
      preliminary,
    };
  }

  if (hasAny(sourceText, ["inmobiliaria", "renta", "venta", "propiedad", "asesor", "lead inmobiliario"])) {
    return {
      sector: "servicios inmobiliarios",
      primaryPain: "leads dispersos, baja calificación comercial y seguimiento inconsistente de oportunidades",
      idealClient: "prospectos con intención real de compra/renta, presupuesto definido y ventana de decisión activa",
      antiSegment: "curiosos sin presupuesto, prospectos sin urgencia o contactos que no entregan datos mínimos para calificación",
      valuePromise: "convertir contactos inmobiliarios en oportunidades priorizadas con seguimiento ordenado y medición por etapa",
      recommendedBlock: "Bloque de CRM, Calificación y Seguimiento Comercial",
      operatingModel: "captura multicanal, scoring de intención, agenda de seguimiento, pipeline por etapa y tablero de cierres",
      channelFocus: "portales inmobiliarios, WhatsApp, formularios, referidos y redes sociales",
      preliminary,
    };
  }

  if (hasAny(sourceText, ["curso", "coaching", "mentor", "academia", "programa", "comunidad", "taller"])) {
    return {
      sector: "educación, coaching o servicios de conocimiento",
      primaryPain: "oferta poco empaquetada, seguimiento comercial débil y baja conversión de interés en compra",
      idealClient: "personas con dolor claro, disposición a invertir y necesidad de acompañamiento estructurado",
      antiSegment: "personas que buscan solo contenido gratuito, no ejecutan tareas o no tienen prioridad real por resolver el problema",
      valuePromise: "empaquetar conocimiento en una oferta clara, vendible y operable con seguimiento y medición comercial",
      recommendedBlock: "Bloque de Oferta, Funnel y Conversión",
      operatingModel: "lead magnet, secuencia de nutrición, diagnóstico, oferta principal, onboarding y seguimiento de resultados",
      channelFocus: "LinkedIn, Instagram, email, webinars, comunidad y referidos",
      preliminary,
    };
  }

  return {
    sector: "negocio de servicios / operación en etapa de estructuración",
    primaryPain: "dependencia de procesos manuales, baja claridad de cliente ideal y falta de un sistema medible de conversión y entrega",
    idealClient: "clientes con problema claro, capacidad de pago, urgencia razonable y disposición a seguir un proceso definido",
    antiSegment: "personas sin urgencia, sin presupuesto, que piden personalización excesiva o no aceptan un proceso estructurado",
    valuePromise: "convertir una operación dispersa en un sistema comercial y operativo claro, medible y escalable por etapas",
    recommendedBlock: "Bloque de Sistema Comercial Mínimo y Operación Base",
    operatingModel: "captura de demanda, calificación, seguimiento, entrega documentada, métricas y mejora continua",
    channelFocus: "sitio web, WhatsApp, referidos, redes sociales y seguimiento directo",
    preliminary,
  };
};

const section = (title: string, body: string) => `## ${title}\n\n${body.trim()}`;

const optionalAiBlock = (title: string, body: string) => {
  const cleanBody = body.trim();
  if (!cleanBody) return "";

  return `\n\n**${title}:**\n\n${cleanBody}`;
};

export const createBlueprintBig6Markdown = (input: BlueprintBig6ReportInput) => {
  const metadata = toMetadataRecord(input.metadata);
  const aiSupport = extractAiSupport(metadata);
  const context = inferContext(input);
  const businessName = input.businessName || "Proyecto sin nombre";
  const generatedAt = input.generatedAt || new Date().toISOString();
  const fallbackReason =
    normalizeText(input.fallbackReason) ||
    "Fallback local de QA/emergencia mientras el motor principal n8n + IA completa análisis, generación, revisión y quality gate.";
  const preliminary =
    context.preliminary ||
    "El Blueprint fue generado desde Admin como fallback local. La información disponible permite construir una lectura estratégica inicial, pero no sustituye el Blueprint Intelligence Engine ni su quality gate.";
  const email = input.clientEmail ? `\n- Contacto asociado: ${input.clientEmail}` : "";
  const publicId = input.publicId ? `\n- Public ID: ${input.publicId}` : "";
  const sourceNote = normalizeText(metadata.source) || normalizeText(metadata.origin) || "Admin Blueprint Inventory";
  const aiSupportLabel =
    aiSupport.status === "ai_assisted"
      ? `IA asistida con fuentes metadata: ${aiSupport.sourceKeys.join(", ")}`
      : "Sin artefactos IA canónicos detectados; se usaron heurísticas locales de QA";

  return `# Blueprint Estratégico v2 Big6 — ${businessName}

> Versión: ${BLUEPRINT_BIG6_REPORT_VERSION}  
> Modo: fallback local / QA / emergencia  
> Motor principal esperado: ${BLUEPRINT_INTELLIGENCE_ENGINE_ID}  
> Estado de soporte IA: ${aiSupportLabel}  
> Generado: ${generatedAt}  
> Fuente operativa: ${sourceNote}${publicId}${email}

${section(
  "0. Nota de Gobernanza del Reporte",
  `Este documento **no debe tratarse como el motor premium principal** de Bloque Cero. Es una salida local de respaldo para QA, revisión interna o emergencia operativa.

**Razón de fallback:** ${fallbackReason}

La entrega premium aprobada debe provenir del workflow **BC - Blueprint Intelligence Engine**, con análisis IA, generación estructurada, revisión crítica, quality gate y persistencia de schema canónico.`
)}

${section(
  "1. Veredicto Ejecutivo",
  `El proyecto **${businessName}** tiene potencial si deja de operar como una idea aislada y se convierte en un sistema comercial-operativo medible. La prioridad no debe ser vender más de inmediato, sino ordenar la promesa, el cliente ideal, el flujo de conversión y la entrega mínima para evitar fuga de oportunidades.

**Veredicto fallback:** avanzar, pero con foco en sistema. El negocio debe pasar de esfuerzos manuales y dispersos a una arquitectura donde cada contacto tenga una ruta clara: captura → calificación → seguimiento → conversión → entrega → medición.${optionalAiBlock("Veredicto IA disponible", aiSupport.executiveVerdict)}

**Lectura base disponible:** ${preliminary}`
)}

${section(
  "2. Lectura Estratégica",
  `El contexto detectado corresponde a **${context.sector}**. La oportunidad principal está en transformar conocimiento, atención o servicio en una oferta operable y repetible.

Hoy el riesgo no parece estar únicamente en la demanda, sino en la capacidad de convertir esa demanda en un proceso consistente. Cuando un negocio depende de memoria humana, mensajes sueltos, notas dispersas o seguimiento informal, empieza a perder dinero antes de darse cuenta.

La tesis estratégica es simple: **antes de escalar adquisición, hay que construir control operativo.** Esto significa definir qué cliente sí se atiende, qué promesa se vende, cómo se responde, cómo se agenda o convierte, cómo se entrega y cómo se mide el avance.${optionalAiBlock("Lectura IA disponible", aiSupport.strategicReading)}`
)}

${section(
  "3. Diagnóstico Big 6",
  `### 1) Cliente
El cliente objetivo debe quedar definido por dolor, urgencia, capacidad de pago y facilidad de atención. Sin esta definición, el negocio atrae contactos que consumen tiempo pero no necesariamente generan margen.

### 2) Problema
El problema central no es solo “necesitar más clientes”. El problema real es tener una ruta incompleta entre interés, decisión y entrega. Esto provoca pérdida de oportunidades y baja predictibilidad.

### 3) Oferta
La oferta debe empaquetarse con una promesa clara, alcance definido, resultado esperado y criterios de entrada. Una oferta ambigua genera objeciones, descuentos y operación personalizada excesiva.

### 4) Canales
Los canales recomendados inicialmente son: **${context.channelFocus}**. La prioridad es capturar intención y dar seguimiento, no publicar contenido sin trazabilidad.

### 5) Operación
La operación debe documentar pasos mínimos: entrada del prospecto, clasificación, respuesta, seguimiento, entrega y cierre. Sin este flujo, cada oportunidad se atiende diferente.

### 6) Métricas
El negocio necesita medir volumen de contactos, tasa de respuesta, tasa de conversión, tiempo de seguimiento, citas/ventas concretadas, cancelaciones y valor generado por canal.${optionalAiBlock("Diagnóstico IA disponible", aiSupport.diagnosis)}`
)}

${section(
  "4. Patología Operativa Principal",
  `La patología principal es: **${context.primaryPain}.**

Esta patología suele verse como “falta de ventas”, pero en realidad es una fuga operativa. El negocio puede estar recibiendo interés, pero sin una estructura clara para priorizar, responder, nutrir y convertir.

Síntomas esperados:
- Conversaciones sin cierre.
- Prospectos que preguntan y desaparecen.
- Seguimientos manuales olvidados.
- Falta de visibilidad sobre qué canal funciona.
- Operación reactiva en lugar de proceso controlado.
- Dependencia excesiva del dueño o del equipo clave.`
)}

${section(
  "5. Cliente Ideal y Anti-segmento",
  `### Cliente ideal
${context.idealClient}.

Debe cumplir cuatro condiciones mínimas:
- Tiene un problema activo y reconocido.
- Puede decidir o influir en la compra.
- Tiene capacidad económica compatible con la oferta.
- Acepta operar bajo un proceso claro.

### Anti-segmento
${context.antiSegment}.

Este anti-segmento debe filtrarse temprano. No todo contacto debe convertirse en cliente; algunos contactos consumen operación, bajan margen y distraen al negocio de su mercado correcto.`
)}

${section(
  "6. Propuesta de Valor",
  `La propuesta de valor recomendada es: **${context.valuePromise}.**

Debe comunicarse en una frase simple:

> “Ayudamos a que ${businessName} convierta oportunidades dispersas en un proceso claro, medible y repetible.”

La propuesta debe evitar prometer transformación abstracta. Debe aterrizarse en resultados observables: menos pérdida de oportunidades, mejor seguimiento, más claridad para el cliente, operación más ordenada y decisiones basadas en datos.`
)}

${section(
  "7. Modelo de Monetización",
  `Modelo recomendado por etapas:

### Etapa 1: Oferta principal simple
Un servicio, paquete o solución central con alcance definido. Debe ser fácil de explicar, cotizar y entregar.

### Etapa 2: Complementos operativos
Agregar upsells o add-ons solo cuando la oferta base ya esté controlada. Ejemplos: seguimiento premium, automatización adicional, soporte extendido, diagnóstico recurrente o implementación por fases.

### Etapa 3: Recurrencia
Convertir parte del valor en ingresos recurrentes: mantenimiento, monitoreo, campañas, membresía, soporte mensual o gestión continua.

### Regla de monetización
No ampliar catálogo antes de medir conversión y entrega de la oferta base. Más ofertas sin sistema aumentan complejidad y reducen foco.`
)}

${section(
  "8. Arquitectura Operativa",
  `Arquitectura recomendada: **${context.operatingModel}.**

### Capa 1: Captura
Todo contacto debe entrar por canales controlados: formulario, WhatsApp, landing, agenda o CRM.

### Capa 2: Clasificación
Cada contacto debe clasificarse por intención, urgencia, tipo de necesidad y prioridad comercial.

### Capa 3: Seguimiento
Debe existir una secuencia mínima de mensajes, recordatorios y tareas para no depender de memoria humana.

### Capa 4: Conversión
La conversión debe tener criterios claros: cuándo se agenda, cuándo se cotiza, cuándo se descarta y cuándo se reactiva.

### Capa 5: Entrega
La entrega debe documentarse para reducir improvisación, asegurar consistencia y preparar escalamiento.

### Capa 6: Control
Un tablero debe mostrar oportunidades, estados, tiempos de respuesta, conversiones y bloqueos operativos.${optionalAiBlock("Arquitectura IA disponible", aiSupport.operatingModel)}`
)}

${section(
  "9. Roadmap 90 días",
  `### Días 1-30: Claridad y control base
- Definir cliente ideal y anti-segmento.
- Redactar propuesta de valor en versión corta y comercial.
- Mapear el flujo actual desde contacto hasta entrega.
- Crear estados mínimos del pipeline: nuevo, calificado, seguimiento, convertido, perdido.
- Centralizar contactos en una sola base operativa.

### Días 31-60: Conversión y seguimiento
- Crear guiones de respuesta inicial.
- Implementar recordatorios automáticos o semiautomáticos.
- Diseñar secuencia de seguimiento para prospectos no convertidos.
- Medir origen del contacto y avance por etapa.
- Identificar las tres principales razones de pérdida.

### Días 61-90: Optimización y escalamiento inicial
- Ajustar oferta según objeciones reales.
- Automatizar tareas repetitivas de seguimiento.
- Crear dashboard operativo básico.
- Documentar el proceso de entrega.
- Definir el siguiente bloque de implementación según datos, no intuición.${optionalAiBlock("Acciones IA disponibles", aiSupport.nextActions)}`
)}

${section(
  "10. Riesgos",
  `- Escalar campañas sin tener seguimiento medible.
- Atraer clientes fuera del perfil ideal.
- Confundir automatización con estrategia.
- Crear demasiadas ofertas antes de validar una oferta principal.
- Depender de una sola persona para responder, vender o entregar.
- Medir actividad, pero no conversión ni resultados.
- Activar cobro, paywall o entrega premium sin asegurar calidad del reporte y claridad de valor.${optionalAiBlock("Riesgos IA disponibles", aiSupport.risks)}`
)}

${section(
  "11. Quick Wins",
  `- Crear una plantilla única de respuesta inicial.
- Definir tres preguntas de calificación obligatorias.
- Centralizar todos los contactos en una tabla o CRM simple.
- Etiquetar prospectos por urgencia: alta, media, baja.
- Crear recordatorio de seguimiento a 24h, 72h y 7 días.
- Escribir una versión corta de la oferta en menos de 20 palabras.
- Revisar semanalmente oportunidades perdidas y motivo de pérdida.`
)}

${section(
  "12. Métricas",
  `Métricas mínimas para la siguiente fase:

- Contactos nuevos por semana.
- Porcentaje de contactos calificados.
- Tiempo promedio de primera respuesta.
- Tasa de conversión de contacto a cita/venta.
- Tasa de no respuesta después del primer contacto.
- Motivos de pérdida más frecuentes.
- Ingreso estimado por canal.
- Oportunidades recuperadas por seguimiento.
- Costo operativo manual por oportunidad.
- Nivel de avance por etapa del pipeline.`
)}

${section(
  "13. Siguiente Bloque Recomendado",
  `El siguiente bloque recomendado es: **${context.recommendedBlock}.**

Objetivo del bloque: convertir el Blueprint en un sistema mínimo operativo que capture, clasifique, dé seguimiento y mida oportunidades reales.

Resultado esperado al finalizar el bloque:
- Oferta principal clara.
- Cliente ideal definido.
- Pipeline operativo activo.
- Seguimiento documentado.
- Métricas base visibles.
- Decisión informada sobre automatización, adquisición o escalamiento.

**Nota final:** este bloque debe ser confirmado por el **Blueprint Intelligence Engine** antes de activar cobro o tratar el reporte como entregable premium aprobado.`
)}
`;
};

export const createBlueprintBig6MetadataPatch = (input: BlueprintBig6ReportInput): JsonRecord => {
  const metadata = toMetadataRecord(input.metadata);
  const generatedAt = input.generatedAt || new Date().toISOString();
  const aiSupport = extractAiSupport(metadata);

  return {
    payment_required: false,
    markdown: createBlueprintBig6Markdown({ ...input, generatedAt }),
    report_version: BLUEPRINT_BIG6_REPORT_VERSION,
    report_generator: "admin_local_big6_fallback_ai_assisted",
    report_engine: "local_fallback",
    report_engine_owner: "frontend_admin",
    report_generated_at: generatedAt,
    report_quality_status: "fallback_generated_not_product_approved",
    report_product_approved: false,
    report_can_activate_payment: false,
    report_delivery_label: "qa_fallback",
    fallback_mode: true,
    fallback_reason:
      normalizeText(input.fallbackReason) ||
      "Fallback local de QA/emergencia mientras el motor principal n8n + IA completa análisis, generación, revisión y quality gate.",
    fallback_ai_support_status: aiSupport.status,
    fallback_ai_support_sources: aiSupport.sourceKeys,
    intelligence_engine_id: BLUEPRINT_INTELLIGENCE_ENGINE_ID,
    intelligence_engine_required: true,
    intelligence_engine_status: "pending",
    quality_gate_status: "not_run",
    premium_engine_status: "pending_n8n_blueprint_intelligence_engine",
  };
};
