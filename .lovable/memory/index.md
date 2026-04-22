# Memory: index.md
Updated: today

# Project Memory — SHERPA GO

## Core
SHERPA GO: Guided learning journey for kids 4–10. Sherpa = guide companion (NOT teacher). Mountain metaphor everywhere.
Hierarchy: Mountain (Superpower) > Checkpoint (Module) > Climb (Challenge). Summit = boss.
Nav (4 tabs): Basecamp / Montañas / Ruta / Explorador. NEVER use school metaphors (chalkboard, desk, classroom).
Design: sky+snow+sunrise palette (primary teal-blue, secondary sunrise-orange, accent yellow). Fonts: Fraunces (display) + Nunito (body). Light theme, soft shadows, rounded-3xl, layered depth.
Sherpa character lives in src/components/Sherpa.tsx with 5 moods (idle/pointing/celebrating/thinking/encouraging) — use SherpaSpeech for guided messages. Short, motivating phrases only.
Progress = altitude. Levels = elevation. Achievements = flags. Dynamic CTAs only ("Continúa el ascenso", "Empezar ascenso", never "Next").
Existing legacy types (Superpower/PowerModule/Challenge) preserved so ChallengePage/ModulePage/etc keep working.
Currency = **Alticoins** (never "coins" in user copy). Wallet at `src/lib/wallet.ts`, hook `useWallet`, route `/tienda`. Shop is purely cosmetic — no pay-to-win. Avatar overlays via `AvatarWithGear`.
Explorer is a **layered SVG** (`src/components/ExplorerSvg.tsx`) driven by `useExplorerStyle()` — not emoji. Customize at `/personalizar`. Shop gear renders as SVG inside ExplorerSvg, not emoji overlays.

## Memories
- [Alticoin economy](mem://features/alticoin-economy) — Earn rates, shop, cosmetic slots, persistence keys for the reward system
- [Explorer visual identity](mem://features/explorer-style) — Layered SVG explorer, style persistence, customization page, gear renderers
- [Visual Direction](mem://style/visual-direction) — Age-adaptive, minimalist and futuristic UI rules (legacy, partial)
- [Navigation Structure](mem://ux/navigation-structure) — 5-tab bar and Home screen layout requirements (legacy)
- [Gamification & Tone](mem://ux/gamification-and-tone) — Mechanics and UX writing constraints (no generic CTAs)
- [Challenge Implementation MVP](mem://tech/challenge-implementation) — MVP shortcut mapping interactive challenges to quiz logic
