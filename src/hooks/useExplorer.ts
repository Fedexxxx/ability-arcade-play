import { useEffect, useState } from "react";
import { getExplorer, type ExplorerProfile } from "@/lib/explorer";

/** React hook that mirrors the persisted explorer profile and reacts to changes. */
export const useExplorer = (): ExplorerProfile | null => {
  const [explorer, setExplorer] = useState<ExplorerProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      getExplorer().then((next) => {
        if (!cancelled) setExplorer(next);
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

  return explorer;
};
