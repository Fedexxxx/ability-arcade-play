---
name: Explorer visual identity
description: Layered SVG explorer style (skin/hair/jacket/pants/boots) and customization page
type: feature
---
Visual identity for the explorer is a **layered SVG**, not an emoji. Lives in `src/components/ExplorerSvg.tsx` with `variant: "bust" | "full"`.

Style fields (persisted as `sherpa.explorerStyle.v1`, event `sherpa:explorer-style-changed`, hook `useExplorerStyle`):
`skin` (5 tones); `hair` (7 styles: short/medium/long/curly/wavy/bun/buzz) + `hairColor`; `jacketColor`, `pantsColor`, `bootsColor`, `outfit`.
Face: `eyeShape` (round/almond/soft), `eyeColor`, `eyebrow` (soft/thick/arched), `freckles` (bool).
Free accessories (independent from shop, recolorable): `accHat` (none/beanie/cap/explorer-hat) + `accHatColor`, `accScarf` (none/scarf) + `accScarfColor`, `accBackpack` (none/day/trek) + `accBackpackColor`, `accGoggles` (bool).
Defaults in `DEFAULT_STYLE`. Onboarding seeds via `styleFromLegacyAvatar(avatar)`.

`AvatarWithGear` is the round-avatar wrapper used everywhere (Campamento header, Profile, Shop preview). It now ignores the legacy `avatar`/`emojiClassName` props (kept for back-compat) and renders `ExplorerSvg` driven by `useExplorerStyle()` + `wallet.equipped`.

Customization page: `/personalizar` (CustomizePage). Tabs: Cara / Pelo / Ropa / Accesorios with framer-motion AnimatePresence transitions. Live preview uses `variant="full"`. Changes save instantly via `saveExplorerStyle(patch)`.

Shop gear is rendered as **SVG inside ExplorerSvg** (HAT/SCARF/BACKPACK/BOOTS/BADGE renderer maps keyed by item id) — not emoji overlays. New shop items must add a renderer entry to keep the avatar consistent; missing renderers degrade gracefully (item still owned/equipped, just no visual). **Shop gear wins over customize-tab accessories** when both are set (hat/scarf/backpack slots).

ExplorerSvg has built-in **idle animation**: random blinks every ~3.5–6s (with occasional double-blinks), subtle gaze drift every ~2–5s, slow body breathing/sway loop and an independent head micro-tilt loop. **React-on-change pulse** (subtle scale bounce keyed off the full style hash) on style updates. Pass `animate={false}` to disable for static contexts.

Visual treatment is **Tintin-clarity + soft Pixar warmth** (NOT puppet/Pinocchio): SVG `defs` build per-instance linear/radial gradients (uid-suffixed ids) for skin, face volumetric shading, jacket (top-left highlight → bottom-right shade), pants, hair gloss, and cheek blush. Pose is **asymmetric and dynamic** — slight forward lean, weight on the right leg, left foot stepped forward, front arm bent. Eyes have iris ring + dark pupil + dual highlight reflections + gaze offset (`gaze` -1..+1 horizontal pupil drift); blink renders as soft curved eyelids (not flat lines). Color helpers `shade(hex, amount)` derive consistent dark/light variants used across hair, jacket, pants, boots, accessories. ViewBox widened slightly (`12 2 76 98` for bust, `0 0 100 184` full) to accommodate the leaning silhouette.

Reset: `clearExplorerStyle()` is called alongside `clearExplorer()` and `clearWallet()` on "Reiniciar explorador".

**A/B prototype — AI pre-rendered avatar (Opción D):** A toggle at the top of `/personalizar` switches between:
- `svg` (default) — the layered ExplorerSvg system above.
- `ai` — pre-rendered Pixar-style PNGs from Nano Banana, served from `public/avatar/ai/v1/` (96 files: 4 outfits × 4 skins × 3 hairs × 2 frames). Naming: `<bust|full>__outfit-<id>__skin-<id>__hair-<id>.png`. Catalog and resolver live in `src/lib/aiAvatarCatalog.ts`. Variant persisted as `sherpa.aiAvatarVariant.v1` (event `sherpa:ai-avatar-variant-changed`, hook `useAiAvatarVariant`). Mode persisted as `sherpa.avatarMode` (event `sherpa:avatar-mode-changed`, hook `useAvatarMode`).
- `AvatarWithGear` honors the mode and renders `<img>` in AI mode; falls back to ExplorerSvg if image fails. Only `/personalizar` and `/perfil` header reflect the mode (Basecamp/Shop stay on SVG — prototype scope).
- AI mode hides "Mi equipo" and the customize tabs; shows simplified Outfit/Piel/Pelo selectors. No accessories or Shop gear in AI mode.
- Generation script: `scripts/generate-ai-avatars.py` (one-shot, parallel, resumable). Reset of explorer also clears `aiAvatarVariant` (mode preference is preserved).
