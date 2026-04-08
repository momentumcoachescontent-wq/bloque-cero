import DiagnosticForm from "@/components/DiagnosticForm";
import Navbar from "@/components/Navbar";

const Diagnostic = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="relative pt-28 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              Inicio rápido · 2 minutos
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              Blueprint de Negocio
            </h1>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              Cuéntanos tu idea o negocio y te diremos qué arquitectura mínima necesitas, qué tan viable es y cuál debe ser tu siguiente bloque.
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
            <DiagnosticForm />
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Sin spam. Tus datos se usan solo para estructurar tu Blueprint de Negocio.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Diagnostic;
