/**
 * Bridge between MountainAvatar option ids and the existing wallet `owned`
 * state. Lets the customize UI know which gear options are unlocked.
 *
 * Migration mapping (old shop item id → new option id) is encoded in
 * SHOP_TO_OPTION so existing purchases keep working visually.
 */

import type { WalletState } from "@/lib/wallet";
import {
  BACKPACK_OPTIONS,
  BADGE_OPTIONS,
  BOOTS_OPTIONS,
  HAT_OPTIONS,
  NECK_OPTIONS,
  TOP_OPTIONS,
  type GearOption,
} from "./options";

/**
 * Old shop item id → new MountainAvatar option id.
 * Existing user wallets reference these old ids; map them forward so
 * previous purchases unlock the new equivalents.
 */
export const SHOP_TO_OPTION: Record<string, string> = {
  // Hats
  "hat-cap-base":     "mountain-cap",
  "hat-helmet-climb": "explorer-beanie",
  "hat-crown-summit": "sherpa-wool",

  // Scarves
  "scarf-wool":       "scarf",
  "scarf-aurora":     "neck-warmer",

  // Backpacks
  "bp-day":           "compact-trail",
  "bp-expedition":    "round-explorer",

  // Boots
  "boots-trail":      "classic-hiking",
  "boots-snow":       "snow-friendly",

  // Badges
  "badge-compass":    "compass",
  "badge-flag":       "map-pin",
  "badge-summit":     "mountain",
};

/**
 * Returns the set of unlocked option ids the user can equip:
 *  - every "free: true" option,
 *  - plus every option mapped from a wallet-owned shop item.
 */
export function unlockedOptionIds(wallet: WalletState): Set<string> {
  const set = new Set<string>();
  const all: GearOption[] = [
    ...TOP_OPTIONS,
    ...BOTTOM_OPTIONS_FREE_LIST(),
    ...BOOTS_OPTIONS,
    ...HAT_OPTIONS,
    ...NECK_OPTIONS,
    ...BACKPACK_OPTIONS,
    ...BADGE_OPTIONS,
  ];
  for (const o of all) if (o.free) set.add(o.id);
  for (const ownedId of wallet.owned) {
    const mapped = SHOP_TO_OPTION[ownedId];
    if (mapped) set.add(mapped);
  }
  return set;
}

// Bottoms list lives in options.ts; re-import to avoid circular deps.
import { BOTTOM_OPTIONS } from "./options";
function BOTTOM_OPTIONS_FREE_LIST() {
  return BOTTOM_OPTIONS;
}

/** Returns true if the given option id can be equipped right now. */
export function isOptionUnlocked(
  optionId: string,
  unlocked: Set<string>,
): boolean {
  return unlocked.has(optionId);
}