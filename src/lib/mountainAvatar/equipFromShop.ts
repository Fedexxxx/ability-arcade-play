/**
 * When a user buys a shop item, auto-equip its mapped option onto the
 * MountainAvatar. Slot determines which avatar field changes.
 */

import type { CosmeticSlot } from "@/lib/wallet";
import { saveMountainAvatar, type MountainAvatar } from "./state";
import { SHOP_TO_OPTION } from "./unlocks";

export function equipShopItemOnAvatar(
  shopItemId: string,
  slot: CosmeticSlot,
) {
  const optionId = SHOP_TO_OPTION[shopItemId];
  if (!optionId) return;
  const patch: Partial<MountainAvatar> = {};
  switch (slot) {
    case "hat":
      patch.hat = optionId as MountainAvatar["hat"];
      break;
    case "scarf":
      patch.neck = optionId as MountainAvatar["neck"];
      break;
    case "backpack":
      patch.backpack = optionId as MountainAvatar["backpack"];
      break;
    case "boots":
      patch.boots = optionId as MountainAvatar["boots"];
      break;
    case "badge":
      patch.badge = optionId as MountainAvatar["badge"];
      break;
  }
  saveMountainAvatar(patch);
}

/** Mirror of `equip(slot, null)` for the avatar layer (un-equip back to none). */
export function unequipShopItemOnAvatar(slot: CosmeticSlot) {
  const patch: Partial<MountainAvatar> = {};
  switch (slot) {
    case "hat":      patch.hat = "none"; break;
    case "scarf":    patch.neck = "none"; break;
    case "backpack": patch.backpack = "none"; break;
    case "boots":    patch.boots = "classic-hiking"; break; // boots have no "none"
    case "badge":    patch.badge = "none"; break;
  }
  saveMountainAvatar(patch);
}