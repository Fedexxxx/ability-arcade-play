// Adaptive per-module tier engine.
// A "tier" is the difficulty band a child plays a given module at.
// Default tier is mapped from the explorer age band, then automatically
// promoted/demoted based on rolling per-module accuracy.

import type { AgeBand } from "@/lib/explorer";
import { setExplorerContext } from "@/lib/explorer";
import { supabase } from "@/integrations/supabase/client";

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
export function tierFromAgeBand(_band: AgeBand | undefined): Tier {
  // Age band drives UI density (text size, visual complexity) via
  // AgeDensityContext — NOT the starting difficulty tier. Every explorer
  // starts every module at "inicial"; the adaptive engine promotes from
  // there based on rolling per-module accuracy.
  return "inicial";
}

// ---------- Persistence ----------

export const TIER_EVENT = "sherpa:tier-changed";
const SESSION_KEY = "sherpa.explorer.session";

const RECENT_WINDOW = 6;
const PROMOTE_AT = 0.85; // ≥85% correct over the window → step up
const DEMOTE_AT  = 0.45; // ≤45% correct over the window → step down
const MIN_SAMPLES = 4;   // need at least this many results before adapting

interface ModuleStat {
  tier: Tier;
  pinned: boolean;
  recent: boolean[];
}

const getExplorerId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

const emitChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TIER_EVENT));
  }
};

async function fetchRow(
  explorerId: string,
  mountainId: string,
  moduleId: string,
): Promise<ModuleStat | null> {
  const { data } = await supabase
    .from("module_tiers")
    .select("tier, pinned, recent_results")
    .eq("explorer_id", explorerId)
    .eq("mountain_id", mountainId)
    .eq("module_id", moduleId)
    .maybeSingle();
  if (!data) return null;
  return {
    tier: data.tier as Tier,
    pinned: !!data.pinned,
    recent: Array.isArray(data.recent_results) ? (data.recent_results as boolean[]) : [],
  };
}

/** Resolve current tier for a module. Falls back to age-band default. */
export async function getModuleTier(
  mountainId: string,
  moduleId: string,
  ageBand: AgeBand | undefined,
): Promise<Tier> {
  const explorerId = getExplorerId();
  if (!explorerId) return tierFromAgeBand(ageBand);
  await setExplorerContext(explorerId);
  const row = await fetchRow(explorerId, mountainId, moduleId);
  return row?.tier ?? tierFromAgeBand(ageBand);
}

/** Returns the current per-module record (or a synthesized default). */
export async function getModuleStat(
  mountainId: string,
  moduleId: string,
  ageBand: AgeBand | undefined,
): Promise<ModuleStat> {
  const explorerId = getExplorerId();
  const fallback: ModuleStat = {
    tier: tierFromAgeBand(ageBand),
    pinned: false,
    recent: [],
  };
  if (!explorerId) return fallback;
  await setExplorerContext(explorerId);
  const row = await fetchRow(explorerId, mountainId, moduleId);
  return row ?? fallback;
}

/** Manual override — pins the tier so adaptation pauses. */
export async function setModuleTier(
  mountainId: string,
  moduleId: string,
  tier: Tier,
): Promise<void> {
  const explorerId = getExplorerId();
  if (!explorerId) return;
  await setExplorerContext(explorerId);
  await supabase
    .from("module_tiers")
    .upsert(
      {
        explorer_id: explorerId,
        mountain_id: mountainId,
        module_id: moduleId,
        tier,
        pinned: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "explorer_id,mountain_id,module_id" },
    );
  emitChange();
}

/** Clear a manual pin so adaptation resumes from the next attempt. */
export async function unpinModuleTier(
  mountainId: string,
  moduleId: string,
): Promise<void> {
  const explorerId = getExplorerId();
  if (!explorerId) return;
  await setExplorerContext(explorerId);
  await supabase
    .from("module_tiers")
    .update({ pinned: false, updated_at: new Date().toISOString() })
    .eq("explorer_id", explorerId)
    .eq("mountain_id", mountainId)
    .eq("module_id", moduleId);
  emitChange();
}

/**
 * Record a challenge result. When the rolling window is full enough the tier
 * is auto-promoted/demoted (unless the user pinned it).
 */
export async function recordChallengeResult(
  mountainId: string,
  moduleId: string,
  ageBand: AgeBand | undefined,
  correct: boolean,
): Promise<{ tier: Tier; changed: boolean; previous: Tier }> {
  const explorerId = getExplorerId();
  const fallbackTier = tierFromAgeBand(ageBand);
  if (!explorerId) {
    return { tier: fallbackTier, changed: false, previous: fallbackTier };
  }
  await setExplorerContext(explorerId);

  const prev = (await fetchRow(explorerId, mountainId, moduleId)) ?? {
    tier: fallbackTier,
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

  await supabase
    .from("module_tiers")
    .upsert(
      {
        explorer_id: explorerId,
        mountain_id: mountainId,
        module_id: moduleId,
        tier: nextTier,
        pinned: prev.pinned,
        recent_results: changed ? [] : recent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "explorer_id,mountain_id,module_id" },
    );

  emitChange();
  return { tier: nextTier, changed, previous: prev.tier };
}

export async function clearTiers(): Promise<void> {
  const explorerId = getExplorerId();
  if (!explorerId) return;
  await setExplorerContext(explorerId);
  await supabase.from("module_tiers").delete().eq("explorer_id", explorerId);
  emitChange();
}
