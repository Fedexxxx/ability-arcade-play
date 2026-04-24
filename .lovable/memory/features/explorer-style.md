---
name: Mountain Avatar system
description: Layered SVG avatar — palette, options, presets, customize page, shop bridge
type: feature
---
The avatar is a single layered **pure SVG** component: `src/components/avatar/MountainAvatar.tsx` (`variant: "bust" | "full"`, idle blink + gaze + breathe). One config object describes everything; no pre-rendered assets, no AI images.

Data model lives under `src/lib/mountainAvatar/`:
- `palette.ts` — closed curated palette: `SKIN_PALETTE` (5), `HAIR_COLORS` (5), `OUTFIT_COLORS` (8), `ACCESSORY_COLORS` (7). `shade(hex, amount)` and `luminance()` helpers. NEVER add colors outside these tokens.
- `options.ts` — option arrays: `SKIN_TONES`, `HAIR_STYLES` (6), `HAIR_COLOR_OPTIONS`, `TOP_OPTIONS` (6), `BOTTOM_OPTIONS` (4), `BOOTS_OPTIONS` (4), `HAT_OPTIONS` (4+none), `NECK_OPTIONS` (3+none), `BACKPACK_OPTIONS` (5+none), `BADGE_OPTIONS` (6+none), `EXPRESSION_OPTIONS` (4). Each gear option has `free: boolean` + optional `lockReason: "shop" | "adventure"`.
- `state.ts` — `MountainAvatar` config type, `getMountainAvatar()`, `saveMountainAvatar(patch)`, `setMountainAvatar(full)`, `clearMountainAvatar()`. Persisted as `sherpa.mountainAvatar.v1`, event `sherpa:mountain-avatar-changed`, hook `useMountainAvatar()`.
- `presets.ts` — 10 named curated `PRESETS` (Alpine Scout, Pine Trail Explorer, Glacier Buddy, Summit Pathfinder, Cloud Peak Climber, Stone Ridge Ranger, Snow Map Keeper, Little Mountaineer, Compass Trail Friend, Basecamp Adventurer). Each has `freeOnly` flag.
- `unlocks.ts` — `unlockedOptionIds(wallet)` returns Set of equippable option ids = free options + shop-owned items mapped via `SHOP_TO_OPTION` (e.g. `hat-cap-base → mountain-cap`, `scarf-wool → scarf`, `bp-day → compact-trail`). Existing wallet purchases auto-migrate visually.
- `randomize.ts` — `randomizeAvatar(unlocked)` enforces compatibility (skin/hair contrast ≥0.18 luminance, top differs from skin, max 2 strong accents from `ACCENT_OUTFIT`/`ACCENT_ACCESSORY`). `avatarHints(a)` returns soft warning strings. Per project decision **manual editing has NO restrictions**; only randomize is curated.
- `equipFromShop.ts` — `equipShopItemOnAvatar(itemId, slot)` / `unequipShopItemOnAvatar(slot)` — called from ShopPage on buy/equip/unequip so wallet and avatar stay in sync.

**Identity is always free** (skin/hair style/hair color/expression). All gear (top/bottom/boots/hat/neck/backpack/badge) is locked except a starter set: `alpine-jacket`, `trail-pants`, `classic-hiking`, all `none` options. Locked items show a Lock chip and either "Desbloquéalo con Alticoins" (shop) or "Desbloquéalo en aventuras" (progress); clicking a locked card routes to `/tienda`.

Customize page (`/personalizar`) has 6 tabs: Piel / Pelo / Ropa / Accesorios / Mochila / Estilos. Live preview uses `variant="full"`. Bottom actions: "Sorpréndeme" (compatibility-aware random), "Restablecer" (revert to initial), "Guardar explorador".

`AvatarWithGear` (round wrapper used in Basecamp header / Profile / Shop) renders MountainAvatar `variant="bust"` driven by `useMountainAvatar()`. Legacy props (`avatar`, `emojiClassName`, `showGear`) are accepted but ignored for back-compat — gear is now baked into the avatar config, not overlaid.

ProfilePage "Reiniciar explorador" calls `clearMountainAvatar()` (alongside `clearExplorer/clearWallet/clearTiers`). Onboarding no longer seeds avatar style — `DEFAULT_MOUNTAIN_AVATAR` is used.

**Removed in this rewrite (do NOT reintroduce)**: `ExplorerSvg.tsx`, `AiAvatarCanvas.tsx`, `aiAvatarCatalog.ts`, `explorerStyle.ts`, `uiPrefs.ts`, `gearPositions.ts`, `useAiAvatarVariant.ts`, `useExplorerStyle.ts`, `useUiPrefs.ts`. AI mode toggle and free-color pickers are gone. The pre-rendered AI PNGs in `public/avatar/ai/v2/` are orphaned (script + manifest still exist if ever needed for reference).

**Visual style rules**: Pixar-soft via SVG gradients (per-instance uid-suffixed `<defs>`), rounded shapes, gentle highlights, soft drop shadow under feet. Asymmetric/dynamic head with cheeks blush + eye highlights. Idle blink ~3.5–6s, occasional double blink, slow gaze drift, scale-pulse on style hash change.
