import { DRAFT_PACK_CHARACTER_IDS, DRAFT_PACK_SIZE, type DraftState, type SetupParticipant, type SetupState } from './app-state'
import { CHARACTER_ROSTER } from './data/characters'
import { GAME_PHASES, type CharacterCard, type GamePhase, type PhasePower, type WeaponType } from './types'
import { scoreRankedPhases, scoreTeamBonuses, sumPhasePower, type TeamBonusScore } from './scoring-utils'

export const PHASE_SHORT_LABELS = ['EAR', 'E-MID', 'MID', 'M-LATE', 'LATE'] as const
export const PHASE_LABELS = ['Early', 'Early-Mid', 'Mid', 'Mid-Late', 'Late'] as const
export const RESULTS_COLORS = ['var(--crimson)', 'var(--bronze)', 'var(--sage)', '#6f6a9a', '#8a704f', '#4f7f89'] as const

export interface ChartScale {
  maxValue: number
  gridValues: readonly number[]
}

const CHARACTER_BY_ID = new Map<string, CharacterCard>(CHARACTER_ROSTER.map((character) => [character.id, character]))

const PLACEHOLDER_TEAM_IDS = [
  DRAFT_PACK_CHARACTER_IDS,
  ['cain', 'abel', 'ogma', 'bord', 'cord', 'sedgar', 'draug', 'castor', 'julian', 'xane'],
  ['marth', 'jagen', 'frey', 'norne', 'wrys', 'matthis', 'roshea', 'vyland', 'wendell', 'athena'],
  ['palla', 'catria', 'minerva', 'jeorge', 'boah', 'horace', 'tomas', 'beck', 'astram', 'etzel'],
  ['caesar', 'roger', 'midia', 'dolph', 'macellan', 'linde', 'est', 'bantu', 'lorenz', 'tiki'],
  ['darros', 'rickard', 'maria', 'arran', 'samson', 'ymir', 'elice', 'gotoh', 'nagi', 'zas'],
] as const satisfies readonly (readonly CharacterCard['id'][])[]

export interface ResultsPlayer {
  id: SetupParticipant['id']
  name: string
  you: boolean
  cpu: boolean
  color: string
  characters: readonly CharacterCard[]
  phasePower: PhasePower
  phasePoints: readonly number[]
  scorePoints: number
  bonus: TeamBonusScore
  total: number
  rank: number
}

export interface ResultsModel {
  players: readonly ResultsPlayer[]
  rankedPlayers: readonly ResultsPlayer[]
  phaseLeaders: readonly string[]
}

export interface BuildResultsModelOptions {
  usePlaceholders?: boolean
}

export const getCharacterById = (characterId: CharacterCard['id']): CharacterCard | undefined => CHARACTER_BY_ID.get(characterId)

export const formatClassName = (value: CharacterCard['class']): string =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())

export const getPrimaryWeapon = (character: CharacterCard): WeaponType => character.weapons.find((weapon) => weapon !== 'none') ?? 'none'

export const getPhasePowerAt = (phasePower: PhasePower, phase: GamePhase): number => {
  const phaseIndex = GAME_PHASES.indexOf(phase)

  return phasePower[phaseIndex] ?? 0
}

export const getChartScale = (seriesValues: readonly (readonly number[])[]): ChartScale => {
  const highWater = Math.max(0, ...seriesValues.flat())
  const maxValue = Math.max(10, Math.ceil(highWater / 10) * 10)

  return {
    maxValue,
    gridValues: maxValue <= 10 ? [0, 5, 10] : [0, maxValue / 2, maxValue],
  }
}

const getCharactersFromIds = (characterIds: readonly CharacterCard['id'][]): CharacterCard[] =>
  characterIds.map((characterId) => getCharacterById(characterId)).filter((character): character is CharacterCard => character !== undefined)

const buildRealTeams = (setup: SetupState, draft: DraftState): readonly { id: SetupParticipant['id']; characters: readonly CharacterCard[] }[] =>
  setup.players.map((player) => ({
    id: player.id,
    characters: draft.picks
      .filter((pick) => pick.playerId === player.id)
      .map((pick) => getCharacterById(pick.characterId))
      .filter((character): character is CharacterCard => character !== undefined),
  }))

const buildPlaceholderTeam = ({
  playerIndex,
  preferredIds,
  targetTeamSize,
  usedIds,
}: {
  playerIndex: number
  preferredIds: readonly CharacterCard['id'][]
  targetTeamSize: number
  usedIds: Set<CharacterCard['id']>
}): CharacterCard[] => {
  const fallbackStart = (playerIndex * targetTeamSize) % CHARACTER_ROSTER.length
  const teamIds: CharacterCard['id'][] = []

  for (const characterId of preferredIds) {
    if (!usedIds.has(characterId) && getCharacterById(characterId)) {
      teamIds.push(characterId)
      usedIds.add(characterId)
    }
  }

  for (let offset = 0; teamIds.length < targetTeamSize && offset < CHARACTER_ROSTER.length; offset += 1) {
    const character = CHARACTER_ROSTER[(fallbackStart + offset) % CHARACTER_ROSTER.length]

    if (character && !usedIds.has(character.id)) {
      teamIds.push(character.id)
      usedIds.add(character.id)
    }
  }

  return getCharactersFromIds(teamIds)
}

export const buildResultsModel = (setup: SetupState, draft: DraftState, options: BuildResultsModelOptions = {}): ResultsModel => {
  const usePlaceholders = options.usePlaceholders ?? true
  const usedIds = new Set<CharacterCard['id']>()
  const targetTeamSize = DRAFT_PACK_SIZE
  const teams =
    draft.picks.length > 0 || !usePlaceholders
      ? buildRealTeams(setup, draft)
      : setup.players.map((player, index) => {
          const preferredIds = PLACEHOLDER_TEAM_IDS[index] ?? []
          const characters = buildPlaceholderTeam({
            playerIndex: index,
            preferredIds,
            targetTeamSize,
            usedIds,
          })

          return {
            id: player.id,
            characters,
          }
        })

  const rankedPhaseScore = scoreRankedPhases(teams)
  const phaseScoreByPlayer = new Map(rankedPhaseScore.totals.map((total) => [total.id, total]))
  const playersWithoutRank = setup.players.map((player, index) => {
    const team = teams[index]
    const phaseScore = phaseScoreByPlayer.get(player.id)
    const phasePower = sumPhasePower(team?.characters ?? [])
    const bonus = scoreTeamBonuses(team?.characters ?? [])
    const scorePoints = phaseScore?.total ?? 0

    return {
      id: player.id,
      name: index === 0 ? 'You' : player.name,
      you: index === 0,
      cpu: player.kind === 'cpu',
      color: RESULTS_COLORS[index % RESULTS_COLORS.length] ?? 'var(--ink-faint)',
      characters: team?.characters ?? [],
      phasePower,
      phasePoints: GAME_PHASES.map((phase) => phaseScore?.phaseScores[phase] ?? 0),
      scorePoints,
      bonus,
      total: scorePoints + (setup.modifiersEnabled ? bonus.total : 0),
    }
  })
  const rankedPlayers = [...playersWithoutRank]
    .sort((left, right) => right.total - left.total || right.scorePoints - left.scorePoints)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }))
  const rankByPlayer = new Map(rankedPlayers.map((player) => [player.id, player.rank]))
  const players = playersWithoutRank.map((player) => ({
    ...player,
    rank: rankByPlayer.get(player.id) ?? 0,
  }))
  const phaseLeaders = GAME_PHASES.map((_, phaseIndex) => {
    const leader = [...players].sort((left, right) => (right.phasePower[phaseIndex] ?? 0) - (left.phasePower[phaseIndex] ?? 0))[0]

    return leader?.id ?? ''
  })

  return {
    players,
    rankedPlayers,
    phaseLeaders,
  }
}
