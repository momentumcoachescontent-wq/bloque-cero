import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { session, profile, isLoading, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          <span className="text-foreground">Bloque</span>
          <span className="text-primary"> Cero</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#bloques" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Bloques
          </a>
          <a href="#casos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Casos
          </a>

          {/* CTA dinámico: si hay sesión → ir al dashboard, si no → diagnóstico */}
          {!isLoading && (
            session ? (
              <div className="flex items-center gap-2">
                <a href="/dashboard">
                  <Button size="sm" variant="outline" className="rounded-full px-5 font-medium gap-2 hover:bg-muted transition-colors">
                    <User className="w-3.5 h-3.5" />
                    {profile?.full_name?.split(" ")[0] || "Mi Panel"}
                  </Button>
                </a>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => signOut()}
                  className="rounded-full w-9 h-9 p-0 text-muted-foreground hover:text-destructive transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <LogIn className="w-3.5 h-3.5" />
                  Acceder
                </a>
                <a href="/diagnostico">
                  <Button size="sm" className="rounded-full px-5 font-medium">
                    Iniciar Diagnóstico
                  </Button>
                </a>
              </div>
            )
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="w-28 h-8 bg-muted rounded-full animate-pulse" />
          )}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden">
          <a href="/diagnostico">
            <Button size="sm" className="rounded-full px-4 font-medium text-xs">
              Diagnóstico
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
