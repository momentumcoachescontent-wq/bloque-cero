import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Target,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LayoutTemplate
} from "lucide-react";

const SCOPE_ITEMS = [
  {
    title: "Scoring y Viabilidad",
    desc: "Lectura inicial del caso, complejidad estimada y riesgos principales para decidir con claridad.",
    icon: TrendingUp
  },
  {
    title: "Propuesta de Valor y Diferenciación",
    desc: "Definición del núcleo de valor que debe sostener tu negocio y hacerlo difícil de copiar.",
    icon: ShieldCheck
  },
  {
    title: "Ruta de Siguiente Bloque",
    desc: "Recomendación clara sobre si debes validar, ordenar operación o automatizar primero.",
    icon: Target
  },
  {
    title: "Arquitectura Mínima",
    desc: "Mapa del sistema mínimo que necesitas para no improvisar desde el primer mes.",
    icon: LayoutTemplate
  }
];

const USE_CASES = [
  {
    title: "El consultor saturado",
    problem: "Vendía bien, pero operaba todo entre mensajes, notas y seguimiento manual. No tenía sistema.",
    solution: "El Blueprint de Negocio mostró su arquitectura mínima, su prioridad operativa y el siguiente bloque correcto para ordenar la operación.",
    result: "Más claridad, menos improvisación"
  },
  {
    title: "La idea sin estructura",
    problem: "Tenía una idea de SaaS, pero no sabía si debía construir, validar o replantear antes de gastar dinero.",
    solution: "El Blueprint de Negocio absorbió el diagnóstico inicial y lo convirtió en una ruta clara hacia un MVP de validación.",
    result: "Decisión correcta antes de construir"
  }
];

export default function BlueprintLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20">
            Bloque 01 · Blueprint de Negocio
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Blueprint de Negocio:<br />
            <span className="text-primary italic">el punto de entrada para entender qué construir primero.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Absorbe el diagnóstico inicial, estructura tu caso y te dice con claridad si debes validar, ordenar operación o automatizar. Menos intuición suelta, más ruta accionable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-bold gap-2" onClick={() => window.location.href='/diagnostico'}>
              Comenzar Blueprint <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold border-primary/20 hover:bg-primary/5" onClick={() => {
              document.getElementById('alcance')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver Alcance
            </Button>
          </div>
        </div>
      </section>

      <section id="alcance" className="py-24 px-6 bg-muted/20 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Qué obtienes al iniciar</h2>
              <p className="text-muted-foreground mb-8">
                Blueprint de Negocio ya no es un paso posterior al radar. Es el punto de entrada visible para leer tu caso, darle estructura y recomendar el siguiente bloque correcto.
              </p>
              <div className="space-y-4">
                {[
                  "Lectura inicial de viabilidad y complejidad",
                  "Análisis estructurado del caso",
                  "Recomendación del siguiente bloque",
                  "Base para MVP, operación o automatización"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SCOPE_ITEMS.map((item, i) => (
                <div key={i} className="bg-card border border-border/50 p-6 rounded-2xl hover:border-primary/30 transition-all group">
                  <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Quién necesita un Blueprint de Negocio?</h2>
            <p className="text-muted-foreground">Casos típicos donde el problema no es falta de ganas, sino falta de estructura.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {USE_CASES.map((caso, i) => (
              <div key={i} className="bg-muted/10 border border-border/30 rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-primary">{caso.title}</h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">El Desafío</span>
                    <p className="text-sm italic text-foreground/80">"{caso.problem}"</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">La Solución</span>
                    <p className="text-sm text-foreground/90">{caso.solution}</p>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm font-bold text-green-400">Resultado: {caso.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-primary border border-primary shadow-2xl shadow-primary/20 rounded-3xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">¿Listo para dejar de improvisar?</h2>
          <p className="text-primary-foreground/80 mb-10 text-lg relative z-10">
            Inicia tu Blueprint de Negocio y obtén una lectura clara de qué tan viable es tu caso y qué bloque sigue después.
          </p>
          <div className="relative z-10 flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-neutral-100 rounded-full px-10 h-14 text-lg font-black shadow-xl"
              onClick={() => window.location.href='/diagnostico'}
            >
              Comenzar ahora
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
