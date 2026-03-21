import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

const DashboardLayout = () => {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-xl font-bold text-destructive">Error cargando perfil</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Tu sesión está iniciada pero no pudimos recuperar tu información de perfil. 
          Esto suele ser un error en la base de datos (Ej. Políticas de RLS recursivas).
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 overflow-y-auto w-full">
        <div className="w-full max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
