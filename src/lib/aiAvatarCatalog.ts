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

export interface AiAvatarVariant {
  outfit: AiOutfit;
  skin: AiSkin;
  hair: AiHair;
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

export const DEFAULT_AI_VARIANT: AiAvatarVariant = {
  outfit: "explorer",
  skin: "honey",
  hair: "short",
};

export function fileNameFor(variant: AiAvatarVariant, frame: "bust" | "full"): string {
  return `${frame}__outfit-${variant.outfit}__skin-${variant.skin}__hair-${variant.hair}.png`;
}

export function resolveAiAvatarUrl(variant: AiAvatarVariant, frame: "bust" | "full"): string {
  return `/avatar/ai/v1/${fileNameFor(variant, frame)}`;
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