import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
          🚀 Para emprendedores en LATAM que van en serio
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
          Tu idea merece más que{" "}
          <span className="text-primary">seguir siendo una idea.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Convertimos tu caos mental en un sistema que funciona — bloque a bloque,
          con entregables concretos y resultados medibles. Sin teoría, sin meses de espera.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a href="/diagnostico" id="hero-cta-diagnostico">
            <Button size="lg" className="rounded-full px-8 text-base font-medium gap-2 group shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-105 transition-all">
              Tomar el Radar de Idea — Gratis
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <a href="#bloques" id="hero-cta-bloques">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base font-medium hover:bg-muted transition-all"
            >
              Ver los bloques
            </Button>
          </a>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
          <span className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span> Sin consultoría teórica
          </span>
          <span className="hidden sm:block text-border">|</span>
          <span className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span> Entregables reales en días
          </span>
          <span className="hidden sm:block text-border">|</span>
          <span className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span> Pagos únicos, sin suscripciones sorpresa
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
