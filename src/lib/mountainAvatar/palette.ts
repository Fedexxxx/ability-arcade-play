/**
 * Mountain Avatar — curated, closed palette.
 * No arbitrary colors anywhere in the avatar system. Adding a color means
 * adding a token here.
 */

export const SKIN_PALETTE = {
  porcelain:   "#F6D0B8",
  "warm-light": "#EBC19C",
  golden:      "#C98F5D",
  brown:       "#8F5A3C",
  deep:        "#5A3528",
} as const;

export const HAIR_COLORS = {
  black:        "#2B1A14",
  "dark-brown": "#4A2C1A",
  chestnut:     "#7A4426",
  blonde:       "#D6A84F",
  auburn:       "#A5472A",
} as const;

/** Outfit / clothing colors — grounded mountain hues. */
export const OUTFIT_COLORS = {
  "alpine-navy":  "#2E4A62",
  "pine-green":   "#3F5F4A",
  "glacier-blue": "#78AFCB",
  "slate-stone":  "#6E7781",
  "snow-cream":   "#EDE6D6",
  "trail-taupe":  "#A38B6D",
  "moss-olive":   "#6F7F4F",
  "summit-red":   "#B94A3A",
} as const;

/** Accessory accents. */
export const ACCESSORY_COLORS = {
  "compass-gold": "#D9A441",
  "rope-beige":   "#C6A878",
  "ice-teal":     "#6FB6B2",
  "berry-red":    "#A84848",
  "night-blue":   "#243B53",
  "cloud-white":  "#F2EEE4",
  "lichen-green": "#8A9A5B",
} as const;

export type SkinToneId      = keyof typeof SKIN_PALETTE;
export type HairColorId     = keyof typeof HAIR_COLORS;
export type OutfitColorId   = keyof typeof OUTFIT_COLORS;
export type AccessoryColorId = keyof typeof ACCESSORY_COLORS;

/** Strongly-saturated accent colors — used for the "max two accents" rule. */
export const ACCENT_OUTFIT: OutfitColorId[] = ["summit-red", "glacier-blue"];
export const ACCENT_ACCESSORY: AccessoryColorId[] = [
  "compass-gold",
  "ice-teal",
  "berry-red",
];

/** Skin → companion hex for shaded layer (built once via shade()). */
export function getSkinHex(id: SkinToneId): string {
  return SKIN_PALETTE[id];
}
export function getHairHex(id: HairColorId): string {
  return HAIR_COLORS[id];
}
export function getOutfitHex(id: OutfitColorId): string {
  return OUTFIT_COLORS[id];
}
export function getAccessoryHex(id: AccessoryColorId): string {
  return ACCESSORY_COLORS[id];
}

/* ------------------------------------------------------------------ */
/*  Color helpers — derive shade/highlight from a base hex            */
/* ------------------------------------------------------------------ */
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}
function rgbToHex(r: number, g: number, b: number) {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
/** amount: -1 (black) .. +1 (white) */
export function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  if (amount >= 0) {
    return rgbToHex(
      r + (255 - r) * amount,
      g + (255 - g) * amount,
      b + (255 - b) * amount,
    );
  }
  const t = 1 + amount;
  return rgbToHex(r * t, g * t, b * t);
}

/** Perceived luminance (0..1) — used for contrast checks. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}