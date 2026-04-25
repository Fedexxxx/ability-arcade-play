/**
 * Persisted character selection.
 *   - characterId: which explorer is currently shown.
 *   - ownedCharacterIds: gear-tier characters the user has unlocked.
 *
 * Migration from the legacy modular avatar:
 *   - Old `sherpa.mountainAvatar.v1` blob is ignored (the modular system is gone).
 *   - First time we run, if the user already had any old shop purchases
 *     (wallet.owned.length > 0) we grant them ONE gear character as a thank-you
 *     so their previous investment isn't lost.
 */

import { DEFAULT_CHARACTER_ID, FREE_CHARACTER_IDS } from "@/lib/characters";
import {
  BASECAMP_SKIN_VARIANTS,
  DEFAULT_SKIN_TONE,
  type BasecampSkinTone,
} from "@/lib/basecamp";

const KEY = "sherpa.character.v1";
const LEGACY_AVATAR_KEY = "sherpa.mountainAvatar.v1";
const MIGRATION_GIFT_ID = "snow-route-explorer";

export const CHARACTER_EVENT = "sherpa:character-changed";

export interface CharacterState {
  characterId: string;
  ownedCharacterIds: string[];
  /** Selected Basecamp skin tone — drives which PNG is shown as the user's avatar. */
  skinTone: BasecampSkinTone;
  /** Equipped Basecamp gear set id (or null for "no set / starter look"). */
  equippedGearSetId: string | null;
  /** Owned gear-set ids (Alticoins spent in the new shop). */
  ownedGearSetIds: string[];
  /** Set to true once we've processed the legacy shop migration gift. */
  migratedFromShopV1?: boolean;
}

const EMPTY: CharacterState = {
  characterId: DEFAULT_CHARACTER_ID,
  ownedCharacterIds: [],
  skinTone: DEFAULT_SKIN_TONE,
  equippedGearSetId: null,
  ownedGearSetIds: [],
};

const VALID_TONES = new Set(BASECAMP_SKIN_VARIANTS.map((v) => v.id));

function readRaw(): CharacterState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<CharacterState>;
    const tone =
      typeof parsed.skinTone === "string" && VALID_TONES.has(parsed.skinTone as BasecampSkinTone)
        ? (parsed.skinTone as BasecampSkinTone)
        : DEFAULT_SKIN_TONE;
    return {
      characterId:
        typeof parsed.characterId === "string" ? parsed.characterId : DEFAULT_CHARACTER_ID,
      ownedCharacterIds: Array.isArray(parsed.ownedCharacterIds)
        ? parsed.ownedCharacterIds
        : [],
      skinTone: tone,
      equippedGearSetId:
        typeof parsed.equippedGearSetId === "string" ? parsed.equippedGearSetId : null,
      ownedGearSetIds: Array.isArray(parsed.ownedGearSetIds) ? parsed.ownedGearSetIds : [],
      migratedFromShopV1: !!parsed.migratedFromShopV1,
    };
  } catch {
    return { ...EMPTY };
  }
}

function write(state: CharacterState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CHARACTER_EVENT));
  } catch {
    // ignore
  }
}

/** Read the current state, applying any one-time migrations. */
export function getCharacterState(): CharacterState {
  const state = readRaw();
  if (state.migratedFromShopV1) return state;
  if (typeof window === "undefined") return state;

  // One-time migration: gift one gear character if the user previously bought
  // anything in the old modular shop.
  let hadLegacyPurchases = false;
  try {
    const walletRaw = window.localStorage.getItem("sherpa.wallet.v1");
    if (walletRaw) {
      const wallet = JSON.parse(walletRaw) as { owned?: unknown };
      if (Array.isArray(wallet.owned) && wallet.owned.length > 0) {
        hadLegacyPurchases = true;
      }
    }
    // Also clean up the dead modular avatar blob.
    window.localStorage.removeItem(LEGACY_AVATAR_KEY);
  } catch {
    // ignore
  }

  const next: CharacterState = {
    ...state,
    ownedCharacterIds: hadLegacyPurchases
      ? Array.from(new Set([...state.ownedCharacterIds, MIGRATION_GIFT_ID]))
      : state.ownedCharacterIds,
    migratedFromShopV1: true,
  };
  write(next);
  return next;
}

export function getCharacterId(): string {
  return getCharacterState().characterId;
}

export function setCharacterId(id: string) {
  const s = getCharacterState();
  if (s.characterId === id) return;
  write({ ...s, characterId: id });
}

/** Pick a skin tone for Basecamp. */
export function setSkinTone(tone: BasecampSkinTone) {
  const s = getCharacterState();
  if (s.skinTone === tone) return;
  write({ ...s, skinTone: tone });
}

/** Equip a gear set the user already owns. Pass null to remove the set. */
export function equipGearSet(id: string | null) {
  const s = getCharacterState();
  if (id !== null && !s.ownedGearSetIds.includes(id)) return;
  if (s.equippedGearSetId === id) return;
  write({ ...s, equippedGearSetId: id });
}

/** Mark a gear set as owned and equip it. */
export function unlockGearSet(id: string) {
  const s = getCharacterState();
  const owned = s.ownedGearSetIds.includes(id)
    ? s.ownedGearSetIds
    : [...s.ownedGearSetIds, id];
  write({ ...s, ownedGearSetIds: owned, equippedGearSetId: id });
}

export function ownsCharacter(id: string, state?: CharacterState): boolean {
  const s = state ?? getCharacterState();
  if (FREE_CHARACTER_IDS.includes(id)) return true;
  return s.ownedCharacterIds.includes(id);
}

/** Mark a gear-tier character as owned and equip it. */
export function unlockCharacter(id: string) {
  const s = getCharacterState();
  if (s.ownedCharacterIds.includes(id)) {
    write({ ...s, characterId: id });
    return;
  }
  write({
    ...s,
    characterId: id,
    ownedCharacterIds: [...s.ownedCharacterIds, id],
  });
}

export function clearCharacterState() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(CHARACTER_EVENT));
  } catch {
    // ignore
  }
}
