const DOWNLOADS = [
  {
    id: "blueprint-template",
    icon: "📋",
    title: "Plantilla Blueprint Express",
    description: "Canvas en PDF para estructurar tu idea de negocio en 1 hora. Propuesta de valor, segmento, canales y modelo de ingresos.",
    format: "PDF · 2 páginas",
  },
  {
    id: "risk-map",
    icon: "⚠️",
    title: "Mapa Rápido de Riesgos",
    description: "Hoja de trabajo para identificar y calificar riesgos críticos antes de invertir tiempo o dinero. Incluye ejemplos de mitigación.",
    format: "PDF · 1 página",
  },
  {
    id: "automation-flows",
    icon: "🔄",
    title: "Flujos de Automatización",
    description: "Guía visual de los flujos más efectivos para etapa temprana: bienvenida de leads, seguimiento y notificaciones internas.",
    format: "PDF · 4 páginas",
  },
];

const DownloadsSection = () => {
  const handleDownload = (title: string) => {
    alert(`El archivo "${title}" estará disponible muy pronto. Inicia tu Blueprint de Negocio y te avisamos.`);
  };

  return (
    <section
      id="recursos"
      className="py-24 px-6 border-t border-border/30"
      aria-label="Recursos descargables"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-green-400 font-medium">Recursos gratuitos</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Herramientas que puedes usar{" "}
            <span className="text-green-400">ahora mismo.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Formatos, plantillas y diagramas de nuestra metodología. Descárgalos sin registrarte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOWNLOADS.map((item) => (
            <div
              key={item.id}
              id={`download-${item.id}`}
              className="group bg-card border border-border/50 rounded-2xl p-6 flex flex-col hover:border-green-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <span className="w-fit text-xs font-bold px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 mb-3">
                GRATIS
              </span>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{item.description}</p>
              <p className="text-xs text-muted-foreground mb-4 font-mono">📄 {item.format}</p>
              <button
                id={`btn-download-${item.id}`}
                onClick={() => handleDownload(item.title)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-semibold text-sm hover:bg-green-500/20 transition-all"
              >
                <span>↓</span> Descargar gratis
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Se actualizan periódicamente.{" "}
          <a href="/blueprint-info" className="text-primary hover:underline font-medium">
            Inicia tu Blueprint de Negocio
          </a>{" "}
          y te avisamos cuando haya nuevos recursos.
        </p>
      </div>
    </section>
  );
};

export default DownloadsSection;
