// Explorer profile (name, avatar, age band) — persisted in localStorage.
// Drives onboarding gating and soft UI density tuning.

const KEY = "sherpa.explorer.v1";

export type AgeBand = "4-6" | "7-8" | "9-10";

export interface ExplorerProfile {
  name: string;
  avatar: string; // emoji
  ageBand: AgeBand;
  createdAt: number;
}

export const AVATAR_CHOICES = ["🧗", "🦊", "🐻", "🦉", "🐧", "🦁", "🐰", "🐸"] as const;

export const AGE_BANDS: { id: AgeBand; label: string; hint: string }[] = [
  { id: "4-6",  label: "4 a 6 años",  hint: "Más visual, menos texto" },
  { id: "7-8",  label: "7 a 8 años",  hint: "Equilibrio justo" },
  { id: "9-10", label: "9 a 10 años", hint: "Más reto, más detalle" },
];

export const getExplorer = (): ExplorerProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExplorerProfile;
    if (!parsed?.name || !parsed?.avatar || !parsed?.ageBand) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveExplorer = (profile: Omit<ExplorerProfile, "createdAt">) => {
  try {
    const full: ExplorerProfile = { ...profile, createdAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(full));
    window.dispatchEvent(new CustomEvent("sherpa:explorer-changed"));
  } catch {
    // ignore
  }
};

export const clearExplorer = () => {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("sherpa:explorer-changed"));
  } catch {
    // ignore
  }
};

/** Soft density mapping for the UI based on age band. */
export const densityFor = (band: AgeBand) => {
  switch (band) {
    case "4-6":  return { scale: "lg" as const, textClass: "text-lg",  showSubtext: false };
    case "7-8":  return { scale: "md" as const, textClass: "text-base", showSubtext: true };
    case "9-10": return { scale: "sm" as const, textClass: "text-sm",  showSubtext: true };
  }
};
