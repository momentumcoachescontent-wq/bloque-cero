import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Loader2,
  RefreshCw,
  Tags,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createBlueprintBig6MetadataPatch } from "@/lib/blueprintBig6Report";
import { supabase } from "@/lib/supabase";

type JsonRecord = Record<string, unknown>;

type BlueprintInventoryItem = {
  id: string;
  public_id: string;
  business_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  user_id: string | null;
  lifecycle_stage: string | null;
  delivery_progress: number | null;
  is_premium: boolean | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string | null;
  data_class: string;
  requires_follow_up: boolean;
  payment_required: boolean;
  admin_note: string | null;
  has_preliminary: boolean;
  has_markdown: boolean;
  operational_status: string;
  needs_admin_attention: boolean;
  recommended_action: string;
  metadata: unknown;
};

const adminSupabase = supabase as unknown as SupabaseClient;

const toMetadataRecord = (metadata: unknown): JsonRecord => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata as JsonRecord;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const getBadgeClass = (value: string) => {
  if (["demo", "qa_fixture"].includes(value)) {
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  }

  if (["test", "legacy", "archived"].includes(value)) {
    return "bg-muted text-muted-foreground border-border";
  }

  if (["delivered"].includes(value)) {
    return "bg-green-500/10 text-green-600 border-green-500/20";
  }

  if (["stalled_after_preliminary", "delivered_missing_markdown", "failed"].includes(value)) {
    return "bg-red-500/10 text-red-600 border-red-500/20";
  }

  return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
};

// const getMetadataText = (metadata: JsonRecord, keys: string[], fallback = "") => {
//  for (const key of keys) {
//    const value = metadata[key];
//    if (typeof value === "string" && value.trim().length > 0) {
//      return value.trim();
//    }
//  }

  return fallback;
// };

//const createQaMarkdown = (item: BlueprintInventoryItem) => {
//  const metadata = toMetadataRecord(item.metadata);
//  const projectName = item.business_name?.trim() || "Proyecto sin nombre";
//  const preliminary = getMetadataText(
//    metadata,
//    ["preliminary", "preliminary_markdown", "preliminary_report", "summary", "idea_summary", "business_summary"],
//    "El proyecto cuenta con información inicial suficiente para generar un Blueprint estratégico de validación. Este reporte debe tratarse como versión QA/manual hasta que el flujo n8n Blueprint Completion quede conectado."
//  );
//  const industry = getMetadataText(
//    metadata,
//    ["industry", "sector", "business_type", "category"],
//    "servicio profesional / operación PyME"
//  );
//  const generatedAt = new Date().toLocaleString("es-MX", {
//    dateStyle: "medium",
//    timeStyle: "short",
//  });

  return `# Blueprint Estratégico v2 Big6 — ${projectName}

> Reporte QA generado manualmente desde Admin Blueprint Inventory el ${generatedAt}.  
> Public ID: ${item.public_id}  
> Sector inferido: ${industry}

---

## 1. Veredicto Ejecutivo

${projectName} debe avanzar como un sistema operativo comercial y no solo como una idea, servicio o mejora aislada. La oportunidad principal está en convertir el conocimiento del negocio en un proceso repetible: captación clara, diagnóstico rápido, seguimiento ordenado, entrega consistente y medición de resultados.

El veredicto es **continuar**, pero con una condición: antes de escalar marketing o automatización avanzada, el negocio necesita cerrar su arquitectura mínima de operación. Sin esa base, cualquier crecimiento puede aumentar fricción, retrabajo, pérdida de prospectos y dependencia del fundador/equipo clave.

**Decisión recomendada:** construir primero un bloque operativo de 90 días enfocado en claridad de oferta, control de leads, proceso comercial, entrega documentada y métricas básicas.

---

## 2. Lectura Estratégica

La lectura central es que el problema no parece ser falta de potencial, sino falta de estructura. El negocio puede tener demanda, conocimiento y capacidad de entrega, pero si no existe una ruta clara desde el primer contacto hasta la conversión y la entrega, el crecimiento se vuelve irregular.

**Base preliminar recibida:**

${preliminary}

Desde una perspectiva estratégica, este Blueprint debe responder tres preguntas:

1. ¿Qué problema específico resuelve ${projectName} y para quién?
2. ¿Qué proceso convierte interés en decisión de compra?
3. ¿Qué sistema permite entregar valor sin depender de memoria, improvisación o seguimiento manual?

La prioridad no es añadir complejidad. La prioridad es reducir ambigüedad operativa.

---

## 3. Diagnóstico Big 6

### 3.1 Oferta

**Lectura:** La oferta debe expresarse como una transformación concreta, no como una lista de servicios. El cliente debe entender qué obtiene, en cuánto tiempo y por qué vale la pena actuar ahora.

**Riesgo:** Si la oferta se comunica de forma genérica, el cliente compara por precio o posterga la decisión.

**Prioridad:** Crear una oferta principal con promesa, alcance, entregables, límites y siguiente paso claro.

### 3.2 Cliente / Mercado

**Lectura:** El mercado debe segmentarse por urgencia, capacidad de pago y dolor operativo. No todos los prospectos con interés son buenos clientes.

**Riesgo:** Atender clientes mal alineados consume tiempo, reduce margen y debilita la experiencia.

**Prioridad:** Definir cliente ideal, anti-segmento y criterios mínimos de calificación.

### 3.3 Adquisición

**Lectura:** El sistema de adquisición debe generar conversaciones calificadas, no solo visibilidad. La visibilidad sin captura ni seguimiento no se convierte en crecimiento.

**Riesgo:** Publicar, invertir o promocionar sin embudo puede producir actividad pero no pipeline.

**Prioridad:** Conectar cada canal a una acción medible: formulario, WhatsApp, llamada, diagnóstico o agenda.

### 3.4 Conversión

**Lectura:** La conversión requiere un proceso breve, confiable y repetible. El prospecto debe sentir avance desde el primer contacto.

**Riesgo:** La falta de seguimiento, tiempos largos de respuesta o mensajes inconsistentes pueden perder oportunidades ya interesadas.

**Prioridad:** Implementar flujo de calificación, guion de diagnóstico, propuesta estándar y recordatorios.

### 3.5 Entrega / Operación

**Lectura:** La entrega debe funcionar como un sistema documentado. Cada cliente debe pasar por etapas claras, responsables y criterios de cierre.

**Riesgo:** Si la entrega depende demasiado de personas específicas, el negocio no escala con calidad.

**Prioridad:** Mapear operación actual, documentar pasos críticos y crear checklist de entrega.

### 3.6 Métricas / Aprendizaje

**Lectura:** Lo que no se mide se vuelve opinión. El negocio necesita pocas métricas, pero revisadas de forma constante.

**Riesgo:** Tomar decisiones por intuición puede ocultar fugas en adquisición, conversión o entrega.

**Prioridad:** Medir leads, tasa de respuesta, tasa de conversión, tiempo de ciclo, ingresos y satisfacción.

---

## 4. Patología Operativa Principal

La patología principal es **crecimiento sin sistema de control**. Esto ocurre cuando el negocio tiene capacidad o intención de crecer, pero todavía no cuenta con una arquitectura mínima para capturar, clasificar, dar seguimiento, convertir y entregar de forma consistente.

Síntomas probables:

- Prospectos dispersos en WhatsApp, redes, llamadas o mensajes sin una sola fuente de verdad.
- Seguimiento dependiente de memoria o urgencia del día.
- Propuestas o respuestas diferentes según quién atiende.
- Dificultad para saber cuántas oportunidades reales existen.
- Entrega con pasos repetidos pero no documentados.
- Falta de métricas para distinguir avance real de actividad operativa.

La cura no es automatizar todo. La cura es diseñar primero el proceso mínimo correcto y después automatizar lo repetible.

---

## 5. Cliente Ideal y Anti-segmento

### Cliente ideal

El cliente ideal para ${projectName} es una persona o negocio que:

- Tiene un problema claro, frecuente y costoso.
- Reconoce la urgencia de resolverlo.
- Puede tomar decisión o influir directamente en ella.
- Tiene capacidad de pago alineada con la solución.
- Valora orden, seguimiento y resultados medibles.
- Está dispuesto a compartir información para recibir una solución adecuada.

### Anti-segmento

El anti-segmento es un prospecto que:

- Busca solo el precio más bajo.
- No reconoce el costo de no resolver el problema.
- Quiere resultados sin participar en el proceso.
- Cambia constantemente el alcance.
- No responde a tiempo o no entrega información mínima.
- Consume mucha atención antes de demostrar intención real.

**Regla de decisión:** el negocio debe proteger su capacidad operativa. No todo prospecto debe convertirse en cliente.

---

## 6. Propuesta de Valor

Propuesta de valor recomendada:

**${projectName} ayuda a clientes con un problema operativo o comercial claro a pasar de la incertidumbre a un proceso ordenado, medible y accionable, reduciendo fricción, tiempos de respuesta y dependencia de seguimiento manual.**

La propuesta debe comunicarse en tres niveles:

1. **Resultado:** qué mejora concreta obtiene el cliente.
2. **Método:** cómo se logra de forma confiable.
3. **Evidencia:** qué señales demuestran avance.

Versión corta para comunicación comercial:

**Diagnóstico claro, proceso ordenado y siguiente paso concreto para convertir intención en resultados.**

---

## 7. Modelo de Monetización

El modelo recomendado debe iniciar simple y evolucionar por niveles.

### Nivel 1: Entrada / Diagnóstico

Producto de bajo riesgo para el cliente. Sirve para ordenar la situación, identificar brechas y recomendar ruta de acción.

- Formato: diagnóstico, consulta, evaluación o Blueprint.
- Objetivo: convertir interés en claridad.
- Métrica: tasa de conversión de diagnóstico a siguiente fase.

### Nivel 2: Implementación / Servicio principal

Oferta principal donde se captura mayor valor económico.

- Formato: paquete cerrado, programa, implementación o acompañamiento.
- Objetivo: resolver el problema central.
- Métrica: margen, tiempo de entrega y satisfacción.

### Nivel 3: Continuidad / Optimización

Capa recurrente o de seguimiento.

- Formato: mantenimiento, soporte, mejora continua o acompañamiento mensual.
- Objetivo: sostener resultados y aumentar valor de vida del cliente.
- Métrica: retención, recompra y referidos.

---

## 8. Arquitectura Operativa

La arquitectura operativa mínima debe contener cinco bloques:

### 8.1 Captura

Un punto claro para registrar cada oportunidad: formulario, CRM, Supabase, hoja operativa o tablero interno.

### 8.2 Calificación

Criterios mínimos para decidir si el prospecto avanza, requiere educación, debe esperar o no es buen fit.

### 8.3 Conversión

Guion de diagnóstico, propuesta estándar, estado del lead y recordatorios.

### 8.4 Entrega

Checklist por etapa, responsables, fechas objetivo, evidencias y cierre.

### 8.5 Control

Dashboard operativo con leads, estado, próximos pasos, conversión, ingresos y alertas.

**Principio rector:** primero proceso visible, después automatización. Automatizar un proceso confuso solo acelera el desorden.

---

## 9. Roadmap 90 días

### Días 1-30: Claridad y control base

- Definir oferta principal y promesa de transformación.
- Documentar cliente ideal y anti-segmento.
- Crear formulario o punto único de captura.
- Diseñar pipeline simple de oportunidades.
- Crear guion de diagnóstico inicial.
- Definir plantilla base de propuesta.
- Medir leads recibidos, leads calificados y conversiones.

### Días 31-60: Sistema comercial mínimo

- Implementar seguimiento por estado.
- Crear recordatorios automáticos o semiautomáticos.
- Estandarizar respuestas frecuentes.
- Crear checklist de entrega.
- Separar oportunidades reales de contactos informativos.
- Medir tiempo de respuesta y tasa de avance.
- Ajustar oferta con base en objeciones reales.

### Días 61-90: Optimización y preparación para escala

- Identificar canal con mejor calidad de lead.
- Documentar operación repetible.
- Crear dashboard de control.
- Diseñar primera automatización crítica.
- Formalizar paquetes o niveles de monetización.
- Crear sistema de seguimiento post-entrega.
- Definir siguiente bloque de crecimiento.

---

## 10. Riesgos

1. **Automatizar antes de definir proceso.** Puede hacer más rápido un flujo que todavía no está bien diseñado.
2. **Escalar marketing sin conversión.** Aumenta contactos, pero no necesariamente ventas.
3. **Confundir actividad con avance.** Publicaciones, mensajes y juntas no sustituyen métricas de conversión.
4. **Aceptar clientes fuera de perfil.** Reduce margen y aumenta desgaste.
5. **No documentar entrega.** Mantiene dependencia del fundador o de personas clave.
6. **No tener fuente única de verdad.** Fragmenta información y complica decisiones.

---

## 11. Quick Wins

- Crear una tabla única de oportunidades con estado, responsable y siguiente acción.
- Definir tres preguntas de calificación obligatorias antes de cotizar.
- Crear una plantilla de respuesta para primer contacto.
- Crear una plantilla de propuesta con alcance, precio, tiempos y próximos pasos.
- Programar recordatorios para leads sin respuesta.
- Identificar los últimos 10 prospectos y clasificar por calidad.
- Convertir preguntas frecuentes en contenido educativo.
- Crear checklist simple de entrega para evitar omisiones.

---

## 12. Métricas

Métricas mínimas para los próximos 90 días:

| Área | Métrica | Objetivo operativo |
| --- | --- | --- |
| Adquisición | Leads nuevos por semana | Saber si hay flujo suficiente |
| Calificación | Porcentaje de leads calificados | Medir calidad, no solo volumen |
| Conversión | Diagnósticos agendados | Validar intención real |
| Ventas | Conversión a cliente | Detectar fugas comerciales |
| Operación | Tiempo de respuesta | Reducir pérdida de oportunidades |
| Entrega | Tiempo de ciclo | Controlar capacidad real |
| Calidad | Satisfacción / feedback | Detectar mejora o riesgo |
| Economía | Ingreso por cliente | Validar modelo de monetización |

La revisión debe hacerse semanalmente. La pregunta central no es “¿hicimos cosas?”, sino “¿qué cambió en el sistema?”.

---

## 13. Siguiente Bloque Recomendado

El siguiente bloque recomendado es **Bloque de Arquitectura Operativa y Conversión**.

Objetivo del bloque:

- Convertir el Blueprint en un sistema real de trabajo.
- Crear pipeline operativo.
- Definir estados, responsables y acciones.
- Estandarizar diagnóstico y propuesta.
- Preparar automatizaciones sin perder control humano.

**Prioridad inmediata:** implementar el tablero de control de oportunidades y el flujo mínimo de seguimiento antes de activar automatizaciones más complejas desde n8n.

---

## Cierre

${projectName} tiene potencial si se construye como sistema. La oportunidad no está solo en vender más, sino en operar con mayor claridad. Un negocio que controla su proceso comercial, su entrega y sus métricas puede crecer con menos fricción y tomar mejores decisiones.
`;
//};
const createDeliveredMetadataPatch = (item: BlueprintInventoryItem): JsonRecord => ({
  data_class: item.data_class === "real_or_unclassified" ? "qa_fixture" : item.data_class,
  requires_follow_up: false,
  ...createBlueprintBig6MetadataPatch({
    businessName: item.business_name,
    clientEmail: item.client_email,
    publicId: item.public_id,
    metadata: item.metadata,
  }),
  admin_note: "Avanzado manualmente a delivered con Blueprint v2 Big6 desde Admin Blueprint Inventory",
});
const BlueprintInventoryAdmin = () => {
  const [items, setItems] = useState<BlueprintInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [dataClassFilter, setDataClassFilter] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);

    const { data, error } = await adminSupabase
      .from("v_admin_blueprint_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error cargando inventario: " + error.message);
      setLoading(false);
      return;
    }

    setItems((data || []) as BlueprintInventoryItem[]);
    setLoading(false);
  };

  useEffect(() => {
    void fetchInventory();
  }, []);

  const updateBlueprint = async (
    item: BlueprintInventoryItem,
    updates: {
      lifecycle_stage?: string;
      delivery_progress?: number;
      is_premium?: boolean;
      payment_status?: string;
      metadataPatch?: JsonRecord;
    },
    successMessage: string
  ) => {
    setSavingId(item.id);

    const metadata = {
      ...toMetadataRecord(item.metadata),
      ...(updates.metadataPatch || {}),
      admin_updated_at: new Date().toISOString(),
    };

    const { error } = await adminSupabase
      .from("business_blueprints")
      .update({
        ...(updates.lifecycle_stage ? { lifecycle_stage: updates.lifecycle_stage } : {}),
        ...(typeof updates.delivery_progress === "number"
          ? { delivery_progress: updates.delivery_progress }
          : {}),
        ...(typeof updates.is_premium === "boolean" ? { is_premium: updates.is_premium } : {}),
        ...(updates.payment_status ? { payment_status: updates.payment_status } : {}),
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    setSavingId(null);

    if (error) {
      toast.error("No se pudo actualizar: " + error.message);
      return;
    }

    toast.success(successMessage);
    await fetchInventory();
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (dataClassFilter !== "all" && item.data_class !== dataClassFilter) return false;
      if (attentionOnly && !item.needs_admin_attention) return false;
      return true;
    });
  }, [items, dataClassFilter, attentionOnly]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      attention: items.filter((item) => item.needs_admin_attention).length,
      delivered: items.filter((item) => item.operational_status === "delivered").length,
      stalled: items.filter((item) => item.operational_status === "stalled_after_preliminary").length,
    };
  }, [items]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileSearch className="w-8 h-8 text-primary" />
            Inventario de Blueprints
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Control operativo para identificar ideas, usuario, estado, seguimiento y avance manual.
          </p>
        </div>

        <Button onClick={fetchInventory} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Sincronizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total</p>
          <p className="text-3xl font-black">{summary.total}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Requieren atención</p>
          <p className="text-3xl font-black text-red-500">{summary.attention}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Entregados</p>
          <p className="text-3xl font-black text-green-500">{summary.delivered}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Estancados</p>
          <p className="text-3xl font-black text-yellow-500">{summary.stalled}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={dataClassFilter}
            onChange={(event) => setDataClassFilter(event.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">Todas las clases</option>
            <option value="real">Real</option>
            <option value="qa_fixture">QA fixture</option>
            <option value="demo">Demo</option>
            <option value="test">Test</option>
            <option value="legacy">Legacy</option>
            <option value="real_or_unclassified">Sin clasificar</option>
          </select>

          <Button
            variant={attentionOnly ? "default" : "outline"}
            onClick={() => setAttentionOnly((value) => !value)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Solo atención
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-bold text-foreground">{filteredItems.length}</span> de{" "}
          <span className="font-bold text-foreground">{items.length}</span>
        </p>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-4">Proyecto / Usuario</th>
                <th className="text-left px-5 py-4">Clase</th>
                <th className="text-left px-5 py-4">Estado</th>
                <th className="text-left px-5 py-4">Contenido</th>
                <th className="text-left px-5 py-4">Acción recomendada</th>
                <th className="text-right px-5 py-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Cargando inventario...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No hay Blueprints con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-border/50 align-top">
                    <td className="px-5 py-5 min-w-[260px]">
                      <div className="font-bold text-foreground">{item.business_name || "Sin nombre"}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.client_email || "Sin email"}</div>
                      <div className="text-xs text-muted-foreground mt-1">Public ID: {item.public_id}</div>
                      <div className="text-[11px] text-muted-foreground/70 mt-2">{formatDate(item.created_at)}</div>
                    </td>

                    <td className="px-5 py-5">
                      <span className={`inline-flex border rounded-full px-2.5 py-1 text-xs font-bold ${getBadgeClass(item.data_class)}`}>
                        {item.data_class}
                      </span>
                      {item.requires_follow_up && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 font-bold">
                          <UserRoundCheck className="w-3 h-3" />
                          Seguimiento
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-5 min-w-[210px]">
                      <div className={`inline-flex border rounded-full px-2.5 py-1 text-xs font-bold ${getBadgeClass(item.operational_status)}`}>
                        {item.operational_status}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Stage: <span className="font-semibold">{item.lifecycle_stage || "N/A"}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Progress: <span className="font-semibold">{item.delivery_progress ?? 0}/7</span>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={item.has_preliminary ? "text-green-600" : "text-muted-foreground"}>
                          {item.has_preliminary ? "✓ Preliminary" : "— Preliminary"}
                        </span>
                        <span className={item.has_markdown ? "text-green-600" : "text-muted-foreground"}>
                          {item.has_markdown ? "✓ Markdown" : "— Markdown"}
                        </span>
                        <span className={item.is_premium ? "text-green-600" : "text-muted-foreground"}>
                          {item.is_premium ? "✓ Premium" : "— Premium"}
                        </span>
                        <span className={item.payment_required ? "text-yellow-600" : "text-green-600"}>
                          {item.payment_required ? "✓ Cobro activo" : "✓ Sin cobro"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-5 min-w-[220px]">
                      <p className="text-sm text-foreground">{item.recommended_action}</p>
                      {item.admin_note && (
                        <p className="text-xs text-muted-foreground mt-2 border-l-2 border-primary/30 pl-2">
                          {item.admin_note}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-col gap-2 items-end min-w-[210px]">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/b/${item.public_id}`, "_blank")}
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Abrir bóveda
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                metadataPatch: {
                                  data_class: "test",
                                  requires_follow_up: false,
                                  admin_note: "Marcado como test desde Admin Blueprint Inventory",
                                },
                              },
                              "Marcado como test"
                            )
                          }
                        >
                          <Tags className="w-3 h-3 mr-2" />
                          Marcar test
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                metadataPatch: {
                                  requires_follow_up: !item.requires_follow_up,
                                  admin_note: !item.requires_follow_up
                                    ? "Requiere seguimiento humano"
                                    : "Seguimiento humano desactivado",
                                },
                              },
                              !item.requires_follow_up ? "Seguimiento activado" : "Seguimiento desactivado"
                            )
                          }
                        >
                          <UserRoundCheck className="w-3 h-3 mr-2" />
                          {item.requires_follow_up ? "Quitar seguimiento" : "Dar seguimiento"}
                        </Button>

                        <Button
                          size="sm"
                          variant={item.payment_required ? "default" : "outline"}
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                metadataPatch: {
                                  payment_required: !item.payment_required,
                                  admin_note: !item.payment_required
                                    ? "Cobro activado desde Admin Blueprint Inventory"
                                    : "Cobro desactivado desde Admin Blueprint Inventory",
                                },
                              },
                              !item.payment_required ? "Cobro activado" : "Cobro desactivado"
                            )
                          }
                        >
                          {item.payment_required ? "Desactivar cobro" : "Activar cobro"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                lifecycle_stage: "archived",
                                metadataPatch: {
                                  data_class: item.data_class === "demo" ? "demo" : "test",
                                  requires_follow_up: false,
                                  admin_note: "Archivado desde Admin Blueprint Inventory",
                                },
                              },
                              "Blueprint archivado"
                            )
                          }
                        >
                          <Archive className="w-3 h-3 mr-2" />
                          Archivar
                        </Button>

                        <Button
                          size="sm"
                          disabled={savingId === item.id}
                          onClick={() =>
                            updateBlueprint(
                              item,
                              {
                                lifecycle_stage: "delivered",
                                delivery_progress: 7,
                                payment_status: item.payment_status || "pending",
                                metadataPatch: createDeliveredMetadataPatch(item),
                              },
                              "Blueprint v2 Big6 generado y avanzado a delivered"
                            )
                          }
                        >
                          <CheckCircle2 className="w-3 h-3 mr-2" />
                          Avanzar delivered
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlueprintInventoryAdmin;
