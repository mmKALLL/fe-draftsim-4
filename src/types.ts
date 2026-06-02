export const GAME_PHASES = ['earlygame', 'earlyMidgame', 'midgame', 'midLategame', 'lategame'] as const

export type GamePhase = (typeof GAME_PHASES)[number]

export type PhasePower = readonly [earlygame: number, earlyMidgame: number, midgame: number, midLategame: number, lategame: number]

export type PlayerCount = 2 | 3 | 4 | 5 | 6

export type ParticipantKind = 'human' | 'computer'

export type DraftFormat = 'packDraft' | 'snakeDraft'

export type VisibilityMode = 'openPicks' | 'checkpointTotals'

export type ScoringMode = 'rankedPhaseSpread' | 'soloThresholds'

export type WeaponType = 'sword' | 'lance' | 'axe' | 'bow' | 'tome' | 'staff' | 'dragonstone' | 'ballista' | 'none'

export type MovementType = 'infantry' | 'armored' | 'cavalry' | 'flier' | 'dragon' | 'generic'

export const CLASSES = [
  'lord',
  'cavalier',
  'paladin',
  'knight',
  'general',
  'archer',
  'sniper',
  'hunter',
  'horseman',
  'pegasusKnight',
  'dracoknight',
  'mercenary',
  'hero',
  'curate',
  'cleric',
  'bishop',
  'myrmidon',
  'swordmaster',
  'fighter',
  'warrior',
  'pirate',
  'berserker',
  'mage',
  'sage',
  'darkMage',
  'sorcerer',
  'thief',
  'manakete',
  'ballistician',
  'freelancer',
] as const

export type Class = (typeof CLASSES)[number]

export type CoverageGroupId = 'magic' | 'healing' | 'pierce' | 'defense' | 'movement'

export type PhaseScoreSpread = readonly number[]

export interface CoverageGroup {
  id: CoverageGroupId
  label: string
  fulfilledBy: readonly Class[]
  missedPenalty: number
}

export interface DraftSettings {
  playerCount: PlayerCount
  pickCountPerPlayer: number
  format: DraftFormat
  visibility: VisibilityMode
  scoring: ScoringMode
  bonusesEnabled: boolean
}

export interface Participant {
  id: string
  name: string
  kind: ParticipantKind
}

export interface CharacterCard {
  id: string
  name: string
  phasePower: PhasePower
  total: number
  class: Class
  weapons: readonly WeaponType[]
  movement: MovementType
  effects?: readonly CardEffectId[]
  notes?: string
}

export interface DraftPick {
  participantId: Participant['id']
  characterId: CharacterCard['id']
  pickNumber: number
  roundNumber: number
}

export interface SoloScoringThreshold {
  phase: GamePhase
  minimumPower: number
  points: number
}

export type CardEffectTrigger = 'onDrafted' | 'beforeScoring' | 'duringPhaseScoring' | 'afterTeamComplete' | 'whenRevealed' | 'manualChoice'

export type CardEffectScope = 'self' | 'ownedTeam' | 'ownedCard' | 'opponentCard' | 'coverageGroup' | 'weaponTriangle' | 'phase'

export type CardEffectId = 'copyOwnedCard' | 'phaseSpecialistBoost' | 'weaponTriangleWildcard' | 'supportPairBonus' | 'coverageSubstitute' | 'denyOpponentBonus'
