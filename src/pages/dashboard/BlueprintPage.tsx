import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { ArrowRight, LayoutTemplate, Calculator, FileText, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function BlueprintPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [blueprintData, setBlueprintData] = useState<any>(null);
  const [hasLead, setHasLead] = useState(false);

  useEffect(() => {
    const fetchBlueprint = async () => {
      if (!profile?.email) return;
      
      try {
        setLoading(true);
        // Traer el último lead del usuario
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("email", profile.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 es not found

        if (data) {
          setHasLead(true);
          // Si ya existe data inyectada por n8n o similar
          if (data.blueprint_data) {
            setBlueprintData(data.blueprint_data);
          }
        }
      } catch (error: any) {
        toast.error("Error al cargar el Blueprint: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprint();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Sincronizando el Blueprint de tu negocio...</p>
      </div>
    );
  }

  // Estado: Usuario sin diagnóstico previo
  if (!hasLead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <LayoutTemplate className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Falta el Paso Cero</h2>
        <p className="text-muted-foreground">
          Para generar la maqueta operativa de tu negocio, primero debes pasar por el Radar de Idea.
        </p>
        <Button onClick={() => window.location.href = "/diagnostico"}>
          Iniciar Diagnóstico
        </Button>
      </div>
    );
  }

  // Estado: El lead existe, pero el webhook de n8n aún no ha poblado `blueprint_data`
  if (!blueprintData) {
    const injectMockData = () => {
      setBlueprintData({
        executive_summary: "Este es un proyecto hipotético generado para validar la Interfaz y experiencia (MVP). La IA de Más Allá del Miedo detectó que tienes un margen de mejora brutal si apalancas componentes asíncronos en tu servicio B2B.",
        canvas: {
          problem: "Altos costos operativos en agencias B2B tradicionales.",
          solution: "Un servicio paquetizado guiado por inteligencia artificial.",
          key_metrics: "Cost of Delivery, MRR Mensual.",
          unique_value_proposition: "Resultados de agencia a costo de SaaS.",
          unfair_advantage: "Metodología patentada de ejecución Cero.",
          channels: "LinkedIn Inbound, Cold Emailing.",
          customer_segments: "Fundadores B2B de +$10k MRR.",
          early_adopters: "Agencias en transición a producto.",
          cost_structure: "Software, IA, Ops ligeros ($500/mo).",
          revenue_streams: "Suscripción $1,500/mo."
        },
        unit_economics: {
          suggested_cac: 250,
          projected_ltv: 4500,
          gross_margin: "82%"
        }
      });
    };

    return (
      <div className="bg-card border border-border/50 rounded-2xl p-10 text-center max-w-2xl mx-auto mt-10 shadow-sm relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        {/* Loader Animado en vez de Candado para quitar la idea de bloqueo */}
        <div className="mx-auto flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Tu Blueprint está en producción</h2>
        <p className="text-muted-foreground mb-8">
          Nuestra inteligencia está estructurando el Business Model Canvas, calculando tus Unit Economics y redactando el manifiesto de tu proyecto. Te notificaremos cuando el entregable esté listo (webhook n8n).
        </p>

        <Button onClick={injectMockData} variant="outline" className="mb-8 border-primary/20 hover:bg-primary/5">
          <LayoutTemplate className="w-4 h-4 mr-2" />
          Inyectar Demo Visual (Mock)
        </Button>
        
        {/* Mockup visualizador */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-40 grayscale pointer-events-none select-none">
          <div className="bg-muted p-4 rounded-lg h-24 border border-border/50"></div>
          <div className="bg-muted p-4 rounded-lg h-24 border border-border/50"></div>
          <div className="bg-muted p-4 rounded-lg h-24 border border-border/50"></div>
          <div className="bg-muted p-4 rounded-lg h-24 border border-border/50 md:col-span-3"></div>
        </div>
      </div>
    );
  }

  // Estado: Blueprint Listo
  const { canvas, unit_economics, executive_summary } = blueprintData;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Blueprint Operativo</h1>
          <p className="text-muted-foreground max-w-2xl">
            La estructura central de tu negocio. Hemos convertido el caos en un modelo lógico, rentable y accionable.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Descargar PDF
        </Button>
      </div>

      {/* Resumen Ejecutivo */}
      {executive_summary && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Visión General</h3>
          <p className="text-sm leading-relaxed">{executive_summary}</p>
        </div>
      )}

      {/* Lean Canvas Estructurado */}
      {canvas && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary" />
            Model Canvas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Columna 1 */}
            <div className="space-y-4 md:col-span-1 border border-border/50 rounded-xl p-4 bg-muted/10">
              <div>
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Problema</h4>
                <p className="text-sm">{canvas.problem || "No definido"}</p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Alternativas</h4>
                <p className="text-sm">{canvas.alternatives || "Competencia directa y status quo."}</p>
              </div>
            </div>
            {/* Columna 2 */}
            <div className="space-y-4 md:col-span-1 border border-border/50 rounded-xl p-4 bg-muted/10">
              <div>
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Solución</h4>
                <p className="text-sm">{canvas.solution || "No definido"}</p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Métricas Clave</h4>
                <p className="text-sm">{canvas.key_metrics || "No definido"}</p>
              </div>
            </div>
            {/* Columna 3 (Central) */}
            <div className="md:col-span-1 border-2 border-primary/20 rounded-xl p-4 bg-primary/5 shadow-sm">
              <h4 className="font-bold text-sm mb-2 uppercase tracking-wider text-primary">Propuesta Única de Valor</h4>
              <p className="text-sm font-medium leading-relaxed">{canvas.unique_value_proposition || "No definido"}</p>
            </div>
            {/* Columna 4 */}
            <div className="space-y-4 md:col-span-1 border border-border/50 rounded-xl p-4 bg-muted/10">
              <div>
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Ventaja Injusta</h4>
                <p className="text-sm">{canvas.unfair_advantage || "No definido"}</p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Canales</h4>
                <p className="text-sm">{canvas.channels || "No definido"}</p>
              </div>
            </div>
            {/* Columna 5 */}
            <div className="md:col-span-1 border border-border/50 rounded-xl p-4 bg-muted/10">
              <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Segmento de Clientes</h4>
              <p className="text-sm">{canvas.customer_segments || "No definido"}</p>
              <div className="pt-4 mt-4 border-t border-border/50">
                <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Early Adopters</h4>
                <p className="text-sm">{canvas.early_adopters || "No definido"}</p>
              </div>
            </div>
          </div>
          
          {/* Fila Inferior del Canvas (Finanzas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border/50 rounded-xl p-4 bg-muted/10">
              <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Estructura de Costos</h4>
              <p className="text-sm">{canvas.cost_structure || "No definido"}</p>
            </div>
            <div className="border border-border/50 rounded-xl p-4 bg-muted/10">
              <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Flujos de Ingreso</h4>
              <p className="text-sm">{canvas.revenue_streams || "No definido"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Unit Economics */}
      {unit_economics && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Unit Economics Estimados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Costo Adq. Cliente (CAC)</p>
              <p className="text-3xl font-black text-red-500/90">${unit_economics.suggested_cac}</p>
              <p className="text-xs text-muted-foreground mt-2">Costo máximo sugerido para captar 1 cliente.</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Life Time Value (LTV)</p>
              <p className="text-3xl font-black text-green-500/90">${unit_economics.projected_ltv}</p>
              <p className="text-xs text-muted-foreground mt-2">Ingreso proyectado en el ciclo de vida.</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Margen Bruto</p>
              <p className="text-3xl font-black text-primary/90">{unit_economics.gross_margin}</p>
              <p className="text-xs text-muted-foreground mt-2">Rentabilidad directa por cada venta.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Call to action hacia el siguiente paso */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
        <div>
          <h3 className="text-lg font-bold mb-1">El modelo está claro. Ahora, a construir.</h3>
          <p className="text-sm text-muted-foreground">
            El siguiente paso lógico es aterrizar esta maqueta en un Producto Mínimo Viable (MVP) que podamos lanzar en 15 días o menos.
          </p>
        </div>
        <Button onClick={() => window.location.href = "/dashboard/mvp"} className="whitespace-nowrap gap-2 shrink-0">
          Ver Bloque de MVP <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
