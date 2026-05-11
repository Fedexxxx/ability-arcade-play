import { useEffect, useState } from "react";
import { getExplorer, type ExplorerProfile } from "@/lib/explorer";

export interface ExplorerState {
  explorer: ExplorerProfile | null;
  loading: boolean;
}

/** React hook that mirrors the persisted explorer profile and reacts to changes. */
export const useExplorer = (): ExplorerProfile | null => {
  return useExplorerState().explorer;
};

/** Same as useExplorer but exposes a loading flag for gates that need to wait. */
export const useExplorerState = (): ExplorerState => {
  const [state, setState] = useState<ExplorerState>({ explorer: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      setState((prev) => ({ explorer: prev.explorer, loading: true }));
      getExplorer().then((next) => {
        if (!cancelled) setState({ explorer: next, loading: false });
      });
    };
    sync();
    window.addEventListener("sherpa:explorer-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener("sherpa:explorer-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
};
