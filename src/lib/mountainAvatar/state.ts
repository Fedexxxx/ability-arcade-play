/**
 * Mountain Avatar — persisted configuration.
 * One small config object describes the entire layered avatar.
 */

import type {
  AccessoryColorId,
  HairColorId,
  OutfitColorId,
  SkinToneId,
} from "./palette";
import type {
  BackpackId,
  BadgeId,
  BootsId,
  BottomId,
  ExpressionId,
  HairStyleId,
  HatId,
  NeckId,
  TopId,
} from "./options";

const KEY = "sherpa.mountainAvatar.v1";
export const MOUNTAIN_AVATAR_EVENT = "sherpa:mountain-avatar-changed";

export interface MountainAvatar {
  // Identity
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  hairColor: HairColorId;
  expression: ExpressionId;

  // Clothing
  top: TopId;
  topColor: OutfitColorId;
  bottom: BottomId;
  bottomColor: OutfitColorId;
  boots: BootsId;
  bootsColor: OutfitColorId;

  // Accessories
  hat: HatId;
  hatColor: AccessoryColorId;
  neck: NeckId;
  neckColor: AccessoryColorId;
  backpack: BackpackId;
  backpackColor: AccessoryColorId;
  badge: BadgeId;
}

/** Default new-explorer look. Polished but intentionally simple. */
export const DEFAULT_MOUNTAIN_AVATAR: MountainAvatar = {
  skinTone:    "warm-light",
  hairStyle:   "soft-short",
  hairColor:   "chestnut",
  expression:  "friendly-curious",

  top:         "alpine-jacket",
  topColor:    "alpine-navy",
  bottom:      "trail-pants",
  bottomColor: "slate-stone",
  boots:       "classic-hiking",
  bootsColor:  "trail-taupe",

  hat:         "none",
  hatColor:    "rope-beige",
  neck:        "none",
  neckColor:   "cloud-white",
  backpack:    "none",
  backpackColor: "rope-beige",
  badge:       "none",
};

function read(): MountainAvatar {
  if (typeof window === "undefined") return { ...DEFAULT_MOUNTAIN_AVATAR };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_MOUNTAIN_AVATAR };
    const parsed = JSON.parse(raw) as Partial<MountainAvatar>;
    return { ...DEFAULT_MOUNTAIN_AVATAR, ...parsed };
  } catch {
    return { ...DEFAULT_MOUNTAIN_AVATAR };
  }
}

function write(state: MountainAvatar) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(MOUNTAIN_AVATAR_EVENT));
  } catch {
    // ignore
  }
}

export function getMountainAvatar(): MountainAvatar {
  return read();
}

export function saveMountainAvatar(patch: Partial<MountainAvatar>) {
  write({ ...read(), ...patch });
}

/** Replace whole config (used by presets and randomize). */
export function setMountainAvatar(next: MountainAvatar) {
  write({ ...next });
}

export function clearMountainAvatar() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(MOUNTAIN_AVATAR_EVENT));
  } catch {
    // ignore
  }
}