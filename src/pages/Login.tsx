import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

type Step = "email" | "sent";

const Login = () => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Si ya hay sesión activa, redirigir
  if (!isLoading && session) {
    return <Navigate to={from} replace />;
  }

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Ingresa un email válido");
      return;
    }

    setIsSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setIsSending(false);

    if (error) {
      toast.error("Error al enviar el link. Intenta de nuevo.");
      return;
    }

    setStep("sent");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            <span className="text-foreground">Bloque</span>
            <span className="text-primary"> Cero</span>
          </span>
        </a>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
          {step === "email" ? (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-foreground mb-1">Accede a tu panel</h1>
                <p className="text-sm text-muted-foreground">
                  Te enviamos un enlace mágico a tu correo — sin contraseña.
                </p>
              </div>

              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    className="h-11"
                    disabled={isSending}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl font-medium"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar enlace mágico
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                ¿Aún no eres cliente?{" "}
                <a href="/diagnostico" className="text-primary hover:underline font-medium">
                  Inicia tu diagnóstico
                </a>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Revisa tu correo</h2>
                  <p className="text-sm text-muted-foreground">
                    Enviamos un enlace a{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    El enlace expira en 10 minutos. Revisa también tu carpeta de spam.
                  </p>
                </div>

                <button
                  onClick={() => setStep("email")}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Usar otro correo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
