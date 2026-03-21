const Terminos = () => (
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
        Términos y Condiciones
      </h1>
      <p className="text-muted-foreground text-sm mb-10">Última actualización: Marzo 2026</p>
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Aceptación</h2>
          <p>Al usar bloquecero.com aceptas estos Términos. Si no estás de acuerdo, no uses la plataforma.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Descripción del servicio</h2>
          <p>Bloque Cero ofrece consultoría práctica y entregables digitales para emprendedores. Cada servicio tiene un alcance definido en la descripción de bloque.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Pagos y reembolsos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>El Radar de Idea es gratuito.</li>
            <li>Los bloques OTC se pagan en su totalidad antes de iniciar.</li>
            <li>No hacemos reembolsos una vez iniciado el trabajo, salvo incumplimiento comprobable.</li>
            <li>En caso de disputa, buscamos resolución directa antes de cualquier proceso formal.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Propiedad intelectual</h2>
          <p>El cliente es dueño de los entregables de su proyecto. Bloque Cero puede mostrar el trabajo como caso de estudio sin revelar información confidencial.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Limitación de responsabilidad</h2>
          <p>No garantizamos resultados comerciales específicos. Los resultados dependen de la ejecución del cliente.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Contacto</h2>
          <p><a href="mailto:hola@bloquecero.com" className="text-primary hover:underline">hola@bloquecero.com</a></p>
        </section>
      </div>
    </main>
    <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
      © 2026 Bloque Cero — <a href="/privacidad" className="hover:text-foreground">Privacidad</a> · <a href="/contacto" className="hover:text-foreground">Contacto</a>
    </footer>
  </div>
);

export default Terminos;
