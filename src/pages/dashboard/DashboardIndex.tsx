import { useAuth } from "@/hooks/useAuth";

const DashboardIndex = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {profile?.full_name?.split(" ")[0] || "Emprendedor"}</h1>
        <p className="text-muted-foreground mt-1">
          Aquí podrás consultar y gestionar tus análisis y diagnóstico.
        </p>
      </div>

      {/* Tarjeta del Freemium: Histórico de Diagnóstico */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Mi Radar de Idea (Diagnóstico)</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Consulta tu evaluación base y la factibilidad calculada por nuestro motor especializado.
        </p>
        
        <div className="bg-muted/50 rounded-xl p-8 text-center border border-dashed border-border">
          {/* Aquí cargaremos el ultimo lead del cliente usando su email o ID */}
          <p className="text-sm text-muted-foreground mb-4">
            Estamos sincronizando tu historial de diagnósticos...
          </p>
          <p className="text-xs opacity-50">
            Próximamente: Historial en vivo y generación de PDF.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;
