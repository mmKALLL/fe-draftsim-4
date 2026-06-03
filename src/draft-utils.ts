import {
  DRAFT_PACK_CHARACTER_IDS,
  DRAFT_PACK_SIZE,
  type CpuDraftStrategyId,
  type DraftPack,
  type DraftPickRecord,
  type DraftState,
  type SetupParticipant,
  type SetupState,
} from './app-state'
import { CHARACTER_ROSTER } from './data/characters'
import { scoreTeamBonuses } from './scoring-utils'
import type { CharacterCard } from './types'

export const CPU_DRAFT_STRATEGIES = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'earlyPower', label: 'Early Power' },
  { id: 'latePower', label: 'Late Power' },
  { id: 'bonusHunter', label: 'Bonus Hunter' },
] as const satisfies readonly { id: CpuDraftStrategyId; label: string }[]

const CHARACTER_BY_ID = new Map<CharacterCard['id'], CharacterCard>(CHARACTER_ROSTER.map((character) => [character.id, character]))

export const isDraftComplete = (draft: DraftState): boolean => draft.packs.length === 0 || draft.packs.every((pack) => pack.cardIds.length === 0)

export const getCurrentDrafter = (setup: SetupState, draft: DraftState): SetupParticipant | undefined => {
  if (setup.players.length === 0 || isDraftComplete(draft)) {
    return undefined
  }

  return setup.players[draft.currentTurnIndex % setup.players.length]
}

export const getCurrentPack = (setup: SetupState, draft: DraftState): DraftPack | undefined => {
  if (setup.players.length === 0 || draft.packs.length === 0 || isDraftComplete(draft)) {
    return undefined
  }

  return draft.packs[draft.currentTurnIndex % draft.packs.length]
}

export const getCurrentPackCharacters = (setup: SetupState, draft: DraftState): CharacterCard[] => {
  const currentPack = getCurrentPack(setup, draft)

  return currentPack?.cardIds.map((characterId) => CHARACTER_BY_ID.get(characterId)).filter((character): character is CharacterCard => character !== undefined) ?? []
}

export const getRemainingDraftCharacters = (draft: DraftState): CharacterCard[] =>
  draft.packs
    .flatMap((pack) => pack.cardIds)
    .map((characterId) => CHARACTER_BY_ID.get(characterId))
    .filter((character): character is CharacterCard => character !== undefined)

const chooseCpuStrategy = (): CpuDraftStrategyId => {
  const strategy = CPU_DRAFT_STRATEGIES[Math.floor(Math.random() * CPU_DRAFT_STRATEGIES.length)] ?? CPU_DRAFT_STRATEGIES[0]

  return strategy.id
}

const createCpuStrategies = (setup: SetupState): DraftState['cpuStrategies'] =>
  Object.fromEntries(setup.players.filter((player) => player.kind === 'cpu').map((player) => [player.id, chooseCpuStrategy()]))

const getOrderedDraftCharacterIds = (): CharacterCard['id'][] => {
  const usedIds = new Set<CharacterCard['id']>()
  const orderedIds: CharacterCard['id'][] = []

  for (const characterId of DRAFT_PACK_CHARACTER_IDS) {
    if (!usedIds.has(characterId) && CHARACTER_BY_ID.has(characterId)) {
      orderedIds.push(characterId)
      usedIds.add(characterId)
    }
  }

  for (const character of CHARACTER_ROSTER) {
    if (!usedIds.has(character.id)) {
      orderedIds.push(character.id)
      usedIds.add(character.id)
    }
  }

  return orderedIds
}

const createInitialPacks = (setup: SetupState): DraftPack[] => {
  const orderedCharacterIds = getOrderedDraftCharacterIds()

  return setup.players.map((player, index) => ({
    id: `pack-${index + 1}`,
    originPlayerId: player.id,
    cardIds: orderedCharacterIds.slice(index * DRAFT_PACK_SIZE, (index + 1) * DRAFT_PACK_SIZE),
  }))
}

const rotatePacksClockwise = (packs: readonly DraftPack[]): DraftPack[] => {
  if (packs.length === 0) {
    return []
  }

  return packs.map((_, index) => {
    const previousIndex = (index - 1 + packs.length) % packs.length
    const pack = packs[previousIndex]

    if (!pack) {
      throw new Error(`Expected draft pack at index ${previousIndex}`)
    }

    return pack
  })
}

const getTeamCharacters = (draft: DraftState, playerId: SetupParticipant['id']): CharacterCard[] =>
  draft.picks
    .filter((pick) => pick.playerId === playerId)
    .map((pick) => CHARACTER_BY_ID.get(pick.characterId))
    .filter((character): character is CharacterCard => character !== undefined)

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

const chooseCpuCharacter = (draft: DraftState, setup: SetupState, player: SetupParticipant): CharacterCard | undefined => {
  const currentTeam = getTeamCharacters(draft, player.id)
  const strategy = draft.cpuStrategies[player.id] ?? 'balanced'

  return [...getCurrentPackCharacters(setup, draft)].sort((left, right) => {
    const scoreDifference =
      getCandidateScore({
        candidate: right,
        currentTeam,
        strategy,
      }) -
      getCandidateScore({
        candidate: left,
        currentTeam,
        strategy,
      })

    return scoreDifference || right.total - left.total || left.name.localeCompare(right.name)
  })[0]
}

const advanceTurnAfterPick = (draft: DraftState, setup: SetupState): DraftState => {
  if (setup.players.length === 0) {
    return draft
  }

  const nextTurnIndex = (draft.currentTurnIndex + 1) % setup.players.length
  const completedRound = nextTurnIndex === 0

  return {
    ...draft,
    currentTurnIndex: nextTurnIndex,
    packs: completedRound ? rotatePacksClockwise(draft.packs) : draft.packs,
    roundNumber: completedRound ? draft.roundNumber + 1 : draft.roundNumber,
  }
}

const recordPick = (draft: DraftState, setup: SetupState, player: SetupParticipant, characterId: CharacterCard['id']): DraftState => {
  if (setup.players.length === 0 || draft.pickedCharacterIds.includes(characterId)) {
    return draft
  }

  const packIndex = draft.currentTurnIndex % setup.players.length
  const currentPack = draft.packs[packIndex]

  if (!currentPack?.cardIds.includes(characterId)) {
    return draft
  }

  const pick: DraftPickRecord = {
    characterId,
    pickNumber: draft.picks.length + 1,
    playerId: player.id,
    roundNumber: draft.roundNumber,
  }
  const nextDraft: DraftState = {
    ...draft,
    pickedCharacterIds: [...draft.pickedCharacterIds, characterId],
    picks: [...draft.picks, pick],
    packs: draft.packs.map((pack, index) => (index === packIndex ? { ...pack, cardIds: pack.cardIds.filter((id) => id !== characterId) } : pack)),
  }

  return advanceTurnAfterPick(nextDraft, setup)
}

const advanceCpuTurns = (draft: DraftState, setup: SetupState): DraftState => {
  const maxIterations = setup.players.length * DRAFT_PACK_SIZE + setup.players.length + 1
  let nextDraft = draft
  let iterations = 0

  while (!isDraftComplete(nextDraft) && iterations < maxIterations) {
    const currentDrafter = getCurrentDrafter(setup, nextDraft)

    if (!currentDrafter || currentDrafter.kind !== 'cpu') {
      break
    }

    const cpuChoice = chooseCpuCharacter(nextDraft, setup, currentDrafter)

    nextDraft = cpuChoice ? recordPick(nextDraft, setup, currentDrafter, cpuChoice.id) : advanceTurnAfterPick(nextDraft, setup)
    iterations += 1
  }

  return nextDraft
}

export const createInitialDraftState = (setup: SetupState): DraftState => {
  const initialDraft: DraftState = {
    pickedCharacterIds: [],
    picks: [],
    packs: createInitialPacks(setup),
    roundNumber: 1,
    currentTurnIndex: 0,
    cpuStrategies: createCpuStrategies(setup),
  }

  return advanceCpuTurns(initialDraft, setup)
}

export const draftCharacterForCurrentPlayer = (draft: DraftState, setup: SetupState, characterId: CharacterCard['id']): DraftState => {
  const currentDrafter = getCurrentDrafter(setup, draft)

  if (!currentDrafter) {
    return draft
  }

  if (currentDrafter.kind === 'cpu') {
    return advanceCpuTurns(draft, setup)
  }

  if (!getCurrentPack(setup, draft)?.cardIds.includes(characterId)) {
    return draft
  }

  return advanceCpuTurns(recordPick(draft, setup, currentDrafter, characterId), setup)
}
