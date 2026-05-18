import { useEffect, useState } from "react";
import { COMPLETIONS_EVENT, getModuleCompletions, getActiveMountain, type ActiveMountainView } from "@/lib/completions";

/** Mirrors the set of completed challenge ids in a module. */
export function useChallengeCompletions(
  mountainId: string | undefined,
  moduleId: string | undefined,
): Set<string> {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!mountainId || !moduleId) return;
    let cancelled = false;
    const sync = () => {
      getModuleCompletions(mountainId, moduleId).then((next) => {
        if (!cancelled) setCompleted(next);
      });
    };
    sync();
    window.addEventListener(COMPLETIONS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(COMPLETIONS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [mountainId, moduleId]);
  return completed;
}

/** Mirrors the active "subiendo ahora" mountain (most recent <100%). */
export function useActiveMountain(): ActiveMountainView | null {
  const [active, setActive] = useState<ActiveMountainView | null>(null);
  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      getActiveMountain().then((next) => {
        if (!cancelled) setActive(next);
      });
    };
    sync();
    window.addEventListener(COMPLETIONS_EVENT, sync);
    window.addEventListener("sherpa:explorer-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(COMPLETIONS_EVENT, sync);
      window.removeEventListener("sherpa:explorer-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return active;
}