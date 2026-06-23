# Double Diamond — 3-Reel Slot Machine

A production-ready, single-payline (center row) slot machine game built with
React, Tailwind CSS, and Framer Motion. The math model is driven entirely by
the supplied `double_diamond_216_combinations_with_percent.xlsx` payout file.

## Quick start

```bash
npm install
npm run dev      # local dev server, http://localhost:5173
npm run build    # production build into dist/
```

## How the payout logic works

- `src/data/paytableData.js` is an **exact, generated copy** of all 216 rows
  from `double_diamond_216_combinations_with_percent.xlsx` (every possible
  combination of the 6 symbols across 3 reels: 6³ = 216). It was produced by
  parsing the original file once and is the game's baked-in source of truth.
- `src/lib/paytable.js` turns those rows into a `Map` keyed by
  `"Reel1|Reel2|Reel3"` for O(1) lookup, and exposes:
  - `getPayout(lookup, [r1, r2, r3], betAmount)` — resolves a spin's outcome
    and scales the sheet's $1-bet payout by the player's actual bet.
  - `parsePaytableFile(file)` — parses a **freshly uploaded** `.xlsx` in the
    same column format (`Reel 1/2/3`, `Outcome Type`, `Payout ($)`) at
    runtime, using the `xlsx` library, and returns the same lookup
    structure. Wire this to the "LOAD .XLSX" button in the control panel to
    swap the active paytable without a rebuild.
  - `getPaytableEntries(lookup)` — derives the de-duplicated list shown in
    the Paytable modal.

## Game flow

- `src/hooks/useSlotGame.js` is the single state machine: balance, bet,
  spin sequencing, near-miss tension delay, and payout resolution.
- `src/lib/reels.js` defines the physical reel strips (symbol weighting,
  i.e. Diamond/7 are rarer than Cherry/BAR) and the spin RNG. The strips
  control *frequency*, the paytable controls *payout* — every one of the
  216 combinations remains reachable and is resolved by the exact lookup,
  never by the strip.
- Reels stop in sequence (`REEL_STOP_GAP` in `useSlotGame.js`), and if
  reels 1 & 2 land on the same high-value symbol (Diamond or 7), reel 3
  gets an extra `NEAR_MISS_EXTRA_DELAY` (1.5s) before stopping, for tension.

## Customizing

- **Starting balance / bet steps**: `STARTING_BALANCE` and `BET_OPTIONS` in
  `useSlotGame.js`.
- **Reel weighting**: edit the symbol arrays in `DEFAULT_REEL_STRIPS`
  (`src/lib/reels.js`) — more copies of a symbol = more frequent stops.
- **Visual theme**: colors, shadows, and fonts are defined in
  `tailwind.config.js` under the `casino` color palette and custom
  `boxShadow` keys.
- **Win celebration thresholds**: `getWinTier()` in `src/lib/paytable.js`
  (small / medium / big / jackpot tiers drive count-up speed and whether
  the coin-particle celebration fires).

## Tech stack

- React 18 + Vite
- Tailwind CSS (custom casino theme tokens)
- Framer Motion (reel spin/blur/bounce, win celebration, button micro-interactions)
- `xlsx` (SheetJS) for runtime paytable parsing
