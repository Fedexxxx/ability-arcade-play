// Adaptive per-module tier engine.
// A "tier" is the difficulty band a child plays a given module at.
// Default tier is mapped from the explorer age band, then automatically
// promoted/demoted based on rolling per-module accuracy.

import type { AgeBand } from "@/lib/explorer";

export type Tier = "inicial" | "avanzado" | "experto";

export const TIER_ORDER: Tier[] = ["inicial", "avanzado", "experto"];

export const TIER_LABEL: Record<Tier, string> = {
  inicial:  "Inicial",
  avanzado: "Avanzado",
  experto:  "Experto",
};

export const TIER_HINT: Record<Tier, string> = {
  inicial:  "Pasos suaves",
  avanzado: "Subida firme",
  experto:  "Cumbre exigente",
};

/** Map onboarding age band to a starting tier. */
export function tierFromAgeBand(band: AgeBand | undefined): Tier {
  switch (band) {
    case "4-6":  return "inicial";
    case "7-8":  return "avanzado";
    case "9-10": return "experto";
    default:     return "inicial";
  }
}

// ---------- Persistence ----------

const KEY = "sherpa.tiers.v1";
export const TIER_EVENT = "sherpa:tier-changed";

/** Per-module accuracy ledger: keeps the last N challenge results to drive adaptation. */
interface ModuleStat {
  /** Most recent tier the module was played at. */
  tier: Tier;
  /** True if the user manually overrode the tier (auto-adapt is paused). */
  pinned: boolean;
  /** Last results — `true` = correct, `false` = incorrect. Capped to RECENT_WINDOW. */
  recent: boolean[];
}

interface TiersState {
  /** key: `${mountainId}:${moduleId}` */
  modules: Record<string, ModuleStat>;
}

const EMPTY: TiersState = { modules: {} };
const RECENT_WINDOW = 6;
const PROMOTE_AT = 0.85; // ≥85% correct over the window → step up
const DEMOTE_AT  = 0.45; // ≤45% correct over the window → step down
const MIN_SAMPLES = 4;   // need at least this many results before adapting

function read(): TiersState {
  if (typeof window === "undefined") return { modules: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { modules: {} };
    const parsed = JSON.parse(raw) as Partial<TiersState>;
    return { modules: parsed.modules ?? {} };
  } catch {
    return { modules: {} };
  }
}

function write(state: TiersState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(TIER_EVENT));
  } catch {
    // ignore
  }
}

function moduleKey(mountainId: string, moduleId: string) {
  return `${mountainId}:${moduleId}`;
}

/** Resolve current tier for a module. Falls back to age-band default. */
export function getModuleTier(
  mountainId: string,
  moduleId: string,
  ageBand: AgeBand | undefined,
): Tier {
  const state = read();
  const stat = state.modules[moduleKey(mountainId, moduleId)];
  if (stat?.tier) return stat.tier;
  return tierFromAgeBand(ageBand);
}

/** Returns the current per-module record (or a synthesized default). */
export function getModuleStat(
  mountainId: string,
  moduleId: string,
  ageBand: AgeBand | undefined,
): ModuleStat {
  const state = read();
  return (
    state.modules[moduleKey(mountainId, moduleId)] ?? {
      tier: tierFromAgeBand(ageBand),
      pinned: false,
      recent: [],
    }
  );
}

/** Manual override — pins the tier so adaptation pauses. */
export function setModuleTier(mountainId: string, moduleId: string, tier: Tier) {
  const state = read();
  const key = moduleKey(mountainId, moduleId);
  const prev = state.modules[key] ?? { tier, pinned: true, recent: [] };
  state.modules[key] = { ...prev, tier, pinned: true };
  write(state);
}

/** Clear a manual pin so adaptation resumes from the next attempt. */
export function unpinModuleTier(mountainId: string, moduleId: string) {
  const state = read();
  const key = moduleKey(mountainId, moduleId);
  const prev = state.modules[key];
  if (!prev) return;
  state.modules[key] = { ...prev, pinned: false };
  write(state);
}

/**
 * Record a challenge result. When the rolling window is full enough the tier
 * is auto-promoted/demoted (unless the user pinned it).
 * Returns the resulting tier and whether it changed.
 */
export function recordChallengeResult(
  mountainId: string,
  moduleId: string,
  ageBand: AgeBand | undefined,
  correct: boolean,
): { tier: Tier; changed: boolean; previous: Tier } {
  const state = read();
  const key = moduleKey(mountainId, moduleId);
  const prev = state.modules[key] ?? {
    tier: tierFromAgeBand(ageBand),
    pinned: false,
    recent: [] as boolean[],
  };

  const recent = [...prev.recent, correct].slice(-RECENT_WINDOW);
  let nextTier = prev.tier;
  let changed = false;

  if (!prev.pinned && recent.length >= MIN_SAMPLES) {
    const accuracy = recent.filter(Boolean).length / recent.length;
    const idx = TIER_ORDER.indexOf(prev.tier);
    if (accuracy >= PROMOTE_AT && idx < TIER_ORDER.length - 1) {
      nextTier = TIER_ORDER[idx + 1];
      changed = true;
    } else if (accuracy <= DEMOTE_AT && idx > 0) {
      nextTier = TIER_ORDER[idx - 1];
      changed = true;
    }
  }

  // Reset the window when the tier shifts so the next adaptation needs fresh data.
  state.modules[key] = {
    tier: nextTier,
    pinned: prev.pinned,
    recent: changed ? [] : recent,
  };
  write(state);

  return { tier: nextTier, changed, previous: prev.tier };
}

export function clearTiers() {
  write({ modules: {} });
}
