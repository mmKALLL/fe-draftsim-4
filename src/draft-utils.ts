import { DRAFT_PACK_CHARACTER_IDS, type CpuDraftStrategyId, type DraftPickRecord, type DraftState, type SetupParticipant, type SetupState } from './app-state'
import { CHARACTER_ROSTER } from './data/characters'
import { scoreTeamBonuses } from './scoring-utils'
import type { CharacterCard } from './types'

export const CPU_DRAFT_STRATEGIES = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'earlyPower', label: 'Early Power' },
  { id: 'latePower', label: 'Late Power' },
  { id: 'bonusHunter', label: 'Bonus Hunter' },
] as const satisfies readonly { id: CpuDraftStrategyId; label: string }[]

const CHARACTER_BY_ID = new Map<string, CharacterCard>(CHARACTER_ROSTER.map((character) => [character.id, character]))

export const getRemainingDraftCharacters = (draft: DraftState): CharacterCard[] => {
  const pickedIds = new Set(draft.pickedCharacterIds)

  return DRAFT_PACK_CHARACTER_IDS.map((characterId) => CHARACTER_BY_ID.get(characterId)).filter((character): character is CharacterCard => character !== undefined && !pickedIds.has(character.id))
}

export const getCurrentDrafter = (setup: SetupState, draft: DraftState): SetupParticipant | undefined => setup.players[draft.currentTurnIndex % Math.max(1, setup.players.length)]

const getTeamCharacters = (draft: DraftState, playerId: SetupParticipant['id']): CharacterCard[] =>
  draft.picks
    .filter((pick) => pick.playerId === playerId)
    .map((pick) => CHARACTER_BY_ID.get(pick.characterId))
    .filter((character): character is CharacterCard => character !== undefined)

const chooseCpuStrategy = (): CpuDraftStrategyId => CPU_DRAFT_STRATEGIES[Math.floor(Math.random() * CPU_DRAFT_STRATEGIES.length)]?.id ?? 'balanced'

const createCpuStrategies = (setup: SetupState): DraftState['cpuStrategies'] =>
  Object.fromEntries(setup.players.filter((player) => player.kind === 'cpu').map((player) => [player.id, chooseCpuStrategy()]))

const getCandidateScore = ({
  candidate,
  currentTeam,
  strategy,
}: {
  candidate: CharacterCard
  currentTeam: readonly CharacterCard[]
  strategy: CpuDraftStrategyId
}): number => {
  switch (strategy) {
    case 'earlyPower':
      return candidate.phasePower[0] * 3 + candidate.phasePower[1] * 2 + candidate.total * 0.4
    case 'latePower':
      return candidate.phasePower[3] * 2 + candidate.phasePower[4] * 3 + candidate.total * 0.4
    case 'bonusHunter':
      return scoreTeamBonuses([...currentTeam, candidate]).total * 5 + candidate.total
    case 'balanced':
      return candidate.total
  }
}

const chooseCpuCharacter = (draft: DraftState, player: SetupParticipant): CharacterCard | undefined => {
  const remainingCharacters = getRemainingDraftCharacters(draft)
  const currentTeam = getTeamCharacters(draft, player.id)
  const strategy = draft.cpuStrategies[player.id] ?? 'balanced'

  return [...remainingCharacters].sort((left, right) => getCandidateScore({ candidate: right, currentTeam, strategy }) - getCandidateScore({ candidate: left, currentTeam, strategy }))[0]
}

const recordPick = (draft: DraftState, setup: SetupState, player: SetupParticipant, characterId: CharacterCard['id']): DraftState => {
  const pickNumber = draft.picks.length + 1
  const pick: DraftPickRecord = {
    characterId,
    playerId: player.id,
    pickNumber,
    roundNumber: Math.ceil(pickNumber / Math.max(1, setup.players.length)),
  }

  return {
    ...draft,
    pickedCharacterIds: [...draft.pickedCharacterIds, characterId],
    picks: [...draft.picks, pick],
    currentTurnIndex: setup.players.length > 0 ? (draft.currentTurnIndex + 1) % setup.players.length : 0,
  }
}

export const advanceCpuTurns = (draft: DraftState, setup: SetupState): DraftState => {
  let nextDraft = draft
  let guard = 0

  while (getRemainingDraftCharacters(nextDraft).length > 0 && guard < DRAFT_PACK_CHARACTER_IDS.length) {
    const currentDrafter = getCurrentDrafter(setup, nextDraft)

    if (!currentDrafter || currentDrafter.kind !== 'cpu') {
      return nextDraft
    }

    const selectedCharacter = chooseCpuCharacter(nextDraft, currentDrafter)

    if (!selectedCharacter) {
      return nextDraft
    }

    nextDraft = recordPick(nextDraft, setup, currentDrafter, selectedCharacter.id)
    guard += 1
  }

  return nextDraft
}

export const createInitialDraftState = (setup: SetupState): DraftState =>
  advanceCpuTurns(
    {
      pickedCharacterIds: [],
      picks: [],
      currentTurnIndex: 0,
      cpuStrategies: createCpuStrategies(setup),
    },
    setup,
  )

export const draftCharacterForCurrentPlayer = (draft: DraftState, setup: SetupState, characterId: CharacterCard['id']): DraftState => {
  if (draft.pickedCharacterIds.includes(characterId)) {
    return draft
  }

  const currentDrafter = getCurrentDrafter(setup, draft)

  if (!currentDrafter || currentDrafter.kind !== 'human') {
    return advanceCpuTurns(draft, setup)
  }

  const selectedCharacter = CHARACTER_BY_ID.get(characterId)

  if (!selectedCharacter || !DRAFT_PACK_CHARACTER_IDS.includes(selectedCharacter.id as (typeof DRAFT_PACK_CHARACTER_IDS)[number])) {
    return draft
  }

  return advanceCpuTurns(recordPick(draft, setup, currentDrafter, selectedCharacter.id), setup)
}
