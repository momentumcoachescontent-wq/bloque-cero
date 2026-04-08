# Blueprint Lifecycle — Bloque Cero

## Propósito
Definir el lifecycle canónico de **Blueprint de Negocio** mientras el sistema mantiene compatibilidad transitoria con las tablas heredadas `leads` y `blueprint_requests`.

## Principio rector
Aunque el almacenamiento actual sigue separado, el producto debe entenderse como un solo flujo:

1. **Blueprint Intake**
2. **Blueprint Delivery**
3. **Conversión al siguiente bloque**

## Etapas canónicas

### 1. captured
El caso fue capturado desde la experiencia pública de Blueprint de Negocio.

**Representación actual:**
- registro inicial en `leads`

### 2. scored
El intake fue evaluado y ya tiene score, complejidad, riesgos y recomendación base.

**Representación actual:**
- `leads.score`
- `leads.diagnostic_answers`

### 3. expanded
El caso avanzó a profundización estratégica.

**Representación actual:**
- inicio de `blueprint_requests`
- respuestas extendidas del Deep Diagnostic

### 4. queued_for_delivery
La entrega extendida ya fue solicitada y está en procesamiento.

**Representación actual:**
- `blueprint_requests.status = analyzing`
- `progress_day < 7`

### 5. delivered
Los entregables del Blueprint están listos o entregados.

**Representación actual:**
- `progress_day >= 7`
- o `status = completed`

### 6. converted_to_next_block
El caso avanzó a MVP, operación, automatización u otro bloque siguiente.

**Representación actual:**
- aún no formalizada consistentemente

## Mapeo temporal del dominio

| Concepto de producto | Representación actual |
|---|---|
| Blueprint Intake | `leads` |
| Blueprint Delivery | `blueprint_requests` |
| Caso unificado de Blueprint | agregación lógica entre ambas |

## Regla de implementación
Hasta que exista una entidad consolidada, toda interfaz interna debe tratar `leads` como **Blueprint Intake** y `blueprint_requests` como **Blueprint Delivery**.

## Consecuencia para fases siguientes
La Fase 3A opera con este lifecycle lógico. La Fase 3B podrá migrar a una entidad consolidada cuando:
- el naming interno ya esté estabilizado
- el admin ya lea el caso unificado
- los payloads externos ya no dependan del concepto Radar
