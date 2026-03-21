import { useState, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, KeyRound } from "lucide-react";

type Step = "email" | "otp";

const Login = () => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Si ya hay sesión activa, redirigir
  if (!isLoading && session) {
    return <Navigate to={from} replace />;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Ingresa un email válido");
      return;
    }
    setIsSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    setIsSending(false);
    if (error) {
      toast.error("Error al enviar el código. Intenta de nuevo.");
      return;
    }
    setStep("otp");
    toast.success("Código enviado a tu correo.");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Ingresa el código completo de 6 dígitos.");
      return;
    }
    setIsVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code,
      type: "email",
    });
    setIsVerifying(false);
    if (error) {
      toast.error("Código incorrecto o expirado. Solicita uno nuevo.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }
    navigate(from, { replace: true });
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
                  Te enviamos un código de acceso de 6 dígitos — sin contraseña.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="login-email"
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
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>
                  ) : (
                    <><Mail className="w-4 h-4 mr-2" />Enviar código de acceso</>
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
              <div className="mb-6">
                <button
                  onClick={() => { setStep("email"); setOtp(["","","","","",""]); }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Volver
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <KeyRound className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">Ingresa tu código</h1>
                    <p className="text-xs text-muted-foreground">Enviado a <span className="font-medium text-foreground">{email}</span></p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Revisa tu bandeja de entrada (y spam). El código expira en 10 minutos.
                </p>
              </div>

              {/* OTP inputs */}
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className="w-11 h-14 text-center text-xl font-bold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                ))}
              </div>

              <Button
                id="btn-verify-otp"
                onClick={handleVerifyOtp}
                disabled={otp.join("").length < 6 || isVerifying}
                className="w-full h-11 rounded-xl font-medium"
              >
                {isVerifying ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verificando...</>
                ) : (
                  "Acceder →"
                )}
              </Button>

              <button
                onClick={() => handleSendOtp(new Event("submit") as unknown as React.FormEvent)}
                className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSending}
              >
                {isSending ? "Enviando..." : "¿No llegó el código? Reenviar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
