import { useEffect, useState } from "react";
import { getWallet, WALLET_EVENT, type WalletState } from "@/lib/wallet";

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
