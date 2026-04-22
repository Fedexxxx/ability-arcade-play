

## Polish pass: Explore · Shop · Customize · Basecamp

Four small, independent improvements across the four pages you flagged. Each can be shipped on its own — pick all, some, or reorder.

---

### 1) Mountains catalog / Explore page (`src/pages/ExplorePage.tsx`)

Current state: chips filter by category, cards list every superpower with status badge + progress. Solid, but flat — no sense of which mountain is *yours right now*, and locked items lack a "what unlocks me" hint.

**Polish:**
- **Pinned "Subiendo ahora" card on top** when there's an `in-progress` mountain — slightly larger, sunrise gradient border, "Continuar ascenso" CTA. Makes the page actionable on first glance.
- **Group by status** within the active filter: `Subiendo` → `Listas` → `Conquistadas` → `Bloqueadas`, with a tiny section label between groups (matches the Sherpa metaphor: "lo que tienes en marcha", "lo que te espera").
- **Lock hint** on locked cards: small line "Termina X para desbloquear" instead of just dimming.
- **Skeleton "Próximamente" badge** for mountains whose modules are all `byTier === null`, so the catalog doesn't promise content that isn't there.
- **Sherpa message becomes contextual**: switches based on whether the user has 0, 1, or several mountains in progress.

---

### 2) Alticoins / Shop flow (`src/pages/ShopPage.tsx` + small tweaks to `BasecampPage`)

Current state: balance chip, slot filters, 2-col grid, equip/buy buttons. Works, but a few rough edges:
- `min-h-[2rem]` description box leaves visible whitespace under short names.
- The "Equipado" state on a card and "Equipar" on owned items look almost identical (both use `bg-muted` vs `bg-primary`) — easy to miss.
- No visible "owned" marker in the grid; you only learn it by trying to buy.
- No empty state per slot filter (none right now, but worth guarding).

**Polish:**
- **Owned ribbon** — small corner badge (`✓ Tuyo`) on every owned card, independent of equipped state.
- **Equip toggle clarity** — when equipped, show "Quitar" with a minus icon; when owned-not-equipped, show "Equipar" with a plus. Makes the toggle direction obvious.
- **Affordability ring** — items the user *can* afford get a subtle gradient-sunrise ring; locked-by-price items stay neutral. Pairs well with the existing rarity ring.
- **"Casi lo tienes" nudge** — for the cheapest unaffordable item, show "Te faltan N" under the price button.
- **Top of page**: replace the static Sherpa line with a contextual one (first visit, after first purchase, when wallet is empty, etc.).
- **Basecamp integration**: the Alticoins chip in Basecamp header gets a subtle `+N` pop animation when wallet balance increases (uses existing `useWallet`).

---

### 3) Explorer customization (`src/pages/CustomizePage.tsx`)

Current state: live SVG preview, 3 tabs (piel/pelo/ropa), color swatches, "Guardar y volver" CTA. Functional, but:
- Every change auto-saves, yet the CTA says "Guardar y volver" — implies unsaved state that doesn't exist.
- No way to undo a misclick (e.g. picked the wrong skin tone).
- Tabs lose track of which one has changes.
- The preview doesn't show the equipped gear from the Shop in a visible way (gear is rendered but not labelled, so the connection isn't obvious).

**Polish:**
- **Rename CTA to "Listo"** (since changes are already saved) and give it a secondary "Restablecer" button that reverts to the style on entry. We snapshot `style` in a ref on mount and `saveExplorerStyle(snapshot)` on reset.
- **Active tab dot** — small dot on tab labels you've touched this session, so the user sees what they've changed.
- **"Mi equipo" mini-row under preview** showing the equipped Shop items as small chips, with a "Cambiar en la tienda →" link. Bridges Customize ↔ Shop.
- **Sherpa contextual messages** per tab: "Elige el tono que más te recuerde a ti" / "Tu pelo, tu estilo" / "Ropa para escalar".
- **Subtle preview animation** — explorer does a tiny bob/breathe loop so the preview feels alive (uses existing framer-motion).

---

### 4) Basecamp layout (`src/pages/BasecampPage.tsx`)

Current state: backdrop image, header with avatar/level/streak/coins, Sherpa, big CTA, daily mission, mountains preview, Sherpa quote. Dense but well-structured. Issues spotted:
- **Empty-state gap**: if there's no `activeSP`, the entire continue-CTA disappears with nothing in its place — page feels broken.
- **Daily mission card** disappears entirely when `dailyMission` is undefined; same problem.
- Header shows level/XP/streak/coins but **streak doesn't celebrate milestones** (3, 7, 30 days look identical).
- The Sherpa quote at the bottom is decorative but always identical — wasted real estate.

**Polish:**
- **"Empieza tu primera montaña" CTA** when `activeSP` is null, pointing to `/explore`. Mirror styling of the active CTA.
- **"Sin misión hoy" placeholder** when `dailyMission` is undefined: small card "Vuelve mañana por tu Climb del día" with a subtle calendar glyph. Keeps the rhythm of the page.
- **Streak milestone halo** — when `streak` hits 3/7/14/30, the streak chip gets a colored ring + tiny "🔥 3 días" label expansion. Pure visual, no logic change.
- **Rotate the Sherpa quote** — small array of 5–6 climbing quotes, pick one based on `userProfile.streak` (deterministic, no flicker on re-render).
- **"Ver todas →" affordance**: also make the entire "Tus montañas" header tappable, not just the link. Larger touch target.

---

## Suggested order

1. **Basecamp** empty states (real bug — page can look broken). 
2. **Shop** owned/equip clarity (easiest win, daily-use surface). 
3. **Explore** group-by-status + active pin. 
4. **Customize** snapshot/reset + equipped chips.

## Technical notes

- All changes are presentational — no schema, hook, or routing changes.
- Reuses existing primitives: `useWallet`, `useExplorer`, `useDensity`, `SherpaSpeech`, `AvatarWithGear`, `gradient-sunrise`, `shadow-summit`.
- Density (`useDensity`) must be respected on every new element (font size, padding, optional subtext) — same pattern already in these files.
- Basecamp streak halo & coin-pop use framer-motion `animate` props, no new deps.
- Customize "snapshot on mount" stored in a `useRef`; reset just calls `saveExplorerStyle(snapshot.current)`.
- No memory updates needed — none of this contradicts existing rules.

