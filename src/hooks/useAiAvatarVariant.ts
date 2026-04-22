import { useEffect, useState } from "react";
import {
  AI_AVATAR_VARIANT_EVENT,
  getAiVariant,
  type AiAvatarVariant,
} from "@/lib/aiAvatarCatalog";

export function useAiAvatarVariant(): AiAvatarVariant {
  const [v, setV] = useState<AiAvatarVariant>(() => getAiVariant());
  useEffect(() => {
    const sync = () => setV(getAiVariant());
    window.addEventListener(AI_AVATAR_VARIANT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AI_AVATAR_VARIANT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return v;
}