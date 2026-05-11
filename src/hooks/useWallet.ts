import { useEffect, useState } from "react";
import { getWallet, WALLET_EVENT, type WalletState } from "@/lib/wallet";

const EMPTY: WalletState = { balance: 0, ledger: [], owned: [], equipped: {} };

/** Mirrors the persisted wallet state and reacts to changes. */
export function useWallet(): WalletState {
  const [state, setState] = useState<WalletState>(EMPTY);
  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      getWallet().then((next) => {
        if (!cancelled) setState(next);
      });
    };
    sync();
    window.addEventListener(WALLET_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(WALLET_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}
