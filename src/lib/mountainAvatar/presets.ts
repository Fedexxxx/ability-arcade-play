/** 10 curated Sherpa Go! presets — every layer, harmonized by hand. */

import type { MountainAvatar } from "./state";

export interface MountainPreset {
  id: string;
  name: string;
  blurb: string;
  /** Whether this preset can be applied without buying anything. */
  freeOnly: boolean;
  config: MountainAvatar;
}

export const PRESETS: MountainPreset[] = [
  {
    id: "alpine-scout",
    name: "Alpine Scout",
    blurb: "Equipo clásico, listo para el primer ascenso.",
    freeOnly: true,
    config: {
      skinTone: "warm-light", hairStyle: "soft-short", hairColor: "chestnut",
      expression: "friendly-curious",
      top: "alpine-jacket", topColor: "alpine-navy",
      bottom: "trail-pants", bottomColor: "slate-stone",
      boots: "classic-hiking", bootsColor: "trail-taupe",
      hat: "none", hatColor: "rope-beige",
      neck: "none", neckColor: "cloud-white",
      backpack: "none", backpackColor: "rope-beige",
      badge: "none",
    },
  },
  {
    id: "pine-trail-explorer",
    name: "Pine Trail Explorer",
    blurb: "Verdes de bosque y mochila ligera.",
    freeOnly: false,
    config: {
      skinTone: "golden", hairStyle: "wavy-medium", hairColor: "dark-brown",
      expression: "confident-smile",
      top: "explorer-vest", topColor: "pine-green",
      bottom: "trail-pants", bottomColor: "trail-taupe",
      boots: "classic-hiking", bootsColor: "slate-stone",
      hat: "explorer-beanie", hatColor: "rope-beige",
      neck: "none", neckColor: "cloud-white",
      backpack: "compact-trail", backpackColor: "lichen-green",
      badge: "compass",
    },
  },
  {
    id: "glacier-buddy",
    name: "Glacier Buddy",
    blurb: "Azules y blancos, listo para el frío.",
    freeOnly: false,
    config: {
      skinTone: "porcelain", hairStyle: "fluffy-explorer", hairColor: "blonde",
      expression: "joyful-cheer",
      top: "padded-trail-jacket", topColor: "glacier-blue",
      bottom: "hiking-pants", bottomColor: "alpine-navy",
      boots: "snow-friendly", bootsColor: "snow-cream",
      hat: "sherpa-wool", hatColor: "cloud-white",
      neck: "scarf", neckColor: "ice-teal",
      backpack: "round-explorer", backpackColor: "night-blue",
      badge: "snowflake",
    },
  },
  {
    id: "summit-pathfinder",
    name: "Summit Pathfinder",
    blurb: "Plumas técnicas para cumbres altas.",
    freeOnly: false,
    config: {
      skinTone: "brown", hairStyle: "curly-round", hairColor: "black",
      expression: "calm-focused",
      top: "padded-trail-jacket", topColor: "summit-red",
      bottom: "explorer-pants", bottomColor: "alpine-navy",
      boots: "snow-friendly", bootsColor: "slate-stone",
      hat: "mountain-cap", hatColor: "night-blue",
      neck: "neck-warmer", neckColor: "cloud-white",
      backpack: "summit-pack", backpackColor: "night-blue",
      badge: "mountain",
    },
  },
  {
    id: "cloud-peak-climber",
    name: "Cloud Peak Climber",
    blurb: "Ligero y ágil para crestas largas.",
    freeOnly: false,
    config: {
      skinTone: "warm-light", hairStyle: "side-swept", hairColor: "chestnut",
      expression: "confident-smile",
      top: "summit-sweater", topColor: "snow-cream",
      bottom: "hiking-pants", bottomColor: "slate-stone",
      boots: "soft-trail", bootsColor: "trail-taupe",
      hat: "headband", hatColor: "berry-red",
      neck: "none", neckColor: "cloud-white",
      backpack: "compact-trail", backpackColor: "rope-beige",
      badge: "star",
    },
  },
  {
    id: "stone-ridge-ranger",
    name: "Stone Ridge Ranger",
    blurb: "Tonos pizarra y cuerda al hombro.",
    freeOnly: false,
    config: {
      skinTone: "deep", hairStyle: "tied-back", hairColor: "black",
      expression: "calm-focused",
      top: "alpine-jacket", topColor: "slate-stone",
      bottom: "trail-pants", bottomColor: "trail-taupe",
      boots: "slate-mountain", bootsColor: "slate-stone",
      hat: "mountain-cap", hatColor: "lichen-green",
      neck: "bandana", neckColor: "berry-red",
      backpack: "rope-detail", backpackColor: "rope-beige",
      badge: "trail",
    },
  },
  {
    id: "snow-map-keeper",
    name: "Snow Map Keeper",
    blurb: "Cartógrafa de cumbres heladas.",
    freeOnly: false,
    config: {
      skinTone: "warm-light", hairStyle: "tied-back", hairColor: "auburn",
      expression: "friendly-curious",
      top: "mountain-hoodie", topColor: "alpine-navy",
      bottom: "explorer-pants", bottomColor: "slate-stone",
      boots: "snow-friendly", bootsColor: "snow-cream",
      hat: "explorer-beanie", hatColor: "cloud-white",
      neck: "scarf", neckColor: "berry-red",
      backpack: "badge-pack", backpackColor: "rope-beige",
      badge: "map-pin",
    },
  },
  {
    id: "little-mountaineer",
    name: "Little Mountaineer",
    blurb: "Primer equipo de basecamp.",
    freeOnly: true,
    config: {
      skinTone: "porcelain", hairStyle: "soft-short", hairColor: "blonde",
      expression: "joyful-cheer",
      top: "alpine-jacket", topColor: "moss-olive",
      bottom: "trail-pants", bottomColor: "trail-taupe",
      boots: "classic-hiking", bootsColor: "slate-stone",
      hat: "none", hatColor: "rope-beige",
      neck: "none", neckColor: "cloud-white",
      backpack: "none", backpackColor: "rope-beige",
      badge: "none",
    },
  },
  {
    id: "compass-trail-friend",
    name: "Compass Trail Friend",
    blurb: "Brújula al cuello y rumbo claro.",
    freeOnly: false,
    config: {
      skinTone: "golden", hairStyle: "fluffy-explorer", hairColor: "auburn",
      expression: "confident-smile",
      top: "explorer-vest", topColor: "moss-olive",
      bottom: "trail-pants", bottomColor: "trail-taupe",
      boots: "classic-hiking", bootsColor: "trail-taupe",
      hat: "mountain-cap", hatColor: "rope-beige",
      neck: "bandana", neckColor: "compass-gold",
      backpack: "round-explorer", backpackColor: "rope-beige",
      badge: "compass",
    },
  },
  {
    id: "basecamp-adventurer",
    name: "Basecamp Adventurer",
    blurb: "Cómoda y curiosa, lista para salir.",
    freeOnly: true,
    config: {
      skinTone: "brown", hairStyle: "wavy-medium", hairColor: "dark-brown",
      expression: "friendly-curious",
      top: "alpine-jacket", topColor: "pine-green",
      bottom: "trail-pants", bottomColor: "slate-stone",
      boots: "classic-hiking", bootsColor: "trail-taupe",
      hat: "none", hatColor: "rope-beige",
      neck: "none", neckColor: "cloud-white",
      backpack: "none", backpackColor: "rope-beige",
      badge: "none",
    },
  },
];

export function findPreset(id: string): MountainPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}