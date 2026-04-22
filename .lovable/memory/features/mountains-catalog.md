---
name: Mountains catalog & adaptive tiers
description: Slice-3 6×5 mountain catalog with per-module adaptive difficulty (Inicial/Avanzado/Experto)
type: feature
---
Catalog lives in `src/data/mountains.ts` — 6 mountains × 5 checkpoints. Each module has `byTier: Record<Tier, Challenge[]> | null`. `null` = skeleton stub ("Próximamente"). Use `findMountain`, `findTieredModule`, `findChallenge`, `getActiveChallenges(mod, tier)`, `isSkeleton(mod)`.

Two **deep** mountains (all tiers, all modules playable): `letras-peak`, `numeros-ridge`. The other four ship one fully-tiered playable module each, rest skeleton: `naturaleza-trail` (nt-c1), `creativa-mirador` (cm-c1), `logica-paso` (lg-c1), `social-refugio` (sr-c1).

`mockData.ts` `superpowers` is now **derived** from `mountains` (each module exposes its `inicial` tier as default `challenges[]`) — legacy pages keep working unchanged.

Adaptive tiers in `src/lib/tiers.ts` (hook `useTier`, event `sherpa:tier-changed`, key `sherpa.tiers.v1`):
- Default tier from age band: 4-6→inicial, 7-8→avanzado, 9-10→experto.
- `recordChallengeResult()` called from `ChallengePage` on every feedback. Rolling window of 6 results; promote at ≥85%, demote at ≤45%, min 4 samples. Resets window on tier change.
- Manual override via `setModuleTier()` (pins, pauses adapt). `unpinModuleTier()` resumes adaptation. UI in `ModulePage` (3-button selector + Auto/Pin badge).
- Reset flow (`ProfilePage.handleReset`) clears tiers alongside wallet/explorer/style.

`SuperpowerPage` shows a "Próximamente" pill on skeleton modules. `ModulePage` renders skeleton state inline instead of the challenge list.
