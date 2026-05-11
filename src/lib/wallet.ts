// Alticoins wallet — coin balance, ledger, owned & equipped cosmetics.
// Persisted in Lovable Cloud. Event-driven so multiple components stay in sync.

import { supabase } from "@/integrations/supabase/client";
import { setExplorerContext } from "@/lib/explorer";

export const WALLET_EVENT = "sherpa:wallet-changed";
const SESSION_KEY = "sherpa.explorer.session";

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

const getExplorerId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

const emitChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(WALLET_EVENT));
  }
};

const dedupKey = (reason: EarnReason, sourceId: string) => `${reason}:${sourceId}`;

/** Reads the full wallet snapshot for the active explorer. */
export async function getWallet(): Promise<WalletState> {
  const explorerId = getExplorerId();
  if (!explorerId) return { ...EMPTY };
  await setExplorerContext(explorerId);

  const [walletRes, itemsRes, ledgerRes] = await Promise.all([
    supabase.from("wallet").select("balance").eq("explorer_id", explorerId).maybeSingle(),
    supabase
      .from("owned_items")
      .select("item_id, slot, equipped")
      .eq("explorer_id", explorerId),
    supabase
      .from("ledger_entries")
      .select("dedup_key, amount, reason, label, created_at")
      .eq("explorer_id", explorerId)
      .order("created_at", { ascending: true }),
  ]);

  const balance = walletRes.data?.balance ?? 0;
  const owned = (itemsRes.data ?? []).map((i) => i.item_id);
  const equipped: Partial<Record<CosmeticSlot, string>> = {};
  for (const item of itemsRes.data ?? []) {
    if (item.equipped) equipped[item.slot as CosmeticSlot] = item.item_id;
  }
  const ledger: LedgerEntry[] = (ledgerRes.data ?? []).map((e) => ({
    id: e.dedup_key,
    amount: e.amount,
    reason: e.reason as EarnReason,
    label: e.label,
    at: e.created_at ? new Date(e.created_at).getTime() : Date.now(),
  }));

  return { balance, ledger, owned, equipped };
}

/** Earn coins. Idempotent per (reason, sourceId). */
export async function earn(opts: {
  amount: number;
  reason: EarnReason;
  sourceId: string;
  label: string;
}): Promise<{ credited: boolean; balance: number }> {
  const explorerId = getExplorerId();
  if (!explorerId || opts.amount <= 0) {
    const snap = await getWallet();
    return { credited: false, balance: snap.balance };
  }
  await setExplorerContext(explorerId);

  const id = dedupKey(opts.reason, opts.sourceId);
  const { error: insertError } = await supabase.from("ledger_entries").insert({
    explorer_id: explorerId,
    dedup_key: id,
    amount: opts.amount,
    reason: opts.reason,
    label: opts.label,
  });

  if (insertError) {
    // Unique violation = already credited; treat as no-op.
    const snap = await getWallet();
    return { credited: false, balance: snap.balance };
  }

  const { data: walletRow } = await supabase
    .from("wallet")
    .select("balance")
    .eq("explorer_id", explorerId)
    .maybeSingle();
  const newBalance = (walletRow?.balance ?? 0) + opts.amount;
  await supabase.from("wallet").update({ balance: newBalance }).eq("explorer_id", explorerId);

  emitChange();
  return { credited: true, balance: newBalance };
}

export async function canAfford(price: number): Promise<boolean> {
  const explorerId = getExplorerId();
  if (!explorerId) return false;
  await setExplorerContext(explorerId);
  const { data } = await supabase
    .from("wallet")
    .select("balance")
    .eq("explorer_id", explorerId)
    .maybeSingle();
  return (data?.balance ?? 0) >= price;
}

async function debit(
  explorerId: string,
  amount: number,
  label: string,
  dedup: string,
): Promise<{ ok: boolean; balance: number }> {
  const { data: walletRow } = await supabase
    .from("wallet")
    .select("balance")
    .eq("explorer_id", explorerId)
    .maybeSingle();
  const current = walletRow?.balance ?? 0;
  if (current < amount) return { ok: false, balance: current };

  const { error: ledgerError } = await supabase.from("ledger_entries").insert({
    explorer_id: explorerId,
    dedup_key: dedup,
    amount: -amount,
    reason: "purchase",
    label,
  });
  if (ledgerError) return { ok: false, balance: current };

  const newBalance = current - amount;
  await supabase.from("wallet").update({ balance: newBalance }).eq("explorer_id", explorerId);
  return { ok: true, balance: newBalance };
}

/** Buy a cosmetic — debits balance, marks owned, auto-equips its slot. */
export async function buy(opts: {
  itemId: string;
  price: number;
  slot: CosmeticSlot;
  label: string;
}): Promise<{ ok: boolean; reason?: "already_owned" | "insufficient_funds" }> {
  const explorerId = getExplorerId();
  if (!explorerId) return { ok: false, reason: "insufficient_funds" };
  await setExplorerContext(explorerId);

  const { data: existing } = await supabase
    .from("owned_items")
    .select("id")
    .eq("explorer_id", explorerId)
    .eq("item_id", opts.itemId)
    .maybeSingle();
  if (existing) return { ok: false, reason: "already_owned" };

  const result = await debit(
    explorerId,
    opts.price,
    opts.label,
    `purchase:${opts.itemId}:${Date.now()}`,
  );
  if (!result.ok) return { ok: false, reason: "insufficient_funds" };

  // Unequip others in the slot, then add as equipped.
  await supabase
    .from("owned_items")
    .update({ equipped: false })
    .eq("explorer_id", explorerId)
    .eq("slot", opts.slot);
  await supabase.from("owned_items").insert({
    explorer_id: explorerId,
    item_id: opts.itemId,
    slot: opts.slot,
    equipped: true,
  });

  emitChange();
  return { ok: true };
}

/** Generic spend (character shop). Records ownership for traceability. */
export async function spend(opts: {
  id: string;
  price: number;
  label: string;
}): Promise<{ ok: boolean; reason?: "already_owned" | "insufficient_funds" }> {
  const explorerId = getExplorerId();
  if (!explorerId) return { ok: false, reason: "insufficient_funds" };
  await setExplorerContext(explorerId);

  const { data: existing } = await supabase
    .from("owned_items")
    .select("id")
    .eq("explorer_id", explorerId)
    .eq("item_id", opts.id)
    .maybeSingle();
  if (existing) return { ok: false, reason: "already_owned" };

  const result = await debit(
    explorerId,
    opts.price,
    opts.label,
    `purchase:${opts.id}:${Date.now()}`,
  );
  if (!result.ok) return { ok: false, reason: "insufficient_funds" };

  await supabase.from("owned_items").insert({
    explorer_id: explorerId,
    item_id: opts.id,
    slot: "badge",
    equipped: false,
  });

  emitChange();
  return { ok: true };
}

export async function equip(slot: CosmeticSlot, itemId: string | null): Promise<void> {
  const explorerId = getExplorerId();
  if (!explorerId) return;
  await setExplorerContext(explorerId);

  // Clear any currently equipped item in this slot.
  await supabase
    .from("owned_items")
    .update({ equipped: false })
    .eq("explorer_id", explorerId)
    .eq("slot", slot);

  if (itemId) {
    const { data: owned } = await supabase
      .from("owned_items")
      .select("id")
      .eq("explorer_id", explorerId)
      .eq("item_id", itemId)
      .maybeSingle();
    if (!owned) return;
    await supabase
      .from("owned_items")
      .update({ equipped: true })
      .eq("explorer_id", explorerId)
      .eq("item_id", itemId);
  }

  emitChange();
}

export async function clearWallet(): Promise<void> {
  const explorerId = getExplorerId();
  if (!explorerId) return;
  await setExplorerContext(explorerId);

  await Promise.all([
    supabase.from("owned_items").delete().eq("explorer_id", explorerId),
    supabase.from("ledger_entries").delete().eq("explorer_id", explorerId),
  ]);
  await supabase.from("wallet").update({ balance: 0 }).eq("explorer_id", explorerId);

  emitChange();
}
