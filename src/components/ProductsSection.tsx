// ─── ProductsSection.tsx ──────────────────────────────────────────────────
// Bloques como productos con resultado tangible, etiqueta de precio y CTA.

const PRODUCTS = [
  {
    id: "radar-de-idea",
    num: "01",
    badge: "GRATIS",
    badgeColor: "green",
    name: "Radar de Idea",
    tagline: "En 48hrs sabes si tu idea tiene potencial real.",
    description:
      "Dejamos de adivinar. Te entregamos un análisis estructurado con matriz de riesgo, tamaño de mercado express y evaluación de viabilidad técnica inicial. Si la idea tiene fundamentos, lo verás negro sobre blanco.",
    deliverables: [
      "Matriz de riesgo (mercado, técnico, ejecución)",
      "Análisis de mercado express (tamaño y competidores)",
      "Evaluación de viabilidad técnica inicial",
      "Recomendación de próximo bloque",
    ],
    timeframe: "48 horas",
    cta: "Iniciar Gratis",
    ctaHref: "/diagnostico",
    accent: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
  },
  {
    id: "blueprint-de-negocio",
    num: "02",
    badge: "OTC",
    badgeColor: "primary",
    name: "Blueprint de Negocio",
    tagline: "De la cabeza al papel en una semana. Tu modelo blindado.",
    description:
      "Tu idea tiene que convertirse en un plan que puedas ejecutar, explicar y vender. Te entregamos un documento accionable con tu modelo financiero básico, propuesta de valor y go-to-market plan.",
    deliverables: [
      "Modelo financiero base (proyecciones 12 meses)",
      "Propuesta de valor diferenciada",
      "Plan go-to-market paso a paso",
      "Canvas de negocio en formato accionable",
    ],
    timeframe: "1 semana",
    cta: "Consultar precio",
    ctaHref: "/contacto",
    accent: "from-primary/10 to-violet-500/5",
    border: "border-primary/20",
  },
  {
    id: "mvp-de-validacion",
    num: "03",
    badge: "OTC",
    badgeColor: "primary",
    name: "MVP de Validación",
    tagline: "Tu primer cliente real en menos de 15 días.",
    description:
      "Basta de construir en el vacío. Creamos un prototipo funcional mínimo expuesto al mercado real. No perfecto, funcional. El objetivo: vender antes de que estés listo.",
    deliverables: [
      "Prototipo funcional (web/app/servicio)",
      "Página de captura de leads activa",
      "Configuración de primer canal de venta",
      "Plan de validación con métricas clave",
    ],
    timeframe: "15 días",
    cta: "Consultar precio",
    ctaHref: "/contacto",
    accent: "from-blue-500/10 to-cyan-500/5",
    border: "border-blue-500/20",
  },
  {
    id: "kit-operacional",
    num: "04",
    badge: "OTC",
    badgeColor: "primary",
    name: "Kit Operacional 1.0",
    tagline: "Tu infraestructura del Día 1 sin fricciones técnicas.",
    description:
      "Embudos de captura, dominio, CRM básico, email, WhatsApp Business — todo conectado y funcionando. Eliminamos la fricción técnica que bloquea a la mayoría de emprendedores en la puesta en marcha.",
    deliverables: [
      "Embudo de captura configurado",
      "CRM básico operativo (Notion/Airtable)",
      "Email corporativo + WhatsApp Business",
      "Dominio + hosting configurados",
    ],
    timeframe: "1 semana",
    cta: "Consultar precio",
    ctaHref: "/contacto",
    accent: "from-orange-500/10 to-amber-500/5",
    border: "border-orange-500/20",
  },
  {
    id: "automatizacion-inicial",
    num: "05",
    badge: "OTC",
    badgeColor: "primary",
    name: "Automatización Inicial",
    tagline: "Procesos clave en piloto automático. Recupera tu tiempo.",
    description:
      "Configuramos flujos automáticos para tus tareas más repetitivas: bienvenida a leads, notificaciones, captura de datos, recordatorios. Sin código. Sin que tú lo tengas que hacer a mano nunca más.",
    deliverables: [
      "Flujo de bienvenida automático (email + WhatsApp)",
      "Captura y clasificación automática de leads",
      "Notificaciones internas para tu equipo",
      "Integración CRM ↔ Email ↔ WhatsApp",
    ],
    timeframe: "1 semana",
    cta: "Consultar precio",
    ctaHref: "/contacto",
    accent: "from-purple-500/10 to-fuchsia-500/5",
    border: "border-purple-500/20",
  },
  {
    id: "operacion-ia",
    num: "06",
    badge: "OTC",
    badgeColor: "primary",
    name: "Operación Inteligente IA",
    tagline: "Tu negocio piensa y actúa mientras tú duermes.",
    description:
      "Agentes de IA entrenados en tu negocio que atienden clientes, califican leads, responden preguntas y generan reportes. La evolución natural cuando tu sistema base ya funciona.",
    deliverables: [
      "Agente de atención a clientes (WhatsApp/web)",
      "Calificación automática de leads con IA",
      "Reportes semanales generados automáticamente",
      "Dashboard de métricas operativas",
    ],
    timeframe: "2 semanas",
    cta: "Consultar precio",
    ctaHref: "/contacto",
    accent: "from-rose-500/10 to-pink-500/5",
    border: "border-rose-500/20",
  },
];

const ProductsSection = () => {
  return (
    <section id="bloques" className="py-20 px-6" aria-label="Nuestros bloques">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Los 6 Bloques
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada bloque es un producto independiente con resultado concreto.
            Compras lo que necesitas, cuando lo necesitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              id={`bloque-${p.id}`}
              className={`group relative bg-gradient-to-br ${p.accent} bg-card border ${p.border} rounded-3xl p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-3xl font-black text-foreground/20">
                  {p.num}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    p.badgeColor === "green"
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  {p.badge}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-xl font-bold text-foreground mb-1"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {p.name}
              </h3>
              <p className="text-sm font-medium text-primary mb-3 leading-snug">
                {p.tagline}
              </p>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                {p.description}
              </p>

              {/* Deliverables */}
              <ul className="space-y-1.5 mb-6">
                {p.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                <span className="text-xs text-muted-foreground">
                  ⏱ {p.timeframe}
                </span>
                <a href={p.ctaHref} id={`cta-${p.id}`}>
                  <button
                    className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                      p.badgeColor === "green"
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/25"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    }`}
                  >
                    {p.cta} →
                  </button>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
