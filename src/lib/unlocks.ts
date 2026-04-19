// Persistence layer for unlocked badges and mastery titles (localStorage).

export type UnlockKind = "module" | "superpower";

export interface UnlockedItem {
  id: string;            // unique key: `${kind}:${spId}[:modId]`
  kind: UnlockKind;
  spId: string;
  modId?: string;        // only for module
  title: string;         // display title (e.g., "Maestro de Sumas hasta 10")
  superpowerTitle: string;
  category: string;      // superpower.category — used for filters
  icon: string;          // emoji
  unlockedAt: number;    // epoch ms
}

const KEY = "mindor.unlocks.v1";

function read(): UnlockedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: UnlockedItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    // Notify same-tab listeners
    window.dispatchEvent(new CustomEvent("mindor:unlocks-changed"));
  } catch {
    // ignore quota / private mode errors
  }
}

export function getUnlocks(): UnlockedItem[] {
  return read().sort((a, b) => b.unlockedAt - a.unlockedAt);
}

export function isUnlocked(id: string): boolean {
  return read().some((u) => u.id === id);
}

export function unlock(item: Omit<UnlockedItem, "unlockedAt"> & { unlockedAt?: number }) {
  const items = read();
  if (items.some((u) => u.id === item.id)) return; // dedupe
  items.push({ ...item, unlockedAt: item.unlockedAt ?? Date.now() });
  write(items);
}

export function unlockModule(opts: {
  spId: string;
  modId: string;
  moduleTitle: string;
  superpowerTitle: string;
  category: string;
  icon: string;
}) {
  unlock({
    id: `module:${opts.spId}:${opts.modId}`,
    kind: "module",
    spId: opts.spId,
    modId: opts.modId,
    title: `Maestro de ${opts.moduleTitle}`,
    superpowerTitle: opts.superpowerTitle,
    category: opts.category,
    icon: opts.icon,
  });
}

export function unlockSuperpower(opts: {
  spId: string;
  superpowerTitle: string;
  category: string;
  icon: string;
}) {
  unlock({
    id: `superpower:${opts.spId}`,
    kind: "superpower",
    spId: opts.spId,
    title: `Gran Maestro de ${opts.superpowerTitle}`,
    superpowerTitle: opts.superpowerTitle,
    category: opts.category,
    icon: opts.icon,
  });
}

export function clearUnlocks() {
  write([]);
}
