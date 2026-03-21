const Privacidad = () => (
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
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-foreground mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        Política de Privacidad
      </h1>
      <p className="text-muted-foreground text-sm mb-10">Última actualización: Marzo 2026</p>
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Quiénes somos</h2>
          <p>Bloque Cero es una agencia-producto dedicada a convertir ideas de emprendedores en Latinoamérica en Sistemas Mínimos Operables.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Datos que recopilamos</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número de WhatsApp</li>
            <li>Respuestas del diagnóstico (etapa, dolores, disponibilidad)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Cómo usamos tus datos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Para personalizar tu diagnóstico y recomendarte el bloque correcto</li>
            <li>Para contactarte con los resultados por correo o WhatsApp</li>
            <li>Para enviarte info relevante sobre nuestros servicios (puedes darte de baja)</li>
            <li>Para mejorar nuestra plataforma y metodología</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Almacenamiento y seguridad</h2>
          <p>Tus datos se almacenan en Supabase (infraestructura AWS), protegidos con Row-Level Security. No compartimos datos con terceros sin consentimiento explícito.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Tus derechos</h2>
          <p>Puedes acceder, corregir o eliminar tus datos en cualquier momento. Escríbenos a <a href="mailto:hola@bloquecero.com" className="text-primary hover:underline">hola@bloquecero.com</a> — procesamos en 72 horas.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Contacto</h2>
          <p><a href="mailto:hola@bloquecero.com" className="text-primary hover:underline">hola@bloquecero.com</a></p>
        </section>
      </div>
    </main>
    <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
      © 2026 Bloque Cero — <a href="/terminos" className="hover:text-foreground">Términos</a> · <a href="/contacto" className="hover:text-foreground">Contacto</a>
    </footer>
  </div>
);

export default Privacidad;
