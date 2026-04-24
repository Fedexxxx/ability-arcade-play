/**
 * Compatibility-aware avatar randomizer + soft validator.
 * Per project decision, manual editing has NO restrictions; only the
 * randomize button enforces friendly combos.
 */

import {
  ACCENT_ACCESSORY,
  ACCENT_OUTFIT,
  getAccessoryHex,
  getHairHex,
  getOutfitHex,
  getSkinHex,
  luminance,
  type AccessoryColorId,
  type HairColorId,
  type OutfitColorId,
} from "./palette";
import {
  ACC_COLOR_CHOICES,
  BACKPACK_OPTIONS,
  BADGE_OPTIONS,
  BOOTS_COLOR_CHOICES,
  BOOTS_OPTIONS,
  BOTTOM_COLOR_CHOICES,
  BOTTOM_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_STYLES,
  HAT_OPTIONS,
  NECK_OPTIONS,
  SKIN_TONES,
  TOP_COLOR_CHOICES,
  TOP_OPTIONS,
  type GearOption,
} from "./options";
import { DEFAULT_MOUNTAIN_AVATAR, type MountainAvatar } from "./state";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnlocked<T extends GearOption>(arr: T[], unlocked: Set<string>): T {
  const eligible = arr.filter((o) => o.free || unlocked.has(o.id));
  return pick(eligible.length ? eligible : arr.filter((o) => o.free));
}

/**
 * Build a friendly, mountain-coherent random avatar.
 * Honors unlocks: only picks gear the player owns or that's free.
 */
export function randomizeAvatar(unlocked: Set<string>): MountainAvatar {
  const skin = pick(SKIN_TONES).id;
  const skinL = luminance(getSkinHex(skin));

  // Hair: pick a color with at least 0.18 luminance distance from skin.
  const hairCandidates = HAIR_COLOR_OPTIONS.filter(
    (h) => Math.abs(luminance(getHairHex(h.id)) - skinL) >= 0.18,
  );
  const hairColor: HairColorId = pick(
    hairCandidates.length ? hairCandidates : HAIR_COLOR_OPTIONS,
  ).id;

  // Top color: avoid clashing with skin (must differ in luminance).
  const topColorCandidates = TOP_COLOR_CHOICES.filter(
    (c) => Math.abs(luminance(getOutfitHex(c)) - skinL) >= 0.15,
  );
  const topColor: OutfitColorId = pick(
    topColorCandidates.length ? topColorCandidates : TOP_COLOR_CHOICES,
  );

  // Bottom color: should differ from top (avoid monochrome look).
  const bottomColor: OutfitColorId = pick(
    BOTTOM_COLOR_CHOICES.filter((c) => c !== topColor),
  );

  // Boots color: prefer neutrals.
  const bootsColor: OutfitColorId = pick(BOOTS_COLOR_CHOICES);

  // Track accent count — at most two strong accents across outfit + accessories.
  let accents = 0;
  if (ACCENT_OUTFIT.includes(topColor)) accents++;

  // Accessory color picker that respects the budget.
  const pickAccColor = (allow: AccessoryColorId[]): AccessoryColorId => {
    if (accents >= 2) {
      const safe = allow.filter((c) => !ACCENT_ACCESSORY.includes(c));
      const c = pick(safe.length ? safe : allow);
      if (ACCENT_ACCESSORY.includes(c)) accents++;
      return c;
    }
    const c = pick(allow);
    if (ACCENT_ACCESSORY.includes(c)) accents++;
    return c;
  };

  return {
    skinTone: skin,
    hairStyle: pick(HAIR_STYLES).id,
    hairColor,
    expression: DEFAULT_MOUNTAIN_AVATAR.expression,

    top: pickUnlocked(TOP_OPTIONS, unlocked).id,
    topColor,
    bottom: pickUnlocked(BOTTOM_OPTIONS, unlocked).id,
    bottomColor,
    boots: pickUnlocked(BOOTS_OPTIONS, unlocked).id,
    bootsColor,

    hat: pickUnlocked(HAT_OPTIONS, unlocked).id,
    hatColor: pickAccColor(ACC_COLOR_CHOICES),
    neck: pickUnlocked(NECK_OPTIONS, unlocked).id,
    neckColor: pickAccColor(ACC_COLOR_CHOICES),
    backpack: pickUnlocked(BACKPACK_OPTIONS, unlocked).id,
    backpackColor: pickAccColor(ACC_COLOR_CHOICES),
    badge: pickUnlocked(BADGE_OPTIONS, unlocked).id,
  };
}

/** Soft validator — used for hint surfaces (not enforcement). */
export function avatarHints(a: MountainAvatar): string[] {
  const out: string[] = [];
  const skinL = luminance(getSkinHex(a.skinTone));
  if (Math.abs(luminance(getHairHex(a.hairColor)) - skinL) < 0.12) {
    out.push("Tu pelo y tu piel tienen tonos parecidos. Prueba un color con más contraste.");
  }
  if (Math.abs(luminance(getOutfitHex(a.topColor)) - skinL) < 0.1) {
    out.push("Tu chaqueta se confunde un poco con tu piel.");
  }
  let accents = 0;
  if (ACCENT_OUTFIT.includes(a.topColor)) accents++;
  if (ACCENT_ACCESSORY.includes(a.hatColor) && a.hat !== "none") accents++;
  if (ACCENT_ACCESSORY.includes(a.neckColor) && a.neck !== "none") accents++;
  if (ACCENT_ACCESSORY.includes(a.backpackColor) && a.backpack !== "none") accents++;
  if (accents > 2) out.push("Demasiados colores intensos a la vez. Quita uno para equilibrar.");
  return out;
}

// Re-export the hex util used by Customize hints surface.
export { getAccessoryHex };