import { useEffect, useState } from "react";
import { MOUNTAIN_AVATAR_EVENT, getMountainAvatar, type MountainAvatar } from "@/lib/mountainAvatar";

export function useMountainAvatar(): MountainAvatar {
  const [a, setA] = useState<MountainAvatar>(() => getMountainAvatar());
  useEffect(() => {
    const sync = () => setA(getMountainAvatar());
    window.addEventListener(MOUNTAIN_AVATAR_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(MOUNTAIN_AVATAR_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return a;
}
