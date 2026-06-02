export const GAME_PHASES = [
  "earlygame",
  "earlyMidgame",
  "midgame",
  "midLategame",
  "lategame",
] as const;

export type GamePhase = (typeof GAME_PHASES)[number];

export type PhasePower = readonly [
  earlygame: number,
  earlyMidgame: number,
  midgame: number,
  midLategame: number,
  lategame: number,
];

export type PlayerCount = 2 | 3 | 4 | 5 | 6;

export type ParticipantKind = "human" | "computer";

export type DraftFormat = "packDraft" | "snakeDraft";

export type VisibilityMode = "openPicks" | "checkpointTotals";

export type ScoringMode = "rankedPhaseSpread" | "soloThresholds";

export type WeaponType =
  | "sword"
  | "lance"
  | "axe"
  | "bow"
  | "tome"
  | "staff"
  | "dragonstone"
  | "ballista"
  | "none";

export type MovementType =
  | "infantry"
  | "armored"
  | "cavalry"
  | "flier"
  | "dragon"
  | "generic";

export type RoleTag =
  | "mage"
  | "cleric"
  | "archer"
  | "ballista"
  | "knight"
  | "cavalier"
  | "pegasus"
  | "flier"
  | "generic";

export type CoverageGroupId =
  | "pierceDefense"
  | "healing"
  | "flyingCounterplay"
  | "defense"
  | "movement";

export type PhaseScoreSpread = readonly number[];

export interface CoverageGroup {
  id: CoverageGroupId;
  label: string;
  fulfilledBy: readonly RoleTag[];
  missedPenalty: number;
}

export interface DraftSettings {
  playerCount: PlayerCount;
  pickCountPerPlayer: number;
  format: DraftFormat;
  visibility: VisibilityMode;
  scoring: ScoringMode;
  bonusesEnabled: boolean;
}

export interface Participant {
  id: string;
  name: string;
  kind: ParticipantKind;
}

export interface CharacterCard {
  id: string;
  name: string;
  phasePower?: PhasePower;
  weapons: readonly WeaponType[];
  movement: MovementType;
  roles: readonly RoleTag[];
  effects?: readonly CardEffectId[];
  notes?: string;
}

export interface DraftPick {
  participantId: Participant["id"];
  characterId: CharacterCard["id"];
  pickNumber: number;
  roundNumber: number;
}

export interface SoloScoringThreshold {
  phase: GamePhase;
  minimumPower: number;
  points: number;
}

export type CardEffectTrigger =
  | "onDrafted"
  | "beforeScoring"
  | "duringPhaseScoring"
  | "afterTeamComplete"
  | "whenRevealed"
  | "manualChoice";

export type CardEffectScope =
  | "self"
  | "ownedTeam"
  | "ownedCard"
  | "opponentCard"
  | "coverageGroup"
  | "weaponTriangle"
  | "phase";

export type CardEffectId =
  | "copyOwnedCard"
  | "phaseSpecialistBoost"
  | "weaponTriangleWildcard"
  | "supportPairBonus"
  | "coverageSubstitute"
  | "denyOpponentBonus";

export interface CardEffectIdea {
  id: CardEffectId;
  name: string;
  trigger: CardEffectTrigger;
  scope: CardEffectScope;
  description: string;
}

export const CARD_EFFECT_IDEAS = [
  {
    id: "copyOwnedCard",
    name: "Copy Owned Card",
    trigger: "manualChoice",
    scope: "ownedCard",
    description:
      "Xane can become a copy of another drafted card on the same team for scoring.",
  },
  {
    id: "phaseSpecialistBoost",
    name: "Phase Specialist Boost",
    trigger: "duringPhaseScoring",
    scope: "phase",
    description:
      "A specialist adds a small bonus in one named phase when the team already has at least one point there.",
  },
  {
    id: "weaponTriangleWildcard",
    name: "Weapon Triangle Wildcard",
    trigger: "afterTeamComplete",
    scope: "weaponTriangle",
    description:
      "The card can count as sword, lance, or axe for one completed weapon-triangle trio.",
  },
  {
    id: "supportPairBonus",
    name: "Support Pair Bonus",
    trigger: "afterTeamComplete",
    scope: "ownedTeam",
    description:
      "The card grants a bonus when drafted with a named partner or sibling group.",
  },
  {
    id: "coverageSubstitute",
    name: "Coverage Substitute",
    trigger: "beforeScoring",
    scope: "coverageGroup",
    description:
      "The card can satisfy one missing required coverage group without adding weapon access.",
  },
  {
    id: "denyOpponentBonus",
    name: "Deny Opponent Bonus",
    trigger: "whenRevealed",
    scope: "opponentCard",
    description:
      "The card can suppress one opposing card bonus in hidden-picks variants when revealed.",
  },
] as const satisfies readonly CardEffectIdea[];

