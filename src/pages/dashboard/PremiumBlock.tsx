import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Zap } from "lucide-react";

interface PremiumBlockProps {
  title: string;
  description: string;
  priceTag?: string;
  features: string[];
}

const PremiumBlock = ({ title, description, priceTag = "Consulta disponibilidad", features }: PremiumBlockProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto space-y-8">
      
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border-4 border-background shadow-xl mb-4 relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Lock className="w-8 h-8 text-muted-foreground relative z-10" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="bg-card border border-primary/20 p-8 rounded-3xl shadow-sm w-full relative overflow-hidden text-left mt-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Zap className="w-32 h-32" />
        </div>
        
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          ¿Qué incluye este bloque?
        </h3>
        
        <ul className="space-y-4 mb-8">
          {features.map((feat, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground">
              <span className="text-primary mt-0.5">✓</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Inversión OTC</p>
            <p className="text-2xl font-black">{priceTag}</p>
          </div>
          <Button size="lg" className="rounded-full shadow-md font-bold text-md px-8 h-14">
            Desbloquear Bloque <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumBlock;
