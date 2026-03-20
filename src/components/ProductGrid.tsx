import { Lightbulb, FileText, Rocket, Settings, Zap, Brain } from "lucide-react";

const products = [
  { name: "Radar de Idea", desc: "Evalúa la viabilidad de tu idea con un diagnóstico rápido y estructurado.", icon: Lightbulb },
  { name: "Blueprint de Negocio", desc: "Documenta tu modelo de negocio en un formato claro y accionable.", icon: FileText },
  { name: "MVP de Validación", desc: "Construye un prototipo funcional para validar tu propuesta con usuarios reales.", icon: Rocket },
  { name: "Kit Operacional 1.0", desc: "Implementa las herramientas básicas para operar tu negocio desde el día uno.", icon: Settings },
  { name: "Automatización Inicial", desc: "Conecta tus procesos clave con flujos automatizados que ahorran tiempo.", icon: Zap },
  { name: "Operación Inteligente (IA)", desc: "Integra inteligencia artificial para escalar decisiones y optimizar operaciones.", icon: Brain },
];

const ProductGrid = () => {
  return (
    <section id="servicios" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium">Metodología</p>
          <h2 id="metodologia" className="text-3xl md:text-5xl font-bold text-foreground">
            La Escalera de Bloques
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="group relative rounded-xl border border-border bg-card p-7 transition-all duration-300 hover:border-primary/40 hover:glow-cyan"
              >
                <Icon className="w-5 h-5 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
