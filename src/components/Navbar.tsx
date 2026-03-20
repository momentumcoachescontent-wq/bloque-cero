import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="text-foreground">Bloque</span>
          <span className="text-primary"> Cero</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Servicios
          </a>
          <a href="#metodologia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Metodología
          </a>
          <Button size="sm" className="rounded-full px-5 font-medium">
            Iniciar Diagnóstico
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
