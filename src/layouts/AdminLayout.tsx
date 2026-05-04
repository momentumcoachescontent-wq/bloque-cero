import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Users, Activity, Settings, LogOut, ArrowLeft, CheckCircle2, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { session, profile, isAdmin, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-xl font-bold text-destructive">Error cargando perfil Admin</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Tu sesión está iniciada pero no pudimos recuperar tu información de perfil.
        </p>
        <Button onClick={() => window.location.reload()}>
          Reintentar conexión
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const navLinks = [
    { title: "Resumen Global", icon: Activity, path: "/admin" },
    { title: "Control de Entregables", icon: CheckCircle2, path: "/admin/fulfillment" },
    { title: "Inventario Blueprints", icon: FileSearch, path: "/admin/blueprints" },
    { title: "Gestión de Usuarios", icon: Users, path: "/admin/usuarios" },
    { title: "Métricas & Tests", icon: Settings, path: "/admin/sistema" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-card border-r border-border/50 h-screen fixed left-0 top-0 flex flex-col z-40 shadow-sm">
        <div className="p-6 border-b border-border/50">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Admin Center
          </div>
          <a href="/" className="text-xl font-bold tracking-tight block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            <span className="text-foreground">Bloque</span>
            <span className="text-primary"> Cero</span>
          </a>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              end={l.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`
              }
            >
              <l.icon className="w-4 h-4" />
              <span>{l.title}</span>
            </NavLink>
          ))}
          
          <div className="pt-8">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a App Cliente</span>
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-border/50 bg-muted/10">
          <div className="flex items-center justify-between px-2">
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-primary uppercase">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} title="Cerrar Sessión">
              <LogOut className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Area principal */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto w-full">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
