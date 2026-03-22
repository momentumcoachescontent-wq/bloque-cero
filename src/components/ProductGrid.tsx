import { Lightbulb, FileText, Rocket, Settings, Zap, Brain } from "lucide-react";

// ─── Productos con resultados tangibles y etiquetas de precio ──────────────
const products = [
  {
    num: "01",
    icon: Lightbulb,
    name: "Radar de Idea",
    tagline: "En 48hrs sabes si tu idea tiene potencial real.",
    desc: "Matriz de riesgo, análisis de mercado express y evaluación de viabilidad técnica inicial. Nada de suposiciones: datos concretos antes de invertir un peso.",
    entregables: ["Matriz de riesgo (mercado, técnico, ejecución)", "Análisis de mercado express", "Viabilidad técnica inicial"],
    tiempo: "48 horas",
    badge: "GRATIS",
    badgeGreen: true,
    ctaHref: "/diagnostico",
    cta: "Iniciar Gratis",
  },
  {
    num: "02",
    icon: FileText,
    name: "Blueprint de Negocio",
    tagline: "De la cabeza al papel en una semana. Tu modelo blindado.",
    desc: "Documento accionable con modelo financiero base, propuesta de valor diferenciada y plan go-to-market paso a paso.",
    entregables: ["Modelo financiero base", "Propuesta de valor clara", "Plan go-to-market"],
    tiempo: "1 semana",
    badge: "OTC",
    badgeGreen: false,
    ctaHref: "/contacto",
    cta: "Consultar",
  },
  {
    num: "03",
    icon: Rocket,
    name: "MVP de Validación",
    tagline: "Tu primer cliente real en menos de 15 días.",
    desc: "Prototipo funcional expuesto al mercado real. No esperas a que esté perfecto — vendes antes de que esté listo.",
    entregables: ["Prototipo funcional", "Página de captura activa", "Plan de validación con métricas"],
    tiempo: "15 días",
    badge: "OTC",
    badgeGreen: false,
    ctaHref: "/contacto",
    cta: "Consultar",
  },
  {
    num: "04",
    icon: Settings,
    name: "Kit Operacional 1.0",
    tagline: "Tu infraestructura del Día 1 sin fricciones técnicas.",
    desc: "Embudos de captura, CRM básico, email corporativo, WhatsApp Business — todo conectado y funcionando.",
    entregables: ["Embudo de captura configurado", "CRM básico operativo", "Email + WhatsApp Business"],
    tiempo: "1 semana",
    badge: "OTC",
    badgeGreen: false,
    ctaHref: "/contacto",
    cta: "Consultar",
  },
  {
    num: "05",
    icon: Zap,
    name: "Automatización Inicial",
    tagline: "Procesos clave en piloto automático. Recupera tu tiempo.",
    desc: "Flujos automáticos para bienvenida de leads, notificaciones y captura de datos. Sin código. Sin hacerlo a mano nunca más.",
    entregables: ["Flujo de bienvenida automático", "Captura y clasificación de leads", "Integración CRM ↔ Email ↔ WhatsApp"],
    tiempo: "1 semana",
    badge: "OTC",
    badgeGreen: false,
    ctaHref: "/contacto",
    cta: "Consultar",
  },
  {
    num: "06",
    icon: Brain,
    name: "Operación Inteligente IA",
    tagline: "Tu negocio piensa y actúa mientras tú duermes.",
    desc: "Agentes de IA para atención a clientes, calificación de leads y reportes automáticos. La evolución natural cuando tu sistema base ya funciona.",
    entregables: ["Agente de atención a clientes", "Calificación automática de leads", "Reportes semanales con IA"],
    tiempo: "2 semanas",
    badge: "OTC",
    badgeGreen: false,
    ctaHref: "/contacto",
    cta: "Consultar",
  },
];

const ProductGrid = () => {
  return (
    <section id="bloques" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 id="metodologia" className="text-3xl md:text-5xl font-bold text-foreground">
            Cada bloque es un producto.<br />
            <span className="text-primary">Con resultado concreto.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compras lo que necesitas, cuando lo necesitas. Sin suscripciones ocultas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                id={`bloque-${p.num}`}
                className="group relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg flex flex-col"
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-black text-foreground/15">{p.num}</span>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    p.badgeGreen
                      ? "bg-green-500/15 text-green-400 border-green-500/25"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    {p.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-1">{p.name}</h3>
                <p className="text-sm font-medium text-primary mb-3 leading-snug">{p.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>

                {/* Entregables */}
                <ul className="space-y-1 mb-5">
                  {p.entregables.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                      {e}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">⏱ {p.tiempo}</span>
                  <a href={p.ctaHref} id={`cta-bloque-${p.num}`}>
                    <button className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                      p.badgeGreen
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    }`}>
                      {p.cta} →
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
