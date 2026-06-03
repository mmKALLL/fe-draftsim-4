import type { CharacterCard } from './types'

export type AppScreen = 'menu' | 'setup' | 'draft' | 'results' | 'playerDetails'
export type SetupParticipantKind = 'human' | 'cpu'
export type SetupScoring = 'versus' | 'solo'
export type CpuDraftStrategyId = 'balanced' | 'earlyPower' | 'latePower' | 'bonusHunter'

export interface SetupParticipant {
  id: string
  name: string
  kind: SetupParticipantKind
}

export interface SetupState {
  players: SetupParticipant[]
  scoring: SetupScoring
  hiddenPicks: boolean
  modifiersEnabled: boolean
}

export interface DraftState {
  pickedCharacterIds: CharacterCard['id'][]
  picks: DraftPickRecord[]
  packs: DraftPack[]
  roundNumber: number
  currentTurnIndex: number
  cpuStrategies: Partial<Record<SetupParticipant['id'], CpuDraftStrategyId>>
}

export interface DraftPack {
  id: string
  originPlayerId: SetupParticipant['id']
  cardIds: CharacterCard['id'][]
}

export interface DraftPickRecord {
  characterId: CharacterCard['id']
  playerId: SetupParticipant['id']
  pickNumber: number
  roundNumber: number
}

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 6
export const DRAFT_PACK_SIZE = 10

export const DRAFT_PACK_CHARACTER_IDS = ['caeda', 'barst', 'hardin', 'wolf', 'navarre', 'merric', 'lena', 'jake', 'athena', 'wendell'] as const

export const DEFAULT_SETUP_STATE: SetupState = {
  players: [
    { id: 'human-1', name: 'Player 1', kind: 'human' },
    { id: 'cpu-2', name: 'Player 2', kind: 'cpu' },
    { id: 'cpu-3', name: 'Player 3', kind: 'cpu' },
    { id: 'cpu-4', name: 'Player 4', kind: 'cpu' },
  ],
  scoring: 'versus',
  hiddenPicks: false,
  modifiersEnabled: true,
}

export const DEFAULT_DRAFT_STATE: DraftState = {
  pickedCharacterIds: [],
  picks: [],
  packs: [],
  roundNumber: 1,
  currentTurnIndex: 0,
  cpuStrategies: {},
}
