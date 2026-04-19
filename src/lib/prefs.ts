// User preferences for sound and motion (persisted in localStorage).

const SOUND_KEY = "mindor.prefs.sound";

export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const getSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(SOUND_KEY);
    if (raw === null) return true; // default ON
    return raw === "1";
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled: boolean) => {
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
    window.dispatchEvent(new CustomEvent("mindor:sound-changed"));
  } catch {
    // ignore
  }
};
