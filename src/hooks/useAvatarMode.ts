import { useEffect, useState } from "react";
import { AVATAR_MODE_EVENT, getAvatarMode, type AvatarMode } from "@/lib/avatarMode";

export function useAvatarMode(): AvatarMode {
  const [mode, setMode] = useState<AvatarMode>(() => getAvatarMode());
  useEffect(() => {
    const sync = () => setMode(getAvatarMode());
    window.addEventListener(AVATAR_MODE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AVATAR_MODE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return mode;
}