import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Zap, Unlock, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PremiumBlockProps {
  title: string;
  description: string;
  priceTag?: string;
  features: string[];
}

const PremiumBlock = ({ title, description, priceTag = "Consulta disponibilidad", features }: PremiumBlockProps) => {
  const { isPremium, isAdmin } = useAuth();
  
  // Si el usuario es administrador o premium, se salta el Paywall y ve el módulo activo.
  if (isPremium || isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background shadow-lg mb-2 relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <Unlock className="w-8 h-8 text-primary relative z-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight text-primary">{title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed px-4">
            Tienes acceso total a este módulo.
          </p>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-2xl p-10 w-full mt-6 flex flex-col items-center">
          <Wrench className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Workspace Preparado</h2>
          <p className="text-sm text-muted-foreground w-3/4 mx-auto">
            La funcionalidad del <strong>{title}</strong> está siendo conectada al motor de Inteligencia Artificial. Los entregables y herramientas aparecerán aquí automáticamente.
          </p>
        </div>
      </div>
    );
  }

  // Vista de Candado (Paywall) para usuarios Freemium
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      
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
