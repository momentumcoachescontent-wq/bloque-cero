import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send, MessageCircle, Mail } from "lucide-react";

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    setEnviando(true);
    // TODO Fase 3: integrar con n8n webhook
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setEnviado(true);
    toast.success("¡Mensaje recibido! Te respondemos en menos de 24 horas.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            <span className="text-foreground">Bloque</span>
            <span className="text-primary"> Cero</span>
          </a>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Volver</a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-foreground mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Hablemos
          </h1>
          <p className="text-muted-foreground">
            ¿Tienes una pregunta o quieres cotizar un bloque? Respondemos en menos de 24 horas.
          </p>
        </div>

        {/* Quick options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <a
            href="https://wa.me/521234567890"
            id="contact-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-4 hover:bg-green-500/15 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Respuesta rápida</p>
            </div>
          </a>
          <a
            href="mailto:hola@bloquecero.com"
            id="contact-email"
            className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-4 hover:bg-primary/15 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p className="text-xs text-muted-foreground">hola@bloquecero.com</p>
            </div>
          </a>
        </div>

        {enviado ? (
          <div className="bg-card border border-border/50 rounded-3xl p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-foreground mb-2">¡Mensaje enviado!</h2>
            <p className="text-muted-foreground text-sm">
              Te respondemos en menos de 24 horas al correo{" "}
              <span className="font-medium text-foreground">{form.email}</span>.
            </p>
            <button
              onClick={() => { setEnviado(false); setForm({ nombre: "", email: "", mensaje: "" }); }}
              className="mt-6 text-sm text-primary hover:underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form
            id="contact-form"
            onSubmit={handleSubmit}
            className="bg-card border border-border/50 rounded-3xl p-8 space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="contact-nombre">Tu nombre *</Label>
              <Input
                id="contact-nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Tu email *</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-mensaje">¿En qué podemos ayudarte? *</Label>
              <textarea
                id="contact-mensaje"
                placeholder="Cuéntanos sobre tu idea o el bloque que te interesa..."
                value={form.mensaje}
                onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={enviando}>
              {enviando ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />Enviar mensaje</>
              )}
            </Button>
          </form>
        )}
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        © 2026 Bloque Cero — <a href="/privacidad" className="hover:text-foreground">Privacidad</a> · <a href="/terminos" className="hover:text-foreground">Términos</a>
      </footer>
    </div>
  );
};

export default Contacto;
