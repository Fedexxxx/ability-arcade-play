// Alticoins wallet — coin balance, ledger, owned & equipped cosmetics.
// Persisted in localStorage. Event-driven so multiple components stay in sync.

const KEY = "sherpa.wallet.v1";
export const WALLET_EVENT = "sherpa:wallet-changed";

export type EarnReason =
  | "challenge"
  | "module"
  | "superpower"
  | "streak"
  | "achievement"
  | "purchase";

export interface LedgerEntry {
  id: string;
  amount: number; // negative for spend
  reason: EarnReason;
  label: string;
  at: number;
}

/** Slot of a cosmetic item. One equipped per slot. */
export type CosmeticSlot = "hat" | "scarf" | "backpack" | "boots" | "badge";

export interface WalletState {
  balance: number;
  ledger: LedgerEntry[];
  owned: string[]; // item ids
  equipped: Partial<Record<CosmeticSlot, string>>; // slot -> item id
}

const EMPTY: WalletState = {
  balance: 0,
  ledger: [],
  owned: [],
  equipped: {},
};

function read(): WalletState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<WalletState>;
    return {
      balance: typeof parsed.balance === "number" ? parsed.balance : 0,
      ledger: Array.isArray(parsed.ledger) ? parsed.ledger : [],
      owned: Array.isArray(parsed.owned) ? parsed.owned : [],
      equipped: parsed.equipped && typeof parsed.equipped === "object" ? parsed.equipped : {},
    };
  } catch {
    return { ...EMPTY };
  }
}

function write(state: WalletState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(WALLET_EVENT));
  } catch {
    // ignore
  }
}

/** Deduplicated earn key — prevents double-credit on remounts. */
function dedupKey(reason: EarnReason, sourceId: string) {
  return `${reason}:${sourceId}`;
}

export function getWallet(): WalletState {
  return read();
}

/** Earn coins. Idempotent per (reason, sourceId). */
export function earn(opts: {
  amount: number;
  reason: EarnReason;
  sourceId: string;
  label: string;
}): { credited: boolean; balance: number } {
  if (opts.amount <= 0) return { credited: false, balance: read().balance };
  const state = read();
  const id = dedupKey(opts.reason, opts.sourceId);
  if (state.ledger.some((e) => e.id === id)) {
    return { credited: false, balance: state.balance };
  }
  const next: WalletState = {
    ...state,
    balance: state.balance + opts.amount,
    ledger: [
      ...state.ledger,
      { id, amount: opts.amount, reason: opts.reason, label: opts.label, at: Date.now() },
    ],
  };
  write(next);
  return { credited: true, balance: next.balance };
}

export function canAfford(price: number): boolean {
  return read().balance >= price;
}

/** Buy an item — debits balance, marks as owned, auto-equips its slot. */
export function buy(opts: {
  itemId: string;
  price: number;
  slot: CosmeticSlot;
  label: string;
}): { ok: boolean; reason?: "already_owned" | "insufficient_funds" } {
  const state = read();
  if (state.owned.includes(opts.itemId)) return { ok: false, reason: "already_owned" };
  if (state.balance < opts.price) return { ok: false, reason: "insufficient_funds" };
  const next: WalletState = {
    ...state,
    balance: state.balance - opts.price,
    owned: [...state.owned, opts.itemId],
    equipped: { ...state.equipped, [opts.slot]: opts.itemId },
    ledger: [
      ...state.ledger,
      {
        id: `purchase:${opts.itemId}:${Date.now()}`,
        amount: -opts.price,
        reason: "purchase",
        label: opts.label,
        at: Date.now(),
      },
    ],
  };
  write(next);
  return { ok: true };
}

export function equip(slot: CosmeticSlot, itemId: string | null) {
  const state = read();
  if (itemId && !state.owned.includes(itemId)) return;
  const equipped = { ...state.equipped };
  if (itemId) equipped[slot] = itemId;
  else delete equipped[slot];
  write({ ...state, equipped });
}

export function clearWallet() {
  write({ ...EMPTY });
}
