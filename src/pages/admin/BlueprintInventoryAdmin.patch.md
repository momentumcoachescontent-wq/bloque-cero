# Patch para `src/pages/admin/BlueprintInventoryAdmin.tsx`

## 1) Agrega este import junto a los imports existentes

```ts
import { createBlueprintBig6MetadataPatch } from "@/lib/blueprintBig6Report";
```

Debe quedar cerca de:

```ts
import { Button } from "@/components/ui/button";
import { createBlueprintBig6MetadataPatch } from "@/lib/blueprintBig6Report";
import { supabase } from "@/lib/supabase";
```

---

## 2) Elimina por completo la función antigua `createQaMarkdown`

Borra todo este bloque:

```ts
const createQaMarkdown = (item: BlueprintInventoryItem) => {
  ...
};
```

---

## 3) Agrega esta función en su lugar, antes de `const BlueprintInventoryAdmin = () => {`

```ts
const createDeliveredMetadataPatch = (item: BlueprintInventoryItem): JsonRecord => ({
  data_class: item.data_class === "real_or_unclassified" ? "qa_fixture" : item.data_class,
  requires_follow_up: false,
  ...createBlueprintBig6MetadataPatch({
    businessName: item.business_name,
    clientEmail: item.client_email,
    publicId: item.public_id,
    metadata: item.metadata,
  }),
  admin_note: "Avanzado manualmente a delivered con Blueprint v2 Big6 desde Admin Blueprint Inventory",
});
```

---

## 4) Reemplaza SOLO el `metadataPatch` del botón “Avanzar delivered”

Busca este bloque dentro del botón:

```ts
metadataPatch: {
  data_class: item.data_class === "real_or_unclassified" ? "qa_fixture" : item.data_class,
  requires_follow_up: false,
  payment_required: false,
  markdown: createQaMarkdown(item),
  admin_note: "Avanzado manualmente a delivered desde Admin Blueprint Inventory",
},
```

Reemplázalo por:

```ts
metadataPatch: createDeliveredMetadataPatch(item),
```

---

## 5) Cambia el mensaje de éxito del mismo botón

De:

```ts
"Blueprint avanzado a delivered"
```

A:

```ts
"Blueprint v2 Big6 generado y avanzado a delivered"
```

---

## Resultado esperado

Al presionar **Avanzar delivered**, se actualiza `business_blueprints.metadata` con:

```ts
{
  payment_required: false,
  markdown: "...reporte completo Big6...",
  report_version: "blueprint_v2_big6_manual_qa",
  report_generator: "admin_manual_big6_v2",
  report_generated_at: "...",
  report_quality_status: "qa_manual_generated",
  admin_note: "Avanzado manualmente a delivered con Blueprint v2 Big6 desde Admin Blueprint Inventory"
}
```

Y además:

```ts
lifecycle_stage: "delivered"
delivery_progress: 7
payment_status: item.payment_status || "pending"
```
