// Per-item placement of cosmetic glyph overlays on the AI avatar.
// Coordinates are in % of the avatar container so they scale with size.
// Two frames: "full" (full-body Customize preview) and "bust" (round avatars).

import type { CosmeticSlot } from "@/lib/wallet";

export interface GearPos {
  top: string;
  left: string;
  /** Glyph size as % of container width (so it scales with the avatar). */
  size: string;
  rotate: string;
}

export interface GearPlacement {
  full: GearPos;
  bust: GearPos;
}

// Defaults per slot — used when an item-specific override is missing.
const SLOT_DEFAULTS: Record<CosmeticSlot, GearPlacement> = {
  hat: {
    full: { top: "8%",  left: "50%", size: "18%", rotate: "-4deg" },
    bust: { top: "10%", left: "50%", size: "34%", rotate: "-4deg" },
  },
  scarf: {
    full: { top: "30%", left: "50%", size: "16%", rotate: "0deg" },
    bust: { top: "76%", left: "50%", size: "28%", rotate: "0deg" },
  },
  backpack: {
    full: { top: "36%", left: "22%", size: "18%", rotate: "-12deg" },
    bust: { top: "64%", left: "16%", size: "26%", rotate: "-12deg" },
  },
  boots: {
    full: { top: "92%", left: "44%", size: "14%", rotate: "0deg" },
    bust: { top: "84%", left: "82%", size: "22%", rotate: "0deg" },
  },
  badge: {
    full: { top: "38%", left: "62%", size: "10%", rotate: "0deg" },
    bust: { top: "62%", left: "78%", size: "20%", rotate: "0deg" },
  },
};

// Item-level overrides (a crown sits higher than a baseball cap, etc).
const ITEM_OVERRIDES: Record<string, Partial<GearPlacement>> = {
  // Hats / helmets
  "hat-cap-base": {
    full: { top: "9%",  left: "50%", size: "17%", rotate: "-6deg" },
    bust: { top: "12%", left: "50%", size: "32%", rotate: "-6deg" },
  },
  "hat-helmet-climb": {
    full: { top: "7%",  left: "50%", size: "19%", rotate: "0deg" },
    bust: { top: "9%",  left: "50%", size: "36%", rotate: "0deg" },
  },
  "hat-crown-summit": {
    full: { top: "4%",  left: "50%", size: "20%", rotate: "0deg" },
    bust: { top: "5%",  left: "50%", size: "38%", rotate: "0deg" },
  },

  // Scarves
  "scarf-wool":   { full: { top: "31%", left: "50%", size: "17%", rotate: "0deg" }, bust: { top: "76%", left: "50%", size: "30%", rotate: "0deg" } },
  "scarf-aurora": { full: { top: "31%", left: "50%", size: "18%", rotate: "0deg" }, bust: { top: "76%", left: "50%", size: "32%", rotate: "0deg" } },

  // Backpacks (sit on the back / shoulder)
  "bp-day":        { full: { top: "36%", left: "22%", size: "17%", rotate: "-10deg" }, bust: { top: "64%", left: "18%", size: "26%", rotate: "-10deg" } },
  "bp-expedition": { full: { top: "34%", left: "20%", size: "20%", rotate: "-12deg" }, bust: { top: "62%", left: "16%", size: "28%", rotate: "-12deg" } },

  // Boots — render two: left and right foot. Position here is the *base*; renderer mirrors.
  "boots-trail": { full: { top: "93%", left: "44%", size: "13%", rotate: "0deg" }, bust: { top: "86%", left: "78%", size: "20%", rotate: "0deg" } },
  "boots-snow":  { full: { top: "93%", left: "44%", size: "14%", rotate: "0deg" }, bust: { top: "86%", left: "78%", size: "22%", rotate: "0deg" } },

  // Badges (chest pin)
  "badge-compass": { full: { top: "38%", left: "62%", size: "9%",  rotate: "0deg" }, bust: { top: "62%", left: "76%", size: "18%", rotate: "0deg" } },
  "badge-flag":    { full: { top: "37%", left: "62%", size: "10%", rotate: "8deg" }, bust: { top: "61%", left: "76%", size: "20%", rotate: "8deg" } },
  "badge-summit":  { full: { top: "37%", left: "62%", size: "11%", rotate: "0deg" }, bust: { top: "61%", left: "76%", size: "22%", rotate: "0deg" } },
};

/** Resolve placement for a given item id and slot, falling back to slot defaults. */
export function getGearPlacement(itemId: string, slot: CosmeticSlot): GearPlacement {
  const override = ITEM_OVERRIDES[itemId];
  const base = SLOT_DEFAULTS[slot];
  return {
    full: { ...base.full, ...(override?.full ?? {}) },
    bust: { ...base.bust, ...(override?.bust ?? {}) },
  };
}

/** Items that should render twice (one mirrored), e.g. boots. */
export function isPaired(slot: CosmeticSlot): boolean {
  return slot === "boots";
}