// Explorer profile (name, avatar, age band) — persisted in Lovable Cloud.
// A single UUID pointer is kept in localStorage to identify the active session.

import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "sherpa.explorer.session";

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

const getSessionId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

const setSessionId = (id: string | null) => {
  try {
    if (id) window.localStorage.setItem(SESSION_KEY, id);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
};

/**
 * Pushes the active explorer id into the Postgres session var that RLS
 * policies read via current_explorer_id(). Safe to call before every query.
 */
export const setExplorerContext = async (id: string | null): Promise<void> => {
  try {
    await supabase.rpc("set_config" as never, {
      setting_name: "app.explorer_id",
      new_value: id ?? "",
      is_local: false,
    } as never);
  } catch {
    // RPC may not be exposed yet; RLS will reject queries until it is.
  }
};

/** Reads the current explorer profile via the explorer_state view. */
export const getExplorer = async (): Promise<ExplorerProfile | null> => {
  const id = getSessionId();
  if (!id) return null;
  await setExplorerContext(id);
  const { data, error } = await supabase
    .from("explorer_state")
    .select("name, avatar_emoji, age_band, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data || !data.name || !data.avatar_emoji || !data.age_band) {
    return null;
  }
  return {
    name: data.name,
    avatar: data.avatar_emoji,
    ageBand: data.age_band as AgeBand,
    createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
  };
};

/** Creates a new explorer row; the DB trigger seeds wallet + progress. */
export const saveExplorer = async (
  profile: Omit<ExplorerProfile, "createdAt">,
): Promise<void> => {
  const { data, error } = await supabase
    .from("explorers")
    .insert({
      name: profile.name,
      avatar_emoji: profile.avatar,
      age_band: profile.ageBand,
    })
    .select("id")
    .single();
  if (error || !data) return;
  setSessionId(data.id);
  await setExplorerContext(data.id);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sherpa:explorer-changed"));
  }
};

/** Deletes the explorer row (cascade clears wallet, progress, items, etc.). */
export const clearExplorer = async (): Promise<void> => {
  const id = getSessionId();
  if (id) {
    await setExplorerContext(id);
    await supabase.from("explorers").delete().eq("id", id);
  }
  setSessionId(null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sherpa:explorer-changed"));
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
