

## Bloque Cero — Landing Page

Una landing page oscura, futurista y minimalista para la agencia "Bloque Cero".

### Diseño
- **Tema oscuro** con fondo `zinc-950`, texto blanco/gris claro
- **Color acento**: cian/azul eléctrico (`cyan-400`/`cyan-500`) solo para CTAs y elementos interactivos
- **Tipografía**: limpia, grande, con mucho whitespace
- **Animaciones sutiles**: fade-in al scroll, hover con brillo en bordes

### Secciones

1. **Navbar** — Logo "Bloque Cero" a la izquierda, enlaces "Servicios", "Metodología" y botón "Iniciar Diagnóstico" con acento cian

2. **Hero** — Titular grande centrado con el eslogan, subtítulo sobre micro-MVPs para LATAM, botón CTA "Descubre cómo empezar"

3. **Catálogo "La Escalera de Bloques"** — Grid de 6 tarjetas minimalistas con borde sutil y efecto hover (glow cian):
   - Radar de Idea, Blueprint de Negocio, MVP de Validación, Kit Operacional 1.0, Automatización Inicial, Operación Inteligente (IA)

4. **Stack Tecnológico** — Sección limpia: "Powered by Supabase, Cloudflare & n8n" con iconos/texto simple

5. **Footer** — Links básicos + copyright Bloque Cero

### Arquitectura
- Componentes modulares: `Navbar`, `HeroSection`, `ProductGrid`, `TechStack`, `Footer`
- CSS variables actualizadas para dark mode por defecto
- Preparado para conexión futura con Supabase

