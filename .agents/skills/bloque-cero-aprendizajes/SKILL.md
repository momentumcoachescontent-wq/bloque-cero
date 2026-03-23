---
name: bloque-cero-aprendizajes
description: Patrones arquitectónicos, mitigación de esquemas y UX forjada en Bloque Cero.
---

# Aprendizajes Operativos - Bloque Cero

Este documento captura la memoria institucional y táctica derivada de las intervenciones en el sistema Bloque Cero. Se debe consultar al expandir componentes similares.

## 1. Mitigación de Esquemas (Supabase JSON Payload)
- **El Problema**: Al intentar inyectar nuevas variables (`business_name`) en el insert de la tabla `leads`, el tipado estricto de TypeScript (y la estructura estricta de Postgres) levanta errores de compilación (`Object literal may only specify known properties`).
- **El Patrón de Resiliencia**: Cuando un esquema de tabla en `Supabase` no ha sido actualizado, en lugar de bloquear el desarrollo u obligar una migración inmediata, la información no esquematizada debe introducirse dentro de los campos nativos `JSONB` (como `diagnostic_answers`).
- **Implementación**: 
  - Insertar: `diagnostic_answers: { business_name: string }`
  - Consumir: `lead.diagnostic_answers?.business_name`

## 2. Experiencia de Usuario - Carga Psicológica Efectiva (Wireframing UI)
- **El Problema**: Los overlays totales con un desenfoque (`backdrop-blur`) esconden el valor. El usuario que espera "hasta 7 días" por un Blueprint sentía opacidad y falta de avance ("Cascarón").
- **El Patrón de Resiliencia**: La interfaz debe mostrar el esqueleto (el contorno de lo que viene). Utilizar bordes punteados (`border-dashed border-primary/20`) con animaciones de pulso (`animate-pulse`) sobre fondos tenues, proyectando expectativa estructural en lugar de simple espera pasiva. Nunca cubrir la maqueta principal con avisos opacos.

## 3. Identidad del Proyecto (Ownership UI)
- **El Problema**: Los proyectos abstractos son fáciles de soltar.
- **El Patrón de Resiliencia**: Siempre forzar al usuario a bautizar su propio esfuerzo operativo (ej. *Nombre Clave del Proyecto*). Esto transita la idea de algo gaseoso a un compromiso psicológicamente vinculante.
