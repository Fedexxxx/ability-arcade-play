import { useEffect, useState } from "react";
import { getExplorer, type ExplorerProfile } from "@/lib/explorer";

/** React hook that mirrors the persisted explorer profile and reacts to changes. */
export const useExplorer = (): ExplorerProfile | null => {
  const [explorer, setExplorer] = useState<ExplorerProfile | null>(() => getExplorer());

  useEffect(() => {
    const sync = () => setExplorer(getExplorer());
    window.addEventListener("sherpa:explorer-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sherpa:explorer-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return explorer;
};
