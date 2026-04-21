import { useEffect, useState } from "react";
import { getWallet, WALLET_EVENT, type WalletState, type CosmeticSlot } from "@/lib/wallet";
import { getItem } from "@/lib/shopCatalog";

/** Mirrors the persisted wallet state and reacts to changes. */
export function useWallet(): WalletState {
  const [state, setState] = useState<WalletState>(() => getWallet());
  useEffect(() => {
    const sync = () => setState(getWallet());
    window.addEventListener(WALLET_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WALLET_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}

/** Returns the glyph (emoji) for the equipped item in a slot, if any. */
export function useEquippedGlyph(slot: CosmeticSlot): string | null {
  const wallet = useWallet();
  const id = wallet.equipped[slot];
  if (!id) return null;
  return getItem(id)?.glyph ?? null;
}
