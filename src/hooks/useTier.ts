import { useEffect, useState } from "react";
import {
  TIER_EVENT,
  getModuleStat,
  tierFromAgeBand,
  type Tier,
} from "@/lib/tiers";
import { useExplorer } from "@/hooks/useExplorer";

interface ModuleStatView {
  tier: Tier;
  pinned: boolean;
  recent: boolean[];
}

/** Live tier + recent-accuracy view of a single module. */
export function useTier(mountainId: string | undefined, moduleId: string | undefined) {
  const explorer = useExplorer();
  const ageBand = explorer?.ageBand;

  const [stat, setStat] = useState<ModuleStatView | null>(null);

  useEffect(() => {
    if (!mountainId || !moduleId) return;
    let cancelled = false;
    const sync = () => {
      getModuleStat(mountainId, moduleId, ageBand).then((next) => {
        if (!cancelled) setStat(next);
      });
    };
    sync();
    window.addEventListener(TIER_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(TIER_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [mountainId, moduleId, ageBand]);

  const tier: Tier = stat?.tier ?? tierFromAgeBand(ageBand);
  return { tier, pinned: stat?.pinned ?? false, recent: stat?.recent ?? [] };
}
