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
    label: "Explorador Claro",
    swatch: "#F5D7B5",
    image: "/avatar/basecamp/basecamp-light-warm.png",
  },
  {
    id: "medium-warm",
    label: "Explorador Cálido",
    swatch: "#E0B58A",
    image: "/avatar/basecamp/basecamp-medium-warm.png",
  },
  {
    id: "golden",
    label: "Explorador Dorado",
    swatch: "#C99565",
    image: "/avatar/basecamp/basecamp-golden.png",
  },
  {
    id: "brown",
    label: "Explorador Tierra",
    swatch: "#9B6A45",
    image: "/avatar/basecamp/basecamp-brown.png",
  },
  {
    id: "deep-brown",
    label: "Explorador Noche",
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
 * baked into a single PNG. Each set is the WHOLE character; we never overlay
 * loose accessories on top of the base Basecamp.
 *
 * Tiers:
 *   - "free"    → Basecamp Clásico, owned and equipped from day one.
 *   - "shop"    → unlockable with Alticoins.
 *   - "soon"    → preview-only; cannot be bought yet.
 */
export type BasecampGearTier = "free" | "shop" | "soon";

export interface BasecampGearSet {
  id: string;
  name: string;
  blurb: string;
  /** Alticoin price. 0 for free / coming-soon sets. */
  price: number;
  /** Full pre-rendered PNG of Basecamp wearing the set. Empty for "soon". */
  image: string;
  tier: BasecampGearTier;
}

/** Sentinel id for the always-owned default look. */
export const DEFAULT_GEAR_SET_ID = "classic";

/**
 * The 6 active gear sets shown in "Equipo de aventura".
 * Order matters — it's the order the cards are rendered.
 */
export const BASECAMP_GEAR_SETS: BasecampGearSet[] = [
  {
    id: DEFAULT_GEAR_SET_ID,
    name: "Explorador Clásico",
    blurb: "Sudadera oliva e insignia de brújula. Listo para empezar.",
    price: 0,
    image: "", // Empty → MountainAvatar falls back to the skin-tone variant.
    tier: "free",
  },
  {
    id: "winter",
    name: "Explorador Invierno",
    blurb: "Plumas azul marino, bufanda tejida y botas para la nieve.",
    price: 100,
    image: "/avatar/basecamp/gear/basecamp-invierno.png",
    tier: "shop",
  },
  {
    id: "climbing",
    name: "Explorador Escalada",
    blurb: "Casco rojo, arnés naranja y cuerda para tu primera vía.",
    price: 150,
    image: "/avatar/basecamp/gear/basecamp-escalada.png",
    tier: "shop",
  },
  {
    id: "glacier",
    name: "Explorador Glaciar",
    blurb: "Chaqueta hielo, capucha de piel y crampones de aventura.",
    price: 200,
    image: "/avatar/basecamp/gear/basecamp-glaciar.png",
    tier: "shop",
  },
  {
    id: "cartographer",
    name: "Explorador Cartógrafo",
    blurb: "Chaleco de bolsillos, mapa enrollado y compás de bronce.",
    price: 250,
    image: "/avatar/basecamp/gear/basecamp-cartografo.png",
    tier: "shop",
  },
  {
    id: "summit",
    name: "Explorador Cumbre",
    blurb: "Plumas doradas, piolet y bandera para coronar la cima.",
    price: 300,
    image: "/avatar/basecamp/gear/basecamp-cumbre.png",
    tier: "shop",
  },
];

/**
 * "Próximos premios" — purely aspirational previews. Image is intentionally
 * empty; the UI shows a silhouette so we don't ship half-finished assets.
 */
export const BASECAMP_GEAR_COMING_SOON: BasecampGearSet[] = [
  {
    id: "aurora",
    name: "Explorador Aurora",
    blurb: "Plumas iridiscentes con reflejos de aurora boreal.",
    price: 0,
    image: "",
    tier: "soon",
  },
  {
    id: "legend",
    name: "Explorador Leyenda",
    blurb: "Equipo dorado de las grandes expediciones.",
    price: 0,
    image: "",
    tier: "soon",
  },
  {
    id: "map-master",
    name: "Explorador Maestro de mapas",
    blurb: "Capa de explorador con cartas y brújulas antiguas.",
    price: 0,
    image: "",
    tier: "soon",
  },
];

export function getGearSet(id: string | null | undefined): BasecampGearSet | undefined {
  if (!id) return undefined;
  return (
    BASECAMP_GEAR_SETS.find((g) => g.id === id) ??
    BASECAMP_GEAR_COMING_SOON.find((g) => g.id === id)
  );
}