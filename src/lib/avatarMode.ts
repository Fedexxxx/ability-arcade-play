// Avatar rendering mode toggle (A/B prototype):
//   "svg" — current layered ExplorerSvg (default, used everywhere)
//   "ai"  — pre-rendered AI PNGs (only honored on /personalizar and /perfil header)

const KEY = "sherpa.avatarMode";
const EVENT = "sherpa:avatar-mode-changed";

export type AvatarMode = "svg" | "ai";

export function getAvatarMode(): AvatarMode {
  if (typeof window === "undefined") return "svg";
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "ai" ? "ai" : "svg";
  } catch {
    return "svg";
  }
}

export function setAvatarMode(mode: AvatarMode) {
  try {
    window.localStorage.setItem(KEY, mode);
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

export const AVATAR_MODE_EVENT = EVENT;