// Pre-rendered AI avatar catalog (Opción D prototype).
// Images live under /public/avatar/ai/v1/ and are served as static assets.
// File name format:
//   <variant>__outfit-<outfit>__skin-<skin>__hair-<hair>.png
//   variant: "bust" | "full"

const KEY = "sherpa.aiAvatarVariant.v1";
const EVENT = "sherpa:ai-avatar-variant-changed";

export type AiOutfit = "explorer" | "alpine" | "summit" | "trail";
export type AiSkin = "porcelain" | "honey" | "cocoa" | "espresso";
export type AiHair = "short" | "medium" | "long";
export type AiHairColor = "black" | "brown" | "amber" | "copper";

export interface AiAvatarVariant {
  outfit: AiOutfit;
  skin: AiSkin;
  hair: AiHair;
  hairColor: AiHairColor;
}

export const AI_OUTFITS: { id: AiOutfit; label: string; desc: string }[] = [
  { id: "explorer", label: "Explorador", desc: "Chaqueta naranja sherpa, mochila clásica" },
  { id: "alpine",   label: "Alpino",     desc: "Anorak azul invierno con bufanda" },
  { id: "summit",   label: "Cumbre",     desc: "Plumas rojas técnicas, gafas en la cabeza" },
  { id: "trail",    label: "Sendero",    desc: "Camisa caqui, pantalón cargo, ligero" },
];

export const AI_SKINS: { id: AiSkin; label: string; swatch: string }[] = [
  { id: "porcelain", label: "Porcelana", swatch: "#F6D9C2" },
  { id: "honey",     label: "Miel",      swatch: "#E8B98A" },
  { id: "cocoa",     label: "Cacao",     swatch: "#8E5A3C" },
  { id: "espresso",  label: "Espresso",  swatch: "#5C3A24" },
];

export const AI_HAIRS: { id: AiHair; label: string }[] = [
  { id: "short",  label: "Corto" },
  { id: "medium", label: "Medio" },
  { id: "long",   label: "Largo" },
];

export const AI_HAIR_COLORS: { id: AiHairColor; label: string; swatch: string }[] = [
  { id: "black", label: "Cuervo", swatch: "#1F1A18" },
  { id: "brown", label: "Castaño", swatch: "#3A2418" },
  { id: "amber", label: "Miel", swatch: "#9C6A2A" },
  { id: "copper", label: "Cobre", swatch: "#D6622B" },
];

export const DEFAULT_AI_VARIANT: AiAvatarVariant = {
  outfit: "explorer",
  skin: "honey",
  hair: "short",
  hairColor: "brown",
};

export function fileNameFor(variant: AiAvatarVariant, frame: "bust" | "full"): string {
  return `${frame}__outfit-${variant.outfit}__skin-${variant.skin}__hair-${variant.hair}__hairColor-${variant.hairColor}.png`;
}

export function resolveAiAvatarUrl(variant: AiAvatarVariant, frame: "bust" | "full"): string {
  return `/avatar/ai/v2/${fileNameFor(variant, frame)}`;
}

// ----- Manifest-aware fallback ---------------------------------------------
// Loaded lazily from /avatar/ai/v2/manifest.json. While loading (or if the
// fetch fails) we treat all files as "unknown" and let the <img> onError in
// the canvas degrade at runtime.

let _manifestSet: Set<string> | null = null;
let _manifestPromise: Promise<Set<string>> | null = null;

export function loadAvatarManifest(): Promise<Set<string>> {
  if (_manifestSet) return Promise.resolve(_manifestSet);
  if (_manifestPromise) return _manifestPromise;
  _manifestPromise = fetch("/avatar/ai/v2/manifest.json", { cache: "force-cache" })
    .then((r) => (r.ok ? r.json() : { files: [] }))
    .then((data: { files?: string[] }) => {
      _manifestSet = new Set(data.files ?? []);
      return _manifestSet;
    })
    .catch(() => {
      _manifestSet = new Set();
      return _manifestSet;
    });
  return _manifestPromise;
}

/** Synchronous accessor; returns null until the manifest has loaded. */
export function getLoadedManifest(): Set<string> | null {
  return _manifestSet;
}

/**
 * Pick the closest available variant given the manifest. Order of degradation:
 *  1. exact match
 *  2. swap hairColor -> "brown" (the seed color we generated first)
 *  3. swap hair -> "short"
 *  4. swap skin -> "honey"
 *  5. swap outfit -> "explorer"
 *  6. give up and return the exact (broken) URL — let onError handle it
 */
export function resolveAiAvatarUrlWithFallback(
  variant: AiAvatarVariant,
  frame: "bust" | "full",
  manifest: Set<string> | null = _manifestSet,
): string {
  const candidates: AiAvatarVariant[] = [
    variant,
    { ...variant, hairColor: "brown" },
    { ...variant, hairColor: "brown", hair: "short" },
    { ...variant, hairColor: "brown", hair: "short", skin: "honey" },
    { ...variant, hairColor: "brown", hair: "short", skin: "honey", outfit: "explorer" },
  ];
  if (manifest && manifest.size > 0) {
    for (const c of candidates) {
      const name = fileNameFor(c, frame);
      if (manifest.has(name)) return `/avatar/ai/v2/${name}`;
    }
  }
  return resolveAiAvatarUrl(variant, frame);
}

export function getAiVariant(): AiAvatarVariant {
  if (typeof window === "undefined") return { ...DEFAULT_AI_VARIANT };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_AI_VARIANT };
    const parsed = JSON.parse(raw) as Partial<AiAvatarVariant>;
    return { ...DEFAULT_AI_VARIANT, ...parsed };
  } catch {
    return { ...DEFAULT_AI_VARIANT };
  }
}

export function saveAiVariant(patch: Partial<AiAvatarVariant>) {
  try {
    const next = { ...getAiVariant(), ...patch };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

export function clearAiVariant() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

export const AI_AVATAR_VARIANT_EVENT = EVENT;