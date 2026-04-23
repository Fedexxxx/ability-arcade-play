import { useEffect, useState } from "react";
import { readUiPrefs, UI_PREFS_EVENT, type UiPrefs } from "@/lib/uiPrefs";

export function useUiPrefs(): UiPrefs {
  const [p, setP] = useState<UiPrefs>(() => readUiPrefs());
  useEffect(() => {
    const sync = () => setP(readUiPrefs());
    window.addEventListener(UI_PREFS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(UI_PREFS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return p;
}