import { useEffect, useState } from "react";
import {
  TIER_EVENT,
  getModuleStat,
  type Tier,
} from "@/lib/tiers";
import { useExplorer } from "@/hooks/useExplorer";

/** Live tier + recent-accuracy view of a single module. */
export function useTier(mountainId: string | undefined, moduleId: string | undefined) {
  const explorer = useExplorer();
  const ageBand = explorer?.ageBand;

  const [stat, setStat] = useState(() =>
    mountainId && moduleId ? getModuleStat(mountainId, moduleId, ageBand) : null,
  );

  useEffect(() => {
    if (!mountainId || !moduleId) return;
    const sync = () => setStat(getModuleStat(mountainId, moduleId, ageBand));
    sync();
    window.addEventListener(TIER_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(TIER_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [mountainId, moduleId, ageBand]);

  const tier: Tier = stat?.tier ?? "inicial";
  return { tier, pinned: stat?.pinned ?? false, recent: stat?.recent ?? [] };
}
