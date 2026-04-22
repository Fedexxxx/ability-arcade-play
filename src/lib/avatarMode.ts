// Avatar rendering mode — locked to AI Pixar style.
// The classic SVG mode was removed; this module is kept as a thin shim
// so existing imports (useAvatarMode, AVATAR_MODE_EVENT) keep compiling.

const EVENT = "sherpa:avatar-mode-changed";

export type AvatarMode = "ai";

export function getAvatarMode(): AvatarMode {
  return "ai";
}

export function setAvatarMode(_mode: AvatarMode) {
  // no-op — mode is locked to "ai"
}

export const AVATAR_MODE_EVENT = EVENT;