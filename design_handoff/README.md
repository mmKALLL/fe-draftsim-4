# Handoff: Emblem Draft — FE11 Draft Simulator

## Overview
**Emblem Draft** is a mobile-first (PC-supported) party game that simulates drafting a
*Fire Emblem: Shadow Dragon* (FE11) run. 2–6 players (any mix of humans + CPU) draft
characters from a shared pool. Each character has a **power rating in five game phases**
(Early → Lategame). At game end, players score points based on their **team-power placement
in each phase**, adjusted by **coverage bonuses/penalties**. Highest total wins.

This bundle documents five screens: **Main Menu, Game Setup, Draft Phase, Standings**
(three toggle views), and **Game End**.

---

## About the Design Files
The files in this bundle are **design references created in HTML/React (via in-browser Babel)** —
prototypes that show the intended look and behavior. **They are not production code to copy
directly.** The styling is done with inline styles and a small set of CSS variables purely to
make the mockups render.

Your task is to **recreate these designs in your target codebase** using its established
framework, component library, and patterns (React Native, SwiftUI, Flutter, a web stack, etc.).
If no codebase exists yet, choose the most appropriate framework for a mobile-first game UI and
implement there. Treat the HTML as the **visual + behavioral spec**, not the implementation.

**`types.ts` is the exception** — it is intended as real, reusable source. It defines the domain
model (phases, characters, scoring, coverage rules) and a typed-but-unimplemented `CardEffect`
catalogue. Port it to your language of choice; the resolver functions are stubbed `TODO`s.

---

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interaction intent are all expressed.
Recreate the UI faithfully using your codebase's libraries. Exact tokens are listed below.
Demo numbers (player names, power values, scores) are **placeholder sample data** — wire them to
real game state.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--paper`        | `#f4eee1` | App background (warm parchment) |
| `--paper-2`      | `#ece3d1` | Card / panel background |
| `--paper-3`      | `#e2d7bd` | Insets, table headers, toggle track |
| `--ink`          | `#2b251d` | Primary text |
| `--ink-soft`     | `#5a5142` | Secondary text |
| `--ink-faint`    | `#91856c` | Tertiary text, labels, muted digits |
| `--line`         | `#ddd0b6` | Hairline dividers |
| `--line-strong`  | `#c9bb9c` | Card borders, stronger dividers |
| `--bronze`       | `#9a7848` | Accent — highlights, phase leaders, max stat |
| `--bronze-deep`  | `#7a5d34` | Accent text on light bg |
| `--crimson`      | `#9d3b2c` | Primary action, "You", winner |
| `--sage`         | `#5f7a55` | Positive / bonus / human marker |
| `--gold`         | `#c79a3e` | Reserved highlight |

Semantic usage:
- **Crimson** = the human player ("You"), primary CTA, 1st-place winner name.
- **Bronze** = phase leader, the single max stat (value 4) in a card's mini-bars, podium #1.
- **Sage** = positive bonus, "Human" player badge dot.
- **Crimson (on chips)** = penalties / missed coverage groups.

### Typography
Three families (Google Fonts):
- **Display** — `Spectral` (serif). Weights 400/500/600/700. Headings, player names, numbers-as-titles, logo.
- **UI** — `Archivo` (sans). Weights 400/500/600/700. Body, buttons, labels, descriptions.
- **Mono** — `Space Mono` (monospace). Weights 400/700. Stat digits, phase short-labels, uppercase eyebrow labels, point totals.

Common sizes (px): eyebrow labels 9–11 mono uppercase (letter-spacing 1–1.5); body 11.5–13.5;
section titles 18–24 display; hero numerals 26–46 display. **Never below ~8px** (only used for
dense table micro-labels; prefer ≥10 where possible).

### Spacing / Radius / Shadow
- Screen horizontal padding: **16–22px**.
- Card padding: **10–14px**; card radius: **8–10px**; inner chips radius **4–7px**.
- Gaps via flex/grid `gap`: **5–12px** typical.
- Buttons radius **7–8px**, padding **13–15px** vertical for primary CTAs.
- Primary-CTA shadow: `0 6px 18px rgba(157,59,44,.3)` (crimson glow).
- Card shadow (subtle): `0 1px 2px rgba(43,37,29,.06)`.

### Device targets
Artboards are **390×844 = iPhone 13 logical resolution** (19.5:9). **Pixel 8 = 412×915** (20:9):
same layouts gain ~22px width / ~70px height. Design to the 390-wide constraint; let content
flex wider. All layouts use flex/grid — no fixed-height scroll regions.

---

## Domain Model & Rules (see `types.ts`)

### Phases (always in this order)
`early` (Earlygame) → `earlymid` (Early Midgame) → `mid` (Midgame) →
`midlate` (**Mid-Lategame**, label "M-LATE") → `late` (Lategame).
Each character has a 5-tuple `p: [n,n,n,n,n]`, each **0–4**.

### Scoring — Versus (default)
Per phase, players are ranked by **team power** (sum of that phase's stat across their drafted
team). Points by rank: **`[5, 3, 2, 1, 0, 0]`** (`SCORE_SPREAD`). A player's score = sum of
per-phase points **+ bonus** (below). Alternative variant **Solo**: beat fixed power thresholds
per phase (not detailed in mocks).

### Bonuses & Penalties (the "Coverage" system)
A team takes **−1 (all phases)** for **each missing coverage group**, and gains **+1 (all phases)**
for **each completed weapon-triangle trio**. Net is summed into the **Bonus** column.

Coverage groups (need ≥1 of each):
| Group | Satisfied by |
|---|---|
| **Mage** | Tome user (pierces defense) |
| **Cleric** | Staff user (healing) |
| **Ranged** | Bow / ballista |
| **Defense** | Knight / cavalier (`armor` or `mounted` tag) |
| **Mobility** | Cavalier / pegasus (`mounted` or `flier` tag) |

Weapon-triangle trio: each group of three characters covering **Sword + Axe + Lance** = +1.
Count = `min(swordCount, axeCount, lanceCount)`.

(Sample "You" team: missing **Ranged** → −1, one trio → +1, **net 0**.)

---

## Screens / Views

### 1. Main Menu
- **Purpose**: Entry point / tone-setter.
- **Layout**: Centered column. Faint horizontal "ledger rule" lines tile the background
  (`repeating-linear-gradient`, opacity 0.4). Logo block at top (~64px top padding), menu list,
  footer pinned to bottom.
- **Logo**: Sword + "THE" + Lance glyph row (bronze), then "Emblem" / "**Draft**" (Draft in crimson),
  Spectral 46px/700, then "AN FE11 DRAFT SIMULATOR" mono eyebrow.
- **Menu items** (vertical list, gap 12): each a left-aligned button with title (Spectral 20/600) +
  mono uppercase subtitle + chevron. **New Game** is primary (crimson fill, white text, crimson
  glow shadow); the rest are `--paper-2` with `--line-strong` border. Items: New Game (2–6 players · local),
  Continue (Round 7 · 4 players), How to Play (Rules & scoring), Roster (60 characters).
- **Footer**: "v0.4 · local play" + Settings / About text links.

### 2. Game Setup
- **Purpose**: Configure players & rules before drafting.
- **Header**: back-chevron button + "New Game" (Spectral 22/700) + "CONFIGURE THE DRAFT" eyebrow.
- **Players section** (hint "2–6"): a vertical list of player rows. Each row =
  **[Human|CPU badge] [editable name input, prefilled "Player N"] [✕ remove button]**.
  Badge: pill with a status dot (sage = human, faint = CPU) + mono uppercase label. Below the list,
  two dashed buttons: **+ Add Human** (sage dashed) and **+ Add CPU** (neutral dashed).
- **Scoring Variant** (hint "how points are won"): two `OptionCard`s side by side — **Versus**
  (selected by default; "Score points by your placement in each phase.") and **Solo** ("Beat fixed
  power thresholds each phase for points."). Selected card = crimson border + radio dot + tinted bg.
  No "recommended" badge.
- **Modifiers**: toggle rows — "Hidden picks" (off; "Reveal totals only at pick 5 & end") and
  "Bonus & penalty rules" (on; "Coverage groups & weapon triangle"). Toggle = 40×23 pill, sage when on.
- **Sticky footer CTA**: full-width crimson "Begin Draft ›" with glow shadow.

### 3. Draft Phase
- **Purpose**: Core loop — see standings, take one card from the current pack.
- **Standings card** (top, `--paper-2` panel): header row = "YOU'RE **2nd** of 6" (placement in
  crimson Spectral) on the left, **Details** pill button (chevron) on the right. Below: a **multi-line
  phase chart** (one line per player across the 5 phases; "You" = thick crimson line with a **power
  number printed above each point**; others = palette colors, thinner). Legend grid (3 cols) under a
  divider: color swatch + name + **(points)** after each name.
- **Pick header**: "Pick **7** of 10" (Spectral, "of 10" muted) on the left; "8 IN PACK · TAKE ONE"
  mono eyebrow on the right.
- **Pack grid** (2 columns, gap 10): `PackCard`s. Each card:
  - Header: portrait placeholder (36px, hatched) + name (Spectral 15/700) + weapon glyph (bronze) +
    class (mono uppercase).
  - **Mini phase-bars**: 5 vertical bars, **standardized heights** for values 0–4
    (`BAR_H = [3,13,22,31,40]` px) so equal values look equal. Digit above each bar.
    **Only value 4 is highlighted bronze**; values 1/2/3 all share `--line-strong`; 0 = `--line`.
    Phase short-labels under the bars.
  - **Take** button: full-width, crimson **outline** (transparent fill) — cards are all equally
    active (no recommended/featured state, no disabled look).
  - Bottom fade gradient hints scrollability.

### 4. Standings (three toggle views)
- **Purpose**: Review results / progress. Reached via "Details" from Draft.
- **Header**: "ROUND 10 / 10 · FINAL PICKS IN" eyebrow + "Standings" (Spectral 24/700), with a
  **Back** pill button (back-chevron) top-right. Below: a **segmented 3-way toggle**:
  **Scores · Team Power · Rosters** (active segment = `--paper` raised with subtle shadow).

- **4a. Scores view**:
  - Multi-line phase chart (all players) + 3-col legend with **(points)** after names.
  - **Coverage panel** (`--paper-2`): header "YOUR COVERAGE" + net "(±N) / phase". A row of 5 group
    tiles (Mage/Cleric/Ranged/Defense/Mobility): met = sage tint + **✓**, missed = crimson tint + **✕**
    (plain cross, not "−1"). Footer line: "Weapon-triangle trios ×N (S·A·L)" + "+N all phases".
  - **Leaderboard table**: columns = rank, name, the 5 phase-point cells (`PtChip`: 5 = crimson,
    2–3 = bronze, 0–1 = faint), a **Bonus column** ("Bon": +N sage / −N crimson / — faint), and **Pts**
    (Spectral 18/700). "You" row = crimson tint + border; rank 1 numeral = bronze.

- **4b. Team Power view**: a table of every player's **raw power per phase** + Σ total. The **phase
  leader** in each column is bronze with a small underline tick. Caption: "phase leader · scores 5 pts".

- **4c. Rosters view**: a horizontal **player tab strip** (selected = crimson pill) + the selected
  player's drafted characters as a list (portrait + name + weapon glyph + class, with the 5 phase
  digits on the right via `PhaseStats` numbers variant). *(Mock always shows one sample team; wire
  per-player rosters in code.)*

### 5. Game End
- **Purpose**: Final results.
- Light parchment. "THE DRAFT IS SEALED" eyebrow → "**{Winner}** wins" (winner name crimson,
  Spectral 34) → "{N} points across five phases".
- **Podium**: three columns in 2-1-3 visual order; #1 column is bronze and tallest, others
  `--paper-3`. Each shows portrait, name, "{pts} pts", and a numbered block.
- **Full results list**: ranked rows (rank, name, a tiny **per-phase point spark** of bronze bars,
  total). "You" row tinted crimson; winner name bronze.
- **Actions**: "View teams" (outline) + "Rematch" (crimson, glow).

---

## Interactions & Behavior
- **Setup → Begin Draft** navigates to Draft Phase.
- **Add Human / Add CPU** append a player row (cap at 6 total, min 2); **✕** removes a row; name
  inputs are editable text fields.
- **Versus / Solo** are single-select option cards.
- **Toggles** (Hidden picks, Bonus & penalty rules) flip boolean config.
- **Draft "Take"** drafts that character, removes it from the pack, advances the pick; pack passes
  one player in a fixed direction.
- **Draft "Details" ↔ Standings "Back"** navigate between the draft loop and the full standings.
- **Standings toggle** switches between Scores / Team Power / Rosters in place.
- **Standings Rosters tabs** select which player's team is shown.
- **Game End** "Rematch" restarts with the same config; "View teams" opens roster review.

Suggested transitions: 150–250ms ease for view/toggle changes; the chart can animate line-draw on
mount. Respect reduced-motion.

## State Management
Core state mirrors `GameState` in `types.ts`:
- `config` (players[], format, scoring, picksPerPlayer=10, hiddenPicks, modifiersEnabled).
- `pool` (remaining characters), `packs` (pack-format cards in flight), `turnOrder`, `currentTurn`,
  `round` (1…10).
- Derived per recompute: each player's effective **power per phase**, **phasePts**, **bonus**
  (from coverage), **total**, and ranking. Keep a pure `computeStandings()` + `computeTeamModifiers()`
  so the chart, leaderboard, and game-end stay in sync (the mock does exactly this in `data.js`).

## Assets
- **No external image assets.** Portraits are intentional **placeholders** (initials on a hatched
  `repeating-linear-gradient`). Swap in your own character art, or use Nintendo/Fire Emblem
  face portraits as placeholders.
- **Weapon icons** are inline SVGs (Sword, Lance, Axe, Bow, Tome, Staff, Stone) defined in
  `ui.jsx → WeaponGlyph`. Reuse or redraw as a small icon set; viewBox `0 0 24 24`, ~1.6 stroke.
- **Fonts**: Spectral, Archivo, Space Mono (Google Fonts).

## Files in this bundle
| File | What it is |
|---|---|
| `types.ts` | **Port this.** Domain model, scoring, coverage rules, card-effect catalogue (stubbed). |
| `index.html` | Entry; fonts, CSS variables (design tokens), script load order. |
| `data.js` | Sample pool, players, demo standings, `computeStandings`, `computeTeamModifiers`. |
| `ui.jsx` | Shared primitives: `WeaponGlyph`, `PhaseStats`, `PhaseLineChart`, `ChartLegend`, `Portrait`, `PhoneFrame`, `Tag`. |
| `screen-menu.jsx` | Main Menu + Game Setup. |
| `screen-draft.jsx` | Draft Phase (standings chart + pack cards). |
| `screen-score.jsx` | Standings (Scores/Team Power/Rosters) + Game End. |
| `app.jsx` | Canvas composition (review only — not part of the app). |
| `design-canvas.jsx` | Review-canvas scaffold (ignore for implementation). |

To view the prototype: open `index.html` in a browser. Screens are laid out on a pan/zoom review
canvas; click any frame to open it fullscreen.
