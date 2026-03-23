import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Target,
  Workflow,
  Sparkles,
  User,
  LogOut,
  Lock,
  FileText,
  Rocket,
  Settings,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const { profile, isPremium, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const blocks = [
    {
      id: "freemium",
      label: "1. Radar de Idea",
      icon: Target,
      path: "/dashboard",
      isLocked: false, // Forzar recálculo en Lovable
    },
    {
      id: "blueprint",
      label: "2. Blueprint Operativo",
      icon: FileText,
      path: "/dashboard/blueprint",
      isLocked: !isPremium && !isAdmin,
    },
    {
      id: "mvp",
      label: "3. MVP de Validación",
      icon: Rocket,
      path: "/dashboard/mvp",
      isLocked: !isPremium && !isAdmin,
    },
    {
      id: "kit",
      label: "4. Kit Operacional",
      icon: Settings,
      path: "/dashboard/kit-operacional",
      isLocked: !isPremium && !isAdmin,
    },
    {
      id: "automas",
      label: "5. Automatización Inicial",
      icon: Workflow,
      path: "/dashboard/automatizaciones",
      isLocked: !isPremium && !isAdmin,
    },
    {
      id: "ia",
      label: "6. Operación IA",
      icon: Brain,
      path: "/dashboard/agentes-ia",
      isLocked: !isPremium && !isAdmin,
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border/50 h-screen fixed left-0 top-0 flex flex-col z-40">
      <div className="p-6">
        <a href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          <span className="text-foreground">Bloque</span>
          <span className="text-primary"> Cero</span>
        </a>
      </div>

      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Mis Bloques
        </p>
        
        {blocks.map((b) => (
          <NavLink
            key={b.id}
            to={b.isLocked ? "#" : b.path}
            onClick={(e) => {
              // Si está bloqueado, redirige visualmente a una pantalla de bloqueo (ideal) o solo avisa
              if (b.isLocked && location.pathname !== b.path) {
                // Dejamos que el enrutador lo mande a /dashboard/:bloque y el componente muestre el candado.
              }
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive && !b.isLocked
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`
            }
          >
            <b.icon className={`w-4 h-4 ${b.isLocked ? "opacity-50" : ""}`} />
            <span className={b.isLocked ? "opacity-50" : ""}>{b.label}</span>
            {b.isLocked && <Lock className="w-3 h-3 ml-auto opacity-50" />}
          </NavLink>
        ))}

        <div className="pt-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Ajustes
          </p>
          <NavLink
            to="/dashboard/perfil"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil Base</span>
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mt-1 ${
                  isActive
                    ? "bg-primary/20 text-primary font-bold"
                    : "text-primary/70 hover:bg-primary/10 hover:text-primary"
                }`
              }
            >
              <Sparkles className="w-4 h-4" />
              <span>Admin Center</span>
            </NavLink>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{profile?.full_name || "Usuario"}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} title="Cerrar Sessión">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
