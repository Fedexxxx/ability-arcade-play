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

const KEY = "sherpa.character.v1";
const LEGACY_AVATAR_KEY = "sherpa.mountainAvatar.v1";
const MIGRATION_GIFT_ID = "snow-route-explorer";

export const CHARACTER_EVENT = "sherpa:character-changed";

export interface CharacterState {
  characterId: string;
  ownedCharacterIds: string[];
  /** Set to true once we've processed the legacy shop migration gift. */
  migratedFromShopV1?: boolean;
}

const EMPTY: CharacterState = {
  characterId: DEFAULT_CHARACTER_ID,
  ownedCharacterIds: [],
};

function readRaw(): CharacterState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<CharacterState>;
    return {
      characterId:
        typeof parsed.characterId === "string" ? parsed.characterId : DEFAULT_CHARACTER_ID,
      ownedCharacterIds: Array.isArray(parsed.ownedCharacterIds)
        ? parsed.ownedCharacterIds
        : [],
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
