

## Scope

In `src/pages/ChallengePage.tsx`, keep the existing 2-second Undo flow but stop locking the entire challenge UI. Only the "Ir atrás" button itself is disabled during the countdown — everything else (X close button, challenge content, answers, Sherpa, etc.) stays fully interactive.

## Changes

**File: `src/pages/ChallengePage.tsx`**

1. **Remove the dimming wrapper** around the challenge content
   - Drop the `opacity-60 pointer-events-none` classes and the `aria-disabled={returningHome}` from the `<div>` that wraps `<AnimatePresence>`.
   - Restore that wrapper to its original styling (plain `flex-1 flex flex-col`, no conditional class).

2. **Re-enable the top-bar X (Cerrar) button**
   - Remove `disabled={returningHome}` and the `opacity-50` conditional from the X button so users can still close the challenge normally.

3. **Keep the "Ir atrás" button disabled** during the countdown
   - No change here — it already uses `disabled={returningHome}`, shows "Volviendo…", and has `disabled:opacity-50 disabled:cursor-not-allowed`.

4. **Leave the Undo logic intact**
   - The 2-second timer, sonner toast with "Deshacer" action, `setReturningHome(false)` on undo, and synced `toast.dismiss` all stay exactly as they are.

## Result

```text
Before:                         After:
┌──────────────────────┐        ┌──────────────────────┐
│ [X disabled]         │        │ [X active]           │
│ ░░░░░░░░░░░░░░░░░░░░ │        │                      │
│ ░ challenge dimmed ░ │   →    │  challenge active    │
│ ░ pointer-events    ░ │        │  fully interactive   │
│ ░ none              ░ │        │                      │
│ [Volviendo… disabled]│        │ [Volviendo… disabled]│
└──────────────────────┘        └──────────────────────┘
        Toast: Deshacer (2s)             Toast: Deshacer (2s)
```

Only the "Ir atrás" link locks during the 2-second window — preventing double-navigation — while the rest of the challenge remains usable. If the user clicks "Deshacer", the button re-enables immediately as before.

## Technical notes

- No new state, no new dependencies, no changes to timing or toast copy.
- This is a pure subtraction: removing the disabled state from the X button and removing the dim/lock wrapper classes from the content container.
- The `returningHome` state still exists and still gates only the "Ir atrás" button.

