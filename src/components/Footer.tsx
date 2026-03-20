const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bloque Cero. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
          <a href="#" className="hover:text-foreground transition-colors">Términos</a>
          <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
