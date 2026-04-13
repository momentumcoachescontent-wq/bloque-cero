---
name: bloque-cero-agentic-methodology
description: Disciplina de desarrollo Spec-First y ciclo de vida agéntico para Bloque Cero.
---

# Bloque Cero Agentic Methodology

Este skill define el estándar de trabajo para las inteligencias que operan sobre el repositorio, asegurando que la velocidad no degrade la arquitectura.

## 1. El Mandamiento Spec-First
Nunca inicies una refactorización de dominio o una nueva integración sin antes documentarla en `docs/knowledge/`.
- **Efecto**: Crea una "Memoria de Arquitectura" que reduce errores de contexto en sesiones futuras.
- **Formato**: Usar `_spec.md` para nuevas piezas y `technical_memory.md` para registrar cambios ejecutables.

## 2. Ciclo de Vida del Cambio
1. **Investigación**: Leer `technical_memory.md` y `domain_glossary.md` antes de escribir código.
2. **Propuesta**: Definir el impacto en el esquema de Supabase y en los workflows de n8n.
3. **Ejecución Lógica**: Implementar tipos y adapters antes de ejecutar migraciones físicas destructivas.
4. **Validación Contextual**: Asegurar que el cambio mantenga la estética "Beyond Fear".

## 3. Componibilidad y Reusabilidad
- Favorecer hooks que operen sobre el modelo canónico (`useBusinessBlueprints`) sobre lecturas directas de tablas heterogéneas.
- Mantener la lógica de negocio en `lib/` y los side-effects en hooks específicos.

## 4. Gobernanza de "Memoria"
- Al terminar un hito importante, actualiza `technical_memory.md`. Es nuestra única defensa contra la deriva conceptual.
