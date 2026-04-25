/**
 * Sherpa Go! — Curated catalog of 12 explorer characters.
 *
 * Each character is a complete, pre-rendered Pixar-style PNG that lives under
 * /public/avatar/characters/<id>.png. There are NO modular layers: the body,
 * outfit, hair, boots and accessories are baked into the image. This keeps the
 * avatar visually consistent and removes the "puppet" failure modes of the old
 * SVG layer system.
 *
 * Tiers:
 *   - "free"  → unlocked from day one
 *   - "gear"  → unlocked by spending Alticoins (or, in the future, by progress)
 */

export type CharacterTier = "free" | "gear";

export interface CharacterDef {
  id: string;
  name: string;
  blurb: string;
  tier: CharacterTier;
  /** Alticoin price for gear-tier explorers. Free explorers omit this. */
  price?: number;
  /** Path to the pre-rendered PNG, relative to the public root. */
  image: string;
  /** Short identity hint shown in the picker (e.g. "alpine basics"). */
  vibe: string;
}

export const CHARACTERS: CharacterDef[] = [
  // ───── Free base explorers (6) ─────
  {
    id: "alpine-explorer",
    name: "Alpine Explorer",
    vibe: "Lo esencial para el primer ascenso",
    blurb: "Chaqueta navy y mochila ligera. Listo para la primera cumbre.",
    tier: "free",
    image: "/avatar/characters/alpine-explorer.png",
  },
  {
    id: "pine-trail-explorer",
    name: "Pine Trail",
    vibe: "Verdes de bosque",
    blurb: "Chaleco verde pino y gorrito beige. Sendero entre árboles.",
    tier: "free",
    image: "/avatar/characters/pine-trail-explorer.png",
  },
  {
    id: "glacier-explorer",
    name: "Glacier",
    vibe: "Azules y blancos del hielo",
    blurb: "Plumas glaciar, gorro de lana y bufanda turquesa.",
    tier: "free",
    image: "/avatar/characters/glacier-explorer.png",
  },
  {
    id: "summit-explorer",
    name: "Summit",
    vibe: "Plumas técnicas",
    blurb: "Plumas rojas y gorra de montaña para cumbres altas.",
    tier: "free",
    image: "/avatar/characters/summit-explorer.png",
  },
  {
    id: "basecamp-explorer",
    name: "Basecamp",
    vibe: "Acogedor y curioso",
    blurb: "Sudadera oliva con insignia de brújula. Listo para salir.",
    tier: "free",
    image: "/avatar/characters/basecamp-explorer.png",
  },
  {
    id: "cloud-peak-explorer",
    name: "Cloud Peak",
    vibe: "Ligero y ágil",
    blurb: "Suéter crema y cinta roja. Ágil para crestas largas.",
    tier: "free",
    image: "/avatar/characters/cloud-peak-explorer.png",
  },

  // ───── Unlockable gear-set explorers (6) ─────
  {
    id: "snow-route-explorer",
    name: "Snow Route",
    vibe: "Equipo de nieve completo",
    blurb: "Plumas blancas y azules, botas de nieve y mochila a juego.",
    tier: "gear",
    price: 180,
    image: "/avatar/characters/snow-route-explorer.png",
  },
  {
    id: "compass-master-explorer",
    name: "Compass Master",
    vibe: "Brújula dorada al pecho",
    blurb: "Chaqueta navy y beige con gran insignia de brújula.",
    tier: "gear",
    price: 220,
    image: "/avatar/characters/compass-master-explorer.png",
  },
  {
    id: "badge-collector-explorer",
    name: "Badge Collector",
    vibe: "Colecciona insignias",
    blurb: "Chaleco scout cubierto de insignias de mérito.",
    tier: "gear",
    price: 260,
    image: "/avatar/characters/badge-collector-explorer.png",
  },
  {
    id: "aurora-pathfinder-explorer",
    name: "Aurora Pathfinder",
    vibe: "Auroras del norte",
    blurb: "Parka azul noche con líneas turquesa de aurora.",
    tier: "gear",
    price: 320,
    image: "/avatar/characters/aurora-pathfinder-explorer.png",
  },
  {
    id: "summit-climber-explorer",
    name: "Summit Climber",
    vibe: "Escalada técnica",
    blurb: "Casco, arnés, cuerda y gran mochila roja de expedición.",
    tier: "gear",
    price: 360,
    image: "/avatar/characters/summit-climber-explorer.png",
  },
  {
    id: "legendary-sherpa-explorer",
    name: "Legendary Sherpa",
    vibe: "Equipo legendario",
    blurb: "Abrigo bordado con motivos de oro. La cima absoluta.",
    tier: "gear",
    price: 480,
    image: "/avatar/characters/legendary-sherpa-explorer.png",
  },
];

// Basecamp is the user's canonical, only-selectable Explorer. NPC ids
// (alpine-explorer, etc.) remain in CHARACTERS for in-world story moments
// only — they are never the user's avatar.
export const DEFAULT_CHARACTER_ID = "basecamp-explorer";

/** Always-unlocked character ids (free tier). */
export const FREE_CHARACTER_IDS: string[] = CHARACTERS
  .filter((c) => c.tier === "free")
  .map((c) => c.id);

export function getCharacter(id: string): CharacterDef | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

export function isCharacterUnlocked(id: string, owned: string[]): boolean {
  if (FREE_CHARACTER_IDS.includes(id)) return true;
  return owned.includes(id);
}
