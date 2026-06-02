import type { CoverageGroup, DraftSettings, PhaseScoreSpread, PlayerCount, SoloScoringThreshold } from '../types'

export const PHASE_SCORE_SPREADS = {
  2: [2, 0],
  3: [4, 2, 0],
  4: [5, 3, 2, 0],
  5: [5, 3, 2, 1, -2],
  6: [8, 5, 3, 2, 1, -2],
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
    id: 'pierceDefense',
    label: 'Pierce defense',
    fulfilledBy: ['mage'],
    missedPenalty: -1,
  },
  {
    id: 'healing',
    label: 'Healing',
    fulfilledBy: ['cleric'],
    missedPenalty: -1,
  },
  {
    id: 'flyingCounterplay',
    label: 'Flying counterplay',
    fulfilledBy: ['archer', 'ballista'],
    missedPenalty: -1,
  },
  {
    id: 'defense',
    label: 'Defense',
    fulfilledBy: ['knight', 'cavalier'],
    missedPenalty: -1,
  },
  {
    id: 'movement',
    label: 'Movement',
    fulfilledBy: ['cavalier', 'pegasus'],
    missedPenalty: -1,
  },
] as const satisfies readonly CoverageGroup[]

export const WEAPON_TRIANGLE = ['sword', 'lance', 'axe'] as const

export const PEGASUS_SISTERS = ['palla', 'catria', 'est'] as const

export const PEGASUS_SISTERS_BONUS = 2

export const WEAPON_TRIANGLE_TRIO_BONUS = 1

export const SOLO_SCORING_THRESHOLD_PLACEHOLDERS = [
  {
    phase: 'earlygame',
    minimumPower: 10,
    points: 5,
  },
  {
    phase: 'earlygame',
    minimumPower: 7,
    points: 3,
  },
  {
    phase: 'earlygame',
    minimumPower: 5,
    points: 2,
  },
] as const satisfies readonly SoloScoringThreshold[]
