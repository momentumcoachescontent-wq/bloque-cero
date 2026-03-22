// ─── TestimonialsSection.tsx ─────────────────────────────────────────────
// Sección de evidencia: casos de uso con estructura Antes → Bloque → Después

const CASES = [
  {
    id: "caso-01",
    before: "Llevaba 8 meses pensando en mi idea de marketplace sin dar el primer paso. Mi mayor miedo: no saber si el mercado la quería.",
    bloque: "Radar de Idea",
    after: "A las 48hrs tenía una matriz de riesgo clara. El análisis mostró que sí había demanda pero en un nicho diferente. Pivoteé antes de gastar un peso.",
    persona: "Fernanda G.",
    role: "Emprendedora, Guadalajara",
    result: "Validó y pivoteó antes de construir",
    emoji: "🎯",
  },
  {
    id: "caso-02",
    before: "Tenía clientes pero todo era caos — WhatsApp, hojas de Excel, notas en papel. Perdía ventas porque no tenía un proceso.",
    bloque: "Kit Operacional 1.0",
    after: "En una semana tenía un CRM funcional, flujos de bienvenida automáticos y un embudo que capturaba leads mientras dormía.",
    persona: "Rodrigo M.",
    role: "Consultor independiente, CDMX",
    result: "+40% en leads capturados el primer mes",
    emoji: "⚙️",
  },
  {
    id: "caso-03",
    before: "Invertí 3 meses y $15,000 pesos en una app que nadie usó. No había validado si había demanda real.",
    bloque: "MVP de Validación",
    after: "Con el blueprint y el MVP construido en 15 días conseguimos los primeros 3 clientes de pago antes de tener el producto terminado.",
    persona: "Alejandro T.",
    role: "Fundador SaaS, Monterrey",
    result: "3 clientes pagando antes del lanzamiento",
    emoji: "🚀",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="casos"
      className="py-24 px-6 border-t border-border/30"
      aria-label="Casos de uso"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium">Evidencia real</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Del caos al sistema.{" "}
            <span className="text-primary">Historias similares a las tuyas.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Patrones reales que vemos en emprendedores antes y después de trabajar con nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {CASES.map((c) => (
            <article
              key={c.id}
              id={c.id}
              className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col hover:border-primary/30 transition-colors"
            >
              <div className="text-3xl mb-4">{c.emoji}</div>

              <div className="mb-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Antes</span>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed italic">"{c.before}"</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-px h-8 bg-primary/30" />
                <div>
                  <span className="text-xs font-bold text-primary">Bloque aplicado:</span>
                  <p className="text-sm font-semibold text-foreground">{c.bloque}</p>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Después</span>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{c.after}</p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 mb-4">
                <p className="text-xs font-bold text-green-400">📈 {c.result}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                  {c.persona.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.persona}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">¿Quieres ser el próximo caso de éxito?</p>
          <a href="/diagnostico" id="casos-cta">
            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
              Tomar el Radar de Idea — Es Gratis
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
