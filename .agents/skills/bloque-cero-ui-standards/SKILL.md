---
name: bloque-cero-ui-standards
description: Estética visual, diseño predefinido y mandamientos de frontend para Bloque Cero.
---

# Bloque Cero UX/UI Standards

## Estética "Más Allá del Miedo" (Beyond Fear Aesthetic)
El frontend de Bloque Cero NO es un panel corporativo aburrido. Es una cabina de cristal oscura, un laboratorio táctico y un espacio para inspirar fuerza y estrategia premium.

### 1. Colores y Sombras
- **Modo Oscuro (Default):** El entorno principal es siempre la variante Dark Mode de Tailwind CSS (`bg-background` -> `#0a0a0a` originado por shadcn/ui).
- **Acentos Premium (Neón sutil):** No usar colores primarios planos (azul aburrido, rojo brillante).
  - *Éxito / Aprobado:* Usa `emerald-500` con resplandor suave. (`bg-emerald-500/10 text-emerald-500`)
  - *Alerta / Bloqueos:* Usa `red-500` mezclado elegantemente o `orange-500`.
  - *Agilidad / Radares:* Usa el Cyan/`primary` del sistema para las acciones ordinarias.
  - *Blueprints / Premium:* Usa la gama morada `purple-500` o fucsia para destilar elitismo en las líneas avanzadas.

### 2. Componentes (Shadcn UI + Tailwind)
- Siempre favorecer los componentes importados de la carpeta `@/components/ui/` cuando existan (`Button`, `Card`, `Badge`, `Slider`, `Toast`, `Progress`).
- No utilizar frameworks de CSS externos o CSS plano. **TailwindCSS 100%.**
- Bordes: Siempre sutiles (`border-border/50` o `border-white/10`).
- Sombras Invertidas (`shadow-inner`, `mix-blend-screen`): Utilizar estos efectos para dar la sensación de iluminación de vidrio (Glassmorphism), especialmente dentro de contenedores activos.

### 3. Iconografía y Tipografía
- Exclusivamente **Lucide React**. Usa íconos semánticamente (ej: `Zap` para Blueprints, `Target` para Radares). Emparejar íconos con títulos utilizando tamaño constante (w-4 h-4 o w-5 h-5).
- Nunca renderizar tablas HTML crudas y feas. Usar paddings amplios (`px-6 py-4`), cabeceras en mayúsculas (`text-xs uppercase tracking-wider`) y texto gris secundario (`text-muted-foreground`) para jerarquía visual.

### 4. Animaciones y Entradas
- Todo nuevo elemento que se dibuje en pantalla debe transicionar suavemente.
- Utilizar prefijos como `transition-all duration-300` o clases de keyframes nativos (`animate-in fade-in slide-in-from-top-4 string`) para filas expandibles o notificaciones.
- Los menús y acordeones NUNCA deben saltar de golpe, deben revelarse orgánicamente.
