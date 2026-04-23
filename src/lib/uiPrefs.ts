// Lightweight UI-only prefs that complement the AI avatar variant.
// Currently: hair color tint (CSS overlay) and a coarse hair "type" label.

export type HairTypeId = "corto" | "medio" | "largo";

export interface UiPrefs {
  hairType: HairTypeId;
  hairColor: string; // hex
}

const KEY = "sherpa.customize.uiPrefs.v2";
const EVENT = "sherpa:customize-ui-prefs";

export const DEFAULT_UI_PREFS: UiPrefs = {
  hairType: "corto",
  hairColor: "#3A2418", // natural brown — close to the base AI render
};

export const HAIR_COLORS: { hex: string; label: string }[] = [
  { hex: "#1F1A18", label: "Cuervo" },
  { hex: "#3A2418", label: "Castaño" },
  { hex: "#9C6A2A", label: "Miel" },
  { hex: "#D6622B", label: "Zanahoria" },
];

export function readUiPrefs(): UiPrefs {
  if (typeof window === "undefined") return { ...DEFAULT_UI_PREFS };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_UI_PREFS };
    return { ...DEFAULT_UI_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_UI_PREFS };
  }
}

export function writeUiPrefs(patch: Partial<UiPrefs>) {
  try {
    const next = { ...readUiPrefs(), ...patch };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

export const UI_PREFS_EVENT = EVENT;