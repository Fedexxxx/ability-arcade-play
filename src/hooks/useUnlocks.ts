import { useEffect, useState } from "react";
import { getUnlocks, type UnlockedItem } from "@/lib/unlocks";

export function useUnlocks(): UnlockedItem[] {
  const [items, setItems] = useState<UnlockedItem[]>(() => getUnlocks());

  useEffect(() => {
    const refresh = () => setItems(getUnlocks());
    window.addEventListener("mindor:unlocks-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("mindor:unlocks-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return items;
}
