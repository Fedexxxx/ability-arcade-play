// Per-challenge completion ledger. Powers the "completado" check on
// challenge rows and the sequential unlock behavior inside a module.
// Also bumps explorer XP and the mountain_progress summary row used by
// "Subiendo ahora" on Basecamp / Mountains.

import { supabase } from "@/integrations/supabase/client";
import { setExplorerContext } from "@/lib/explorer";
import { findMountain } from "@/data/mountains";
import type { Tier } from "@/lib/tiers";

export const COMPLETIONS_EVENT = "sherpa:completions-changed";
const SESSION_KEY = "sherpa.explorer.session";

const getExplorerId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

const emit = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMPLETIONS_EVENT));
  }
};

/** Returns the set of completed challenge ids for a module. */
export async function getModuleCompletions(
  mountainId: string,
  moduleId: string,
): Promise<Set<string>> {
  const explorerId = getExplorerId();
  if (!explorerId) return new Set();
  await setExplorerContext(explorerId);
  const { data } = await supabase
    .from("challenge_completions")
    .select("challenge_id")
    .eq("explorer_id", explorerId)
    .eq("mountain_id", mountainId)
    .eq("module_id", moduleId);
  return new Set((data ?? []).map((r) => r.challenge_id as string));
}

/** Returns all completion rows for the active explorer in a mountain. */
async function getMountainCompletionCount(
  explorerId: string,
  mountainId: string,
): Promise<number> {
  const { count } = await supabase
    .from("challenge_completions")
    .select("id", { count: "exact", head: true })
    .eq("explorer_id", explorerId)
    .eq("mountain_id", mountainId);
  return count ?? 0;
}

/** Totals every challenge across every tier of every module in a mountain. */
function totalChallengesInMountain(mountainId: string): number {
  const mn = findMountain(mountainId);
  if (!mn) return 0;
  let total = 0;
  for (const mo of mn.modules) {
    if (!mo.byTier) continue;
    for (const tier of Object.keys(mo.byTier) as Tier[]) {
      total += mo.byTier[tier]?.length ?? 0;
    }
  }
  return total;
}

/** Records a single challenge as completed (idempotent). Also updates
 *  explorer XP and the mountain_progress summary row. */
export async function recordChallengeCompletion(opts: {
  mountainId: string;
  moduleId: string;
  challengeId: string;
  tier: Tier;
  xp: number;
}): Promise<{ alreadyDone: boolean }> {
  const explorerId = getExplorerId();
  if (!explorerId) return { alreadyDone: false };
  await setExplorerContext(explorerId);

  // Was it already recorded?
  const { data: existing } = await supabase
    .from("challenge_completions")
    .select("id")
    .eq("explorer_id", explorerId)
    .eq("mountain_id", opts.mountainId)
    .eq("module_id", opts.moduleId)
    .eq("challenge_id", opts.challengeId)
    .maybeSingle();

  if (existing) {
    emit();
    return { alreadyDone: true };
  }

  const { error } = await supabase.from("challenge_completions").insert({
    explorer_id: explorerId,
    mountain_id: opts.mountainId,
    module_id: opts.moduleId,
    challenge_id: opts.challengeId,
    tier: opts.tier,
  });
  if (error) {
    // Unique violation = race; treat as already-done.
    emit();
    return { alreadyDone: true };
  }

  // Bump explorer XP via SECURITY DEFINER RPC.
  if (opts.xp > 0) {
    await supabase.rpc("add_explorer_xp" as never, {
      p_explorer_id: explorerId,
      p_amount: opts.xp,
    } as never);
  }

  // Update the mountain_progress summary row used by "Subiendo ahora".
  const total = totalChallengesInMountain(opts.mountainId);
  const done = await getMountainCompletionCount(explorerId, opts.mountainId);
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const status = pct >= 100 ? "completed" : "in-progress";

  // Manual upsert (no PK on (explorer_id, mountain_id) in this table).
  const { data: existingMp } = await supabase
    .from("mountain_progress")
    .select("id")
    .eq("explorer_id", explorerId)
    .eq("mountain_id", opts.mountainId)
    .maybeSingle();
  if (existingMp) {
    await supabase
      .from("mountain_progress")
      .update({ pct_complete: pct, status, updated_at: new Date().toISOString() })
      .eq("id", existingMp.id);
  } else {
    await supabase.from("mountain_progress").insert({
      explorer_id: explorerId,
      mountain_id: opts.mountainId,
      pct_complete: pct,
      status,
    });
  }

  emit();
  return { alreadyDone: false };
}

export interface ActiveMountainView {
  mountainId: string;
  pct: number;
}

/** Returns the mountain where the explorer most recently made progress
 *  and which is not yet 100% complete. Null when nothing's started. */
export async function getActiveMountain(): Promise<ActiveMountainView | null> {
  const explorerId = getExplorerId();
  if (!explorerId) return null;
  await setExplorerContext(explorerId);
  const { data } = await supabase
    .from("mountain_progress")
    .select("mountain_id, pct_complete, status, updated_at")
    .eq("explorer_id", explorerId)
    .lt("pct_complete", 100)
    .order("updated_at", { ascending: false })
    .limit(1);
  const row = data?.[0];
  if (!row) return null;
  return { mountainId: row.mountain_id as string, pct: row.pct_complete as number };
}