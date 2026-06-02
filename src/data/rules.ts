import type { CoverageGroup, DraftSettings, PhaseScoreSpread, PlayerCount, SoloScoringThreshold } from '../types'

export const VERSUS_SCORE_SPREAD = [5, 3, 2, 1, 0, 0] as const satisfies PhaseScoreSpread

export const PHASE_SCORE_SPREADS = {
  2: [5, 3],
  3: [5, 3, 2],
  4: [5, 3, 2, 1],
  5: [5, 3, 2, 1, 0],
  6: VERSUS_SCORE_SPREAD,
} as const satisfies Record<PlayerCount, PhaseScoreSpread>

export const DEFAULT_DRAFT_SETTINGS = {
  playerCount: 5,
  pickCountPerPlayer: 10,
  format: 'packDraft',
  visibility: 'openPicks',
  scoring: 'rankedPhaseSpread',
  bonusesEnabled: true,
} as const satisfies DraftSettings

export const REQUIRED_COVERAGE_GROUPS = [
  {
    id: 'mage',
    label: 'Mage',
    hint: 'Pierces defense',
    fulfilledByClasses: [],
    fulfilledByWeapons: ['tome'],
    fulfilledByMovements: [],
    missedPenalty: -1,
  },
  {
    id: 'cleric',
    label: 'Cleric',
    hint: 'Healing',
    fulfilledByClasses: [],
    fulfilledByWeapons: ['staff'],
    fulfilledByMovements: [],
    missedPenalty: -1,
  },
  {
    id: 'ranged',
    label: 'Ranged',
    hint: 'Bow / ballista',
    fulfilledByClasses: [],
    fulfilledByWeapons: ['bow', 'ballista'],
    fulfilledByMovements: [],
    missedPenalty: -1,
  },
  {
    id: 'defense',
    label: 'Defense',
    hint: 'Knight / cavalier',
    fulfilledByClasses: ['knight', 'general', 'cavalier', 'paladin'],
    fulfilledByWeapons: [],
    fulfilledByMovements: [],
    missedPenalty: -1,
  },
  {
    id: 'mobility',
    label: 'Mobility',
    hint: 'Cavalier / pegasus',
    fulfilledByClasses: ['cavalier', 'paladin', 'horseman', 'pegasusKnight', 'dracoknight'],
    fulfilledByWeapons: [],
    fulfilledByMovements: ['cavalry', 'flier'],
    missedPenalty: -1,
  },
] as const satisfies readonly CoverageGroup[]

export const WEAPON_TRIANGLE = ['sword', 'lance', 'axe'] as const

export const PEGASUS_SISTERS = ['palla', 'catria', 'est'] as const

export const PEGASUS_SISTERS_BONUS = 2

export const WEAPON_TRIANGLE_TRIO_BONUS = 1

export const SOLO_SCORING_THRESHOLD_PLACEHOLDERS = [
  {
    phase: 'early',
    minimumPower: 10,
    points: 5,
  },
  {
    phase: 'early',
    minimumPower: 7,
    points: 3,
  },
  {
    phase: 'early',
    minimumPower: 5,
    points: 2,
  },
] as const satisfies readonly SoloScoringThreshold[]
