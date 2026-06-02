/* ============================================================================
 * Draft Ledger — core domain types  (handoff stub for Claude Code)
 *
 * This file is the single source of truth for the data shapes the mockups
 * were built against. Stat numbers in the screens come from a POOL array that
 * matches the `Character` shape below (see data.js in the design project).
 *
 * Card EFFECTS are TYPED here but intentionally NOT IMPLEMENTED yet — the
 * `kind` discriminant is wired so the resolver can be filled in later.
 * ========================================================================== */

// ---- Phases -----------------------------------------------------------------
// The simulated FE11 run is split into five phases. Power & scoring are always
// indexed in this order.
export type PhaseKey =
  | 'early'      // Earlygame
  | 'earlymid'   // Early Midgame
  | 'mid'        // Midgame
  | 'earlylate'  // Early Lategame
  | 'late';      // Lategame

export const PHASE_ORDER: PhaseKey[] = ['early', 'earlymid', 'mid', 'earlylate', 'late'];

/** Per-phase power, one value per phase in PHASE_ORDER. Each value is 0–4. */
export type PhaseStats = [number, number, number, number, number];

/** Points awarded by team-power RANK within a phase (index 0 = 1st place). */
export const SCORE_SPREAD = [5, 3, 2, 1, 0, 0] as const;

// ---- Characters -------------------------------------------------------------
export type WeaponType = 'Sword' | 'Lance' | 'Axe' | 'Bow' | 'Tome' | 'Staff' | 'Stone';

/** Weapon-triangle relation. null = neutral (Bow/Tome/Staff/Stone). */
export const WEAPON_BEATS: Record<WeaponType, WeaponType | null> = {
  Sword: 'Axe',
  Axe: 'Lance',
  Lance: 'Sword',
  Bow: null,
  Tome: null,
  Staff: null,
  Stone: null,
};

/** Role tags drive bonus/penalty rules (healer caps, defensive minimums, …). */
export type RoleTag =
  | 'lord' | 'mounted' | 'armor' | 'flier' | 'healer' | 'utility' | 'copy' | 'defensive';

export interface Character {
  id: string;
  name: string;
  cls: string;            // display class, e.g. "Paladin"
  wpn: WeaponType;
  /** Base per-phase power (0–4 each). Effects may modify the effective value. */
  p: PhaseStats;
  tags: RoleTag[];
  effect?: CardEffectKind; // optional special effect (see below)
}

// ---- Players & teams --------------------------------------------------------
export interface Player {
  id: string;
  name: string;
  kind: 'human' | 'cpu';
  /** Drafted character ids, in pick order. */
  picks: string[];
}

/** Computed standings for one player at a point in the game. */
export interface PlayerStanding extends Player {
  /** Effective team power per phase (after modifiers). */
  power: PhaseStats;
  /** Points won per phase. */
  phasePts: PhaseStats;
  total: number;
  activeModifiers: TeamModifiers;
}

// ---- Bonuses & penalties ----------------------------------------------------
// A team needs at least one character in each coverage group, or takes a
// −1 (all-phases) penalty per missing group. Each trio of characters covering
// Sword+Axe+Lance grants +1 (all phases).
export type CoverageGroupId =
  | 'mage'      // Tome user — pierces defense
  | 'cleric'    // Staff user — healing
  | 'ranged'    // Bow / ballista — ranged attack
  | 'defense'   // knight / cavalier
  | 'mobility'; // cavalier / pegasus

export interface CoverageGroup {
  id: CoverageGroupId;
  label: string;
  hint: string;
  /** Whether the team satisfies this group. */
  test: (c: Character) => boolean;
}

export interface TeamModifiers {
  coverage: (CoverageGroup & { met: boolean })[];
  missed: CoverageGroup[];   // each missing group → −1 all phases
  trios: number;             // completed Sword+Axe+Lance trios → +1 each
  bonus: number;             // = trios
  penalty: number;           // = missed.length
  net: number;               // bonus − penalty, applied flat to every phase
}

// ---- Game configuration -----------------------------------------------------
/** How picks are made. (Snake is reserved for later — pack is the shipping mode.) */
export type DraftFormat =
  | 'pack'    // open a randomized 10-card pack, take one, pass the rest
  | 'snake';  // reserved: pick any character from the full pool, snake order

/** How points are scored. */
export type ScoringVariant =
  | 'versus'  // most team-power per phase scores via SCORE_SPREAD
  | 'solo'    // beat fixed per-phase power thresholds for points
  | 'soyo';   // "Switch On Your Opponent" — each player drafts FOR a rival

export interface GameConfig {
  players: { name: string; kind: 'human' | 'cpu' }[]; // 2–6 total (humans + CPU)
  format: DraftFormat;
  scoring: ScoringVariant;
  picksPerPlayer: number;        // 10 in standard FE11 draft
  hiddenPicks: boolean;          // reveal totals only at pick 5 and at the end
  modifiersEnabled: boolean;     // toggle the bonus/penalty engine
  /** Solo-mode thresholds: points per phase keyed by power needed. */
  soloThresholds?: Record<PhaseKey, { power: number; pts: number }[]>;
}

export interface GameState {
  config: GameConfig;
  pool: Character[];             // remaining undrafted characters
  packs?: Character[][];         // pack-format only: current packs in flight
  turnOrder: string[];           // player ids, expanded for snake order
  currentTurn: number;           // index into turnOrder
  round: number;                 // 1 … picksPerPlayer
  standings: PlayerStanding[];
}

// ============================================================================
// CARD EFFECTS — typed, NOT yet implemented.
// Each effect resolves at a defined trigger; the resolver is a TODO.
// ============================================================================
export type CardEffectKind =
  | 'mirror'          // Xane: becomes a copy of another character you own
  | 'conscript'       // on draft, also adds a free generic "Zas" to your team
  | 'rivalry'         // +1 all phases while a named character is on a RIVAL team
  | 'mentor'          // raises your single weakest phase by +1
  | 'standardBearer'  // your weapon-triangle trio counts with only 2 of 3 weapons
  | 'lateBloom'       // gains +1 late for each Stone/Manakete unit you own
  | 'duelist'         // +1 in any phase where this unit's weapon beats the phase leader's
  | 'turncoat';       // the next player may steal this pick once, this draft

export type EffectTrigger =
  | 'onDraft'         // fires once when the card is picked
  | 'onScore'         // fires whenever standings are recomputed
  | 'continuous';     // always-on stat modification

export interface CardEffect {
  kind: CardEffectKind;
  trigger: EffectTrigger;
  /** Human-readable rules text shown on the card. */
  description: string;
  /**
   * Resolve the effect against the current game state, returning a stat
   * delta (and/or side effects) for the owning player.
   * TODO: implement per-kind in the effect resolver.
   */
  resolve?: (ctx: {
    self: Character;
    owner: PlayerStanding;
    state: GameState;
  }) => Partial<PhaseStats> | void;
}

/** Catalogue of effect copy — fill `resolve` when implementing. */
export const CARD_EFFECTS: Record<CardEffectKind, Omit<CardEffect, 'resolve'>> = {
  mirror:         { kind: 'mirror',         trigger: 'onDraft',    description: 'Pick a character you own; copy their phase stats.' },
  conscript:      { kind: 'conscript',      trigger: 'onDraft',    description: 'On draft, also recruit a free generic (Zas).' },
  rivalry:        { kind: 'rivalry',        trigger: 'onScore',    description: '+1 all phases while a chosen character sits on an opponent.' },
  mentor:         { kind: 'mentor',         trigger: 'continuous', description: 'Your single weakest phase gains +1.' },
  standardBearer: { kind: 'standardBearer', trigger: 'continuous', description: 'Weapon-triangle bonus triggers with only 2 of 3 weapons.' },
  lateBloom:      { kind: 'lateBloom',      trigger: 'onScore',    description: '+1 Lategame for each Manakete you own.' },
  duelist:        { kind: 'duelist',        trigger: 'onScore',    description: '+1 in any phase where this weapon beats the phase leader.' },
  turncoat:       { kind: 'turncoat',       trigger: 'onDraft',    description: 'The next player may steal this pick once this draft.' },
};
