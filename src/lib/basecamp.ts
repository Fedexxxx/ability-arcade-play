/**
 * Basecamp — the single canonical Explorer of Sherpa Go!
 *
 * The user no longer chooses between unrelated explorer characters. They have
 * ONE companion (Basecamp) and customize its identity (skin tone today; hair
 * style and gear sets in later phases).
 *
 * Each variant is a full pre-rendered PNG that preserves Basecamp's exact
 * face, expression, hoodie, pose, lighting and Pixar-style 3D look — only the
 * skin tone changes.
 */

export type BasecampSkinTone =
  | "light-warm"
  | "medium-warm"
  | "golden"
  | "brown"
  | "deep-brown";

export interface BasecampSkinVariant {
  id: BasecampSkinTone;
  /** Spanish label shown in the picker. */
  label: string;
  /** Tiny color swatch shown next to the option. */
  swatch: string;
  /** Pre-rendered PNG. */
  image: string;
}

export const BASECAMP_SKIN_VARIANTS: BasecampSkinVariant[] = [
  {
    id: "light-warm",
    label: "Cálida clara",
    swatch: "#F5D7B5",
    image: "/avatar/basecamp/basecamp-light-warm.png",
  },
  {
    id: "medium-warm",
    label: "Cálida media",
    swatch: "#E0B58A",
    image: "/avatar/basecamp/basecamp-medium-warm.png",
  },
  {
    id: "golden",
    label: "Dorada",
    swatch: "#C99565",
    image: "/avatar/basecamp/basecamp-golden.png",
  },
  {
    id: "brown",
    label: "Marrón cálido",
    swatch: "#9B6A45",
    image: "/avatar/basecamp/basecamp-brown.png",
  },
  {
    id: "deep-brown",
    label: "Marrón profundo",
    swatch: "#5D3A24",
    image: "/avatar/basecamp/basecamp-deep-brown.png",
  },
];

export const DEFAULT_SKIN_TONE: BasecampSkinTone = "light-warm";

export function getSkinVariant(id: string | undefined): BasecampSkinVariant {
  return (
    BASECAMP_SKIN_VARIANTS.find((v) => v.id === id) ?? BASECAMP_SKIN_VARIANTS[0]
  );
}

/**
 * Gear sets — full pre-rendered Basecamp variants with integrated equipment
 * (hat + scarf + backpack + boots together). Empty for now; a later phase
 * will generate them. The shop reads from this list, so leaving it empty
 * makes the shop show a "coming soon" state without crashing.
 */
export interface BasecampGearSet {
  id: string;
  name: string;
  blurb: string;
  /** Alticoin price. */
  price: number;
  /** Full pre-rendered PNG of Basecamp wearing the set. */
  image: string;
  /** True when this set is generated and ready to ship. */
  available: boolean;
}

export const BASECAMP_GEAR_SETS: BasecampGearSet[] = [
  // Placeholders — visuals will be generated in phase 2.
  { id: "winter",   name: "Basecamp Invierno",   blurb: "Gorro, bufanda y chaqueta cálida.", price: 220, image: "", available: false },
  { id: "climbing", name: "Basecamp Escalada",   blurb: "Casco, arnés y cuerda.",            price: 320, image: "", available: false },
  { id: "forest",   name: "Basecamp Bosque",     blurb: "Capa verde y mochila ligera.",      price: 180, image: "", available: false },
  { id: "summit",   name: "Basecamp Cumbre",     blurb: "Plumas técnicas y crampones.",      price: 360, image: "", available: false },
];