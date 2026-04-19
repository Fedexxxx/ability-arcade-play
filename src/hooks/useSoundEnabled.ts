import { useEffect, useState } from "react";
import { getSoundEnabled, setSoundEnabled } from "@/lib/prefs";

export function useSoundEnabled(): [boolean, (v: boolean) => void] {
  const [enabled, setEnabled] = useState<boolean>(() => getSoundEnabled());

  useEffect(() => {
    const refresh = () => setEnabled(getSoundEnabled());
    window.addEventListener("mindor:sound-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("mindor:sound-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const update = (v: boolean) => {
    setSoundEnabled(v);
    setEnabled(v);
  };

  return [enabled, update];
}
