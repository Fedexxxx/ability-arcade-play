

## Próximos pasos sugeridos

El script de generación está sólido (resume, backoff con jitter, presupuesto global de 429, logging en vivo). Lo que falta para que el prototipo "Opción D" quede usable es **completar el set de imágenes y validar la UX end-to-end**. Te propongo 3 frentes en orden de prioridad.

---

### 1. Completar la generación del set IA (crítico)

Hoy sólo existen 96 PNGs en `/public/avatar/ai/v2/` (todos `hairColor-brown`). Faltan **288 imágenes** para cubrir las 384 combinaciones (4 outfits × 4 pieles × 3 pelos × 4 colores × 2 frames).

- Reanudar `scripts/generate-ai-avatars.py` por lotes de color (`black`, `amber`, `copper`).
- Recomendado correr lote por lote con presupuesto global acotado para no quemar créditos:
  ```bash
  RL_GLOBAL_MAX_RETRIES=40 RL_GLOBAL_MAX_WAIT=300 \
  HAIR_COLORS=black python scripts/generate-ai-avatars.py
  ```
  *(requiere agregar un filtro `HAIR_COLORS` env al script — pequeña adición.)*
- Verificar consistencia visual entre lotes (que el personaje no cambie de cara entre `brown` y `black`).

**Riesgo a mitigar**: si Nano Banana drifteó entre sesiones de generación, puede haber inconsistencia. Plan B: regenerar todo el set en una sola corrida usando la primera imagen como referencia (`image_url`) en todas las llamadas posteriores.

---

### 2. Fallback robusto cuando falta una variante

Mientras el set esté incompleto, la UI puede romperse al pedir un PNG inexistente.

- En `AiAvatarCanvas.tsx`: agregar `onError` al `<img>` que caiga al variante `hairColor-brown` equivalente (ya existe).
- En `resolveAiAvatarUrl()` (`src/lib/aiAvatarCatalog.ts`): exponer una segunda función `resolveAiAvatarUrlWithFallback()` que reciba un set conocido de archivos disponibles y degrade automáticamente.
- Generar en build-time un `public/avatar/ai/v2/manifest.json` con la lista de archivos existentes para que el front sepa qué pedir sin probar y fallar.

---

### 3. Accesorios comprados con Alticoins sobre el avatar IA

Pendiente del pedido original ("los objetos comprados deben aparecer en la posición correcta: gorra, casco, bufanda…"). Hoy `AvatarWithGear` aplica gear sólo en modo SVG.

- Definir 3–4 anclas fijas en coordenadas relativas del frame IA (`headTop`, `neck`, `chest`, `hand`) para `bust` y `full` por separado.
- Renderizar los items de `shopCatalog` como `<img>` PNG transparentes posicionados absolutamente sobre el `<img>` base con `pointer-events:none`.
- Banner "Beta — sin accesorios" se retira cuando esto esté listo.

**Limitación honesta**: como el avatar IA es un raster, los accesorios se verán "pegados encima" en vez de integrados con luz/sombra. Aceptable para prototipo; si querés integración real haría falta generar cada combinación con accesorio incluido (combinatoria explota).

---

### Orden recomendado

```text
1. Generar lote `black`        →  ver consistencia
2. Si OK → lotes `amber` + `copper`
3. Manifest.json + fallback en UI
4. Anclas de accesorios sobre raster
5. QA final en /personalizar y /perfil
```

### Qué necesito que decidas

1. ¿Arrancamos por **completar el set** (frente 1) o preferís primero el **fallback defensivo** (frente 2) para no romper la UI?
2. Para los accesorios sobre IA: ¿overlay PNG simple (rápido, "pegado") o invertimos en regenerar combinaciones con accesorio incluido (caro, mejor look)?

