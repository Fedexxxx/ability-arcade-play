

## Prototipo "Opción D" — explorador IA pre-renderizado detrás de un toggle A/B

Mantenemos el `ExplorerSvg` actual como **versión A (default)** en toda la app. Agregamos una **versión B (IA pre-renderizada)** visible sólo cuando el usuario activa un toggle, y sólo en las superficies del flujo de personalización.

### Alcance (qué SÍ y qué NO cambia)

**Sí cambia:**
- Página `/personalizar` (preview grande + selección de variantes B).
- Avatar redondo en `/perfil` (header) — refleja la elección del usuario.

**No cambia:**
- Basecamp, Shop, todas las demás superficies usan `ExplorerSvg` (versión A) siempre. Es un prototipo, no una migración.
- El modelo `explorerStyle` actual y el gear de la tienda — siguen funcionando para A.

---

### Cómo funciona el toggle A/B

Nuevo switch en la parte superior de `/personalizar`:

```text
[ Clásico (SVG) ]  ←→  [ Nuevo (IA) ]   ← toggle persistido
```

- Estado guardado en `localStorage` como `sherpa.avatarMode` (`"svg" | "ai"`), default `"svg"`.
- Hook nuevo `useAvatarMode()` análogo a `useExplorerStyle`.
- `AvatarWithGear` lee el modo: si `ai` y existe una variante guardada para el usuario, renderiza `<img>`; si no, fallback a `ExplorerSvg`.

---

### Sistema de variantes IA (set acotado pre-renderizado)

Generamos **un set finito** de PNGs con `google/gemini-2.5-flash-image` (Nano Banana). Combinatoria intencionalmente chica para que el prototipo sea manejable:

```text
4 outfits  ×  4 tonos de piel  ×  3 peinados  =  48 imágenes (bust)
                                              +  48 imágenes (full-body)
                                              =  96 PNGs total
```

Cada imagen se nombra de forma determinista, p.ej.:
`avatar/ai/v1/bust__outfit-explorer__skin-honey__hair-short.png`

Slots de personalización en modo IA (UI simplificada):
- **Outfit**: explorador / alpino / cumbre / sendero (4)
- **Piel**: porcelana / miel / cacao / espresso (4)
- **Pelo**: corto / medio / largo (3)

Accesorios y gear de tienda quedan fuera del prototipo IA (claramente comunicado en la UI: *"Versión beta — sin accesorios todavía"*).

---

### Generación de las imágenes (one-shot script)

Script Node ejecutado **una sola vez** durante el build del prototipo (no en runtime):

1. Lee la matriz de combinaciones (48 entradas).
2. Por cada una, llama al gateway con un prompt estructurado:
   ```text
   Pixar-style 3D character portrait, friendly young mountain explorer,
   neutral gender, soft warm lighting, clean studio background (transparent),
   {outfit description}, {skin tone}, {hair style and natural color},
   subtle smile, slight forward lean, full-body / bust framing,
   consistent character across set, square format.
   ```
3. Guarda el PNG en `public/avatar/ai/v1/<nombre>.png`.
4. Para mantener consistencia entre variantes, la **primera** imagen se usa como `image_url` de referencia en las siguientes llamadas (edit mode).

El script vive en `scripts/generate-ai-avatars.mjs` (no se ejecuta en producción, sólo on-demand).

---

### Cambios en código (resumen)

| Archivo | Cambio |
|---|---|
| `src/lib/avatarMode.ts` *(nuevo)* | `getAvatarMode()`, `setAvatarMode()`, evento `sherpa:avatar-mode-changed`. |
| `src/hooks/useAvatarMode.ts` *(nuevo)* | Hook análogo a `useExplorerStyle`. |
| `src/lib/aiAvatarCatalog.ts` *(nuevo)* | Mapa `(outfit, skin, hair) → ruta PNG`. Helper `resolveAiAvatarUrl(style, variant)`. |
| `src/components/AvatarWithGear.tsx` | Lee `useAvatarMode()`. Si `ai`, renderiza `<img src={resolveAiAvatarUrl(...)}>` con fallback a `ExplorerSvg`. |
| `src/pages/CustomizePage.tsx` | Toggle A/B arriba. Si modo `ai`: muestra preview `<img>` grande + 3 grids de selección (Outfit / Piel / Pelo). Si modo `svg`: tabs actuales sin cambios. Banner: *"Beta — sin accesorios"*. |
| `scripts/generate-ai-avatars.mjs` *(nuevo)* | Script de generación one-shot. |
| `public/avatar/ai/v1/*.png` *(nuevos)* | 96 assets generados. |
| `.lovable/memory/features/explorer-style.md` | Nota corta sobre el toggle y el catálogo IA. |

---

### Flujo del usuario

1. Va a `/personalizar`.
2. Ve toggle arriba: **Clásico** (default) | **Nuevo (IA)**.
3. Toca **Nuevo (IA)** → preview cambia a render IA, tabs se reemplazan por 3 grids simplificados.
4. Selecciona outfit/piel/pelo → preview actualiza al instante (cambia el `<img>`).
5. Al volver a `/perfil`, el avatar redondo del header también se ve en versión IA.
6. En Basecamp/Shop sigue viendo el SVG actual (alcance limitado del prototipo).
7. Puede volver a **Clásico** en cualquier momento sin perder su estilo SVG.

---

### Consideraciones técnicas

- **Peso**: 96 PNGs ≈ 8–15 MB total. Se sirven desde `/public` con cache largo. Aceptable para prototipo.
- **Sin animaciones live** en modo IA (sin blink/breathing). Compensamos con un fade-in suave al cambiar variante.
- **Persistencia**: variante IA elegida se guarda en `sherpa.aiAvatarVariant.v1` (separado del `explorerStyle` SVG, para no contaminar el modelo existente).
- **Reset de explorador**: limpia ambos (`explorerStyle` y `aiAvatarVariant`), pero **no** el `avatarMode` (preferencia de UI).
- **Costo de generación**: ~96 llamadas a Nano Banana, una sola vez. No hay generación en runtime.
- **Accesorios y gear de tienda en modo IA**: explícitamente fuera de alcance. La sección "Mi equipo" se oculta cuando `mode === "ai"`.

---

### Lo que necesito confirmar antes de implementar

1. **¿OK con la combinatoria 4×4×3 = 48 variantes?** Si querés más diversidad puedo subir a 5×5×4 = 100 (200 PNGs total), o achicar a 3×3×3 = 27 si preferís más liviano.
2. **¿OK que el modo IA no soporte accesorios ni gear de tienda en este prototipo?** Es la única forma realista de hacer Opción D sin generación en runtime.
3. **¿Estilo del prompt: "Pixar-style 3D" o "ilustración 2D estilizada"?** Cambia bastante el resultado final.

