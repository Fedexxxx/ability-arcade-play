---
name: Alticoin economy
description: Coin earn rates, shop, cosmetic slots, persistence keys for the reward system
type: feature
---
Currency: **Alticoins** (single name, never "coins" in user copy).

Earn rates (idempotent per source via wallet ledger):
- Correct challenge: +10 (sourceId `${spId}:${modId}:${chId}`)
- Wrong-but-tried challenge: +2 consolation (sourceId `${...}:try`)
- Module victory: +60 (sourceId `${spId}:${modId}`)
- Superpower/Mountain victory: +300 (sourceId spId)

Persistence: `localStorage` key `sherpa.wallet.v1`. Event: `sherpa:wallet-changed`. Hook: `useWallet()`. Helpers in `src/lib/wallet.ts`: `earn`, `buy`, `equip`, `clearWallet`.

Shop: `/tienda` route (ShopPage). Catalog in `src/lib/shopCatalog.ts`. Cosmetic slots: hat, scarf, backpack, boots, badge — one equipped per slot. Rarities: common / rare / epic — visual treatment only, never gameplay impact (no pay-to-win).

Avatar: `AvatarWithGear` overlays equipped hat (top), badge (top-right pin), scarf (bottom-left), backpack (bottom-right) on the explorer emoji. Used in Basecamp header, Profile, and Shop preview. Boots aren't visible on the round avatar yet — intentional MVP gap.

Reset: `clearWallet()` is called alongside `clearExplorer()` so "Reiniciar explorador" wipes coins/owned/equipped too.
