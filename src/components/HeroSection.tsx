import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
          Convertimos tu idea en un{" "}
          <span className="text-primary">sistema mínimo operable</span>.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Diseñamos micro-MVPs y automatizaciones base para emprendedores en LATAM.
          Sal del caos y lanza tu negocio con estructura.
        </p>

        <div className="pt-4">
          <Button size="lg" className="rounded-full px-8 text-base font-medium gap-2 group">
            Descubre cómo empezar
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
