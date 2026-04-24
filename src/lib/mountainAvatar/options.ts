/**
 * Mountain Avatar — option catalogs (data-driven, no hardcoded combinations).
 * Every option has an id (used in MountainAvatar config), a friendly label,
 * and a `free` flag controlling whether it's available without unlock.
 *
 * Locked items can be unlocked by:
 *   - buying them in the shop (wallet.owned), OR
 *   - earning them through progress (future hook — for now, shop only).
 */

import type {
  AccessoryColorId,
  HairColorId,
  OutfitColorId,
  SkinToneId,
} from "./palette";

/* ────────────────────────── Identity (always free) ─────────────────────── */

export type HairStyleId =
  | "soft-short"
  | "wavy-medium"
  | "curly-round"
  | "side-swept"
  | "fluffy-explorer"
  | "tied-back";

export interface HairStyleOption {
  id: HairStyleId;
  label: string;
}
export const HAIR_STYLES: HairStyleOption[] = [
  { id: "soft-short",      label: "Corto" },
  { id: "wavy-medium",     label: "Ondulado" },
  { id: "curly-round",     label: "Rizado" },
  { id: "side-swept",      label: "Lateral" },
  { id: "fluffy-explorer", label: "Explorador" },
  { id: "tied-back",       label: "Recogido" },
];

export interface SkinOption {
  id: SkinToneId;
  label: string;
}
export const SKIN_TONES: SkinOption[] = [
  { id: "porcelain",   label: "Porcelana" },
  { id: "warm-light",  label: "Cálido claro" },
  { id: "golden",      label: "Dorado" },
  { id: "brown",       label: "Marrón" },
  { id: "deep",        label: "Profundo" },
];

export interface HairColorOption {
  id: HairColorId;
  label: string;
}
export const HAIR_COLOR_OPTIONS: HairColorOption[] = [
  { id: "black",      label: "Negro" },
  { id: "dark-brown", label: "Castaño oscuro" },
  { id: "chestnut",   label: "Castaño" },
  { id: "blonde",     label: "Rubio" },
  { id: "auburn",     label: "Cobrizo" },
];

/* ────────────────────────── Adventure gear (locked by default) ─────────── */

export type LockReason = "shop" | "adventure";

export interface GearOption {
  id: string;
  label: string;
  free: boolean;
  /** When `free === false`, where can the player unlock it? */
  lockReason?: LockReason;
}

/* Tops (jackets / hoodies / vests) ---------------------------------------- */
export type TopId =
  | "alpine-jacket"
  | "explorer-vest"
  | "mountain-hoodie"
  | "padded-trail-jacket"
  | "sherpa-coat"
  | "summit-sweater";

export const TOP_OPTIONS: (GearOption & { id: TopId })[] = [
  { id: "alpine-jacket",       label: "Chaqueta alpina",   free: true },
  { id: "explorer-vest",       label: "Chaleco explorador", free: false, lockReason: "shop" },
  { id: "mountain-hoodie",     label: "Sudadera de montaña", free: false, lockReason: "shop" },
  { id: "padded-trail-jacket", label: "Plumas de sendero", free: false, lockReason: "shop" },
  { id: "sherpa-coat",         label: "Abrigo sherpa",     free: false, lockReason: "adventure" },
  { id: "summit-sweater",      label: "Suéter de cumbre",  free: false, lockReason: "shop" },
];

/* Bottoms ----------------------------------------------------------------- */
export type BottomId =
  | "trail-pants"
  | "mountain-shorts"
  | "hiking-pants"
  | "explorer-pants";

export const BOTTOM_OPTIONS: (GearOption & { id: BottomId })[] = [
  { id: "trail-pants",     label: "Pantalón de sendero", free: true },
  { id: "mountain-shorts", label: "Shorts de montaña",   free: false, lockReason: "shop" },
  { id: "hiking-pants",    label: "Pantalón suave",      free: false, lockReason: "shop" },
  { id: "explorer-pants",  label: "Pantalón explorador", free: false, lockReason: "adventure" },
];

/* Boots ------------------------------------------------------------------- */
export type BootsId =
  | "classic-hiking"
  | "slate-mountain"
  | "snow-friendly"
  | "soft-trail";

export const BOOTS_OPTIONS: (GearOption & { id: BootsId })[] = [
  { id: "classic-hiking",  label: "Botas clásicas", free: true },
  { id: "slate-mountain",  label: "Botas pizarra",  free: false, lockReason: "shop" },
  { id: "snow-friendly",   label: "Botas de nieve", free: false, lockReason: "shop" },
  { id: "soft-trail",      label: "Zapatillas de sendero", free: false, lockReason: "adventure" },
];

/* Backpacks --------------------------------------------------------------- */
export type BackpackId =
  | "none"
  | "round-explorer"
  | "compact-trail"
  | "rope-detail"
  | "badge-pack"
  | "summit-pack";

export const BACKPACK_OPTIONS: (GearOption & { id: BackpackId })[] = [
  { id: "none",            label: "Sin mochila",   free: true },
  { id: "round-explorer",  label: "Mochila redonda", free: false, lockReason: "shop" },
  { id: "compact-trail",   label: "Mochila compacta", free: false, lockReason: "shop" },
  { id: "rope-detail",     label: "Mochila con cuerda", free: false, lockReason: "shop" },
  { id: "badge-pack",      label: "Mochila de insignias", free: false, lockReason: "adventure" },
  { id: "summit-pack",     label: "Mochila de cumbre", free: false, lockReason: "adventure" },
];

/* Head accessories -------------------------------------------------------- */
export type HatId =
  | "none"
  | "explorer-beanie"
  | "mountain-cap"
  | "sherpa-wool"
  | "headband";

export const HAT_OPTIONS: (GearOption & { id: HatId })[] = [
  { id: "none",            label: "Sin gorro",      free: true },
  { id: "explorer-beanie", label: "Gorro explorador", free: false, lockReason: "shop" },
  { id: "mountain-cap",    label: "Gorra de montaña", free: false, lockReason: "shop" },
  { id: "sherpa-wool",     label: "Gorro sherpa",     free: false, lockReason: "shop" },
  { id: "headband",        label: "Cinta",            free: false, lockReason: "adventure" },
];

/* Neck accessories -------------------------------------------------------- */
export type NeckId = "none" | "scarf" | "neck-warmer" | "bandana";

export const NECK_OPTIONS: (GearOption & { id: NeckId })[] = [
  { id: "none",        label: "Sin cuello", free: true },
  { id: "scarf",       label: "Bufanda",    free: false, lockReason: "shop" },
  { id: "neck-warmer", label: "Cuello",     free: false, lockReason: "shop" },
  { id: "bandana",     label: "Bandana",    free: false, lockReason: "adventure" },
];

/* Badges ------------------------------------------------------------------ */
export type BadgeId =
  | "none"
  | "compass"
  | "mountain"
  | "star"
  | "map-pin"
  | "snowflake"
  | "trail";

export const BADGE_OPTIONS: (GearOption & { id: BadgeId })[] = [
  { id: "none",      label: "Sin insignia", free: true },
  { id: "compass",   label: "Brújula",      free: false, lockReason: "shop" },
  { id: "mountain",  label: "Montaña",      free: false, lockReason: "shop" },
  { id: "star",      label: "Estrella",     free: false, lockReason: "adventure" },
  { id: "map-pin",   label: "Marca de mapa", free: false, lockReason: "adventure" },
  { id: "snowflake", label: "Copo de nieve", free: false, lockReason: "shop" },
  { id: "trail",     label: "Sendero",      free: false, lockReason: "adventure" },
];

/* Expressions (always free) ---------------------------------------------- */
export type ExpressionId =
  | "friendly-curious"
  | "confident-smile"
  | "calm-focused"
  | "joyful-cheer";

export const EXPRESSION_OPTIONS: { id: ExpressionId; label: string }[] = [
  { id: "friendly-curious", label: "Curioso" },
  { id: "confident-smile",  label: "Seguro" },
  { id: "calm-focused",     label: "Sereno" },
  { id: "joyful-cheer",     label: "Alegre" },
];

/* Defaults visible in selectors for color choices ------------------------- */

export const TOP_COLOR_CHOICES: OutfitColorId[] = [
  "alpine-navy",
  "pine-green",
  "trail-taupe",
  "moss-olive",
  "slate-stone",
  "summit-red",
  "glacier-blue",
];

export const BOTTOM_COLOR_CHOICES: OutfitColorId[] = [
  "slate-stone",
  "trail-taupe",
  "alpine-navy",
  "pine-green",
  "moss-olive",
];

export const BOOTS_COLOR_CHOICES: OutfitColorId[] = [
  "slate-stone",
  "trail-taupe",
  "alpine-navy",
  "snow-cream",
];

export const ACC_COLOR_CHOICES: AccessoryColorId[] = [
  "rope-beige",
  "cloud-white",
  "night-blue",
  "lichen-green",
  "compass-gold",
  "ice-teal",
  "berry-red",
];

/* Lookup helper ----------------------------------------------------------- */
export function findOption<T extends GearOption>(list: T[], id: string): T | undefined {
  return list.find((o) => o.id === id);
}