---
name: Explorer visual identity
description: Layered SVG explorer style (skin/hair/jacket/pants/boots) and customization page
type: feature
---
Visual identity for the explorer is a **layered SVG**, not an emoji. Lives in `src/components/ExplorerSvg.tsx` with `variant: "bust" | "full"`.

Style fields (persisted as `sherpa.explorerStyle.v1`, event `sherpa:explorer-style-changed`, hook `useExplorerStyle`):
`skin` (5 tones), `hair` (5 styles) + `hairColor`, `jacketColor`, `pantsColor`, `bootsColor`, `outfit`. Defaults in `DEFAULT_STYLE`. Onboarding seeds via `styleFromLegacyAvatar(avatar)`.

`AvatarWithGear` is the round-avatar wrapper used everywhere (Campamento header, Profile, Shop preview). It now ignores the legacy `avatar`/`emojiClassName` props (kept for back-compat) and renders `ExplorerSvg` driven by `useExplorerStyle()` + `wallet.equipped`.

Customization page: `/personalizar` (CustomizePage). Tabs: Piel / Pelo / Ropa. Live preview uses `variant="full"`. Changes save instantly via `saveExplorerStyle(patch)`.

Shop gear is rendered as **SVG inside ExplorerSvg** (HAT/SCARF/BACKPACK/BOOTS/BADGE renderer maps keyed by item id) — not emoji overlays. New shop items must add a renderer entry to keep the avatar consistent; missing renderers degrade gracefully (item still owned/equipped, just no visual).

Reset: `clearExplorerStyle()` is called alongside `clearExplorer()` and `clearWallet()` on "Reiniciar explorador".
