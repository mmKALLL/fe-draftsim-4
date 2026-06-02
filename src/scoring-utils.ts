import {
  PEGASUS_SISTERS,
  PEGASUS_SISTERS_BONUS,
  PHASE_SCORE_SPREADS,
  REQUIRED_COVERAGE_GROUPS,
  WEAPON_TRIANGLE,
  WEAPON_TRIANGLE_TRIO_BONUS,
} from './data/rules'
import { GAME_PHASES, type CharacterCard, type CoverageGroup, type GamePhase, type PhasePower, type PlayerCount, type SoloScoringThreshold, type WeaponType } from './types'

export interface ScoringTeam {
  id: string
  characters: readonly CharacterCard[]
}

export interface RankedPhaseEntry {
  id: string
  phasePower: number
}

export interface RankedPhaseScore {
  id: string
  phasePower: number
  rank: number
  points: number
}

export interface RankedPhaseScores {
  phase: GamePhase
  scores: readonly RankedPhaseScore[]
}

export interface TeamRankedScoreTotal {
  id: string
  phaseScores: Record<GamePhase, number>
  total: number
}

export interface RankedPhasesScore {
  perPhase: readonly RankedPhaseScores[]
  totals: readonly TeamRankedScoreTotal[]
}

export interface CoverageGroupScore {
  group: CoverageGroup
  satisfied: boolean
  penalty: number
}

export interface CoverageScore {
  groups: readonly CoverageGroupScore[]
  totalPenalty: number
}

export interface TeamBonusScore {
  coverage: CoverageScore
  weaponTriangleTrios: number
  weaponTriangleBonus: number
  hasPegasusSisters: boolean
  pegasusSistersBonus: number
  total: number
}

export interface SoloThresholdPhaseScore {
  phase: GamePhase
  phasePower: number
  points: number
  matchedThreshold?: SoloScoringThreshold
}

export interface SoloThresholdScore {
  perPhase: readonly SoloThresholdPhaseScore[]
  total: number
}

const TRIANGLE_WEAPONS = new Set<WeaponType>(WEAPON_TRIANGLE)
const PEGASUS_SISTER_IDS = new Set<string>(PEGASUS_SISTERS)

export const isPlayerCount = (value: number): value is PlayerCount => Number.isInteger(value) && value >= 2 && value <= 6

export const getPhaseScoreSpread = (playerCount: PlayerCount): readonly number[] => PHASE_SCORE_SPREADS[playerCount]

const resolvePlayerCount = (teams: readonly ScoringTeam[], playerCount?: PlayerCount): PlayerCount => {
  const resolvedPlayerCount = playerCount ?? teams.length

  if (!isPlayerCount(resolvedPlayerCount)) {
    throw new Error(`Expected 2-6 scoring teams, received ${resolvedPlayerCount}`)
  }

  return resolvedPlayerCount
}

export const sumPhasePower = (characters: readonly CharacterCard[]): PhasePower =>
  characters.reduce<PhasePower>(
    (total, character) => [
      total[0] + character.phasePower[0],
      total[1] + character.phasePower[1],
      total[2] + character.phasePower[2],
      total[3] + character.phasePower[3],
      total[4] + character.phasePower[4],
    ],
    [0, 0, 0, 0, 0],
  )

export const sumCharacterTotals = (characters: readonly CharacterCard[]): number =>
  characters.reduce((total, character) => total + character.total, 0)

export const getPhasePower = (phasePower: PhasePower, phase: GamePhase): number => {
  switch (phase) {
    case 'earlygame':
      return phasePower[0]
    case 'earlyMidgame':
      return phasePower[1]
    case 'midgame':
      return phasePower[2]
    case 'midLategame':
      return phasePower[3]
    case 'lategame':
      return phasePower[4]
  }
}

export const scoreRankedPhase = (entries: readonly RankedPhaseEntry[], spread: readonly number[]): readonly RankedPhaseScore[] => {
  const sortedEntries = [...entries].sort((left, right) => right.phasePower - left.phasePower)
  let previousPower: number | undefined
  let currentRank = 0

  return sortedEntries.map((entry, index) => {
    if (entry.phasePower !== previousPower) {
      currentRank = index + 1
      previousPower = entry.phasePower
    }

    return {
      ...entry,
      rank: currentRank,
      points: spread[currentRank - 1] ?? 0,
    }
  })
}

const createEmptyPhaseScores = (): Record<GamePhase, number> => ({
  earlygame: 0,
  earlyMidgame: 0,
  midgame: 0,
  midLategame: 0,
  lategame: 0,
})

export const scoreRankedPhases = (teams: readonly ScoringTeam[], playerCount?: PlayerCount): RankedPhasesScore => {
  const spread = getPhaseScoreSpread(resolvePlayerCount(teams, playerCount))
  const totalsByTeam = new Map<string, TeamRankedScoreTotal>(
    teams.map((team) => [
      team.id,
      {
        id: team.id,
        phaseScores: createEmptyPhaseScores(),
        total: 0,
      },
    ]),
  )
  const phasePowerByTeam = new Map(teams.map((team) => [team.id, sumPhasePower(team.characters)]))

  const perPhase = GAME_PHASES.map((phase) => {
    const scores = scoreRankedPhase(
      teams.map((team) => ({
        id: team.id,
        phasePower: getPhasePower(phasePowerByTeam.get(team.id) ?? [0, 0, 0, 0, 0], phase),
      })),
      spread,
    )

    for (const score of scores) {
      const teamTotal = totalsByTeam.get(score.id)

      if (teamTotal) {
        teamTotal.phaseScores[phase] = score.points
        teamTotal.total += score.points
      }
    }

    return {
      phase,
      scores,
    }
  })

  return {
    perPhase,
    totals: [...totalsByTeam.values()],
  }
}

export const scoreCoverage = (
  characters: readonly CharacterCard[],
  coverageGroups: readonly CoverageGroup[] = REQUIRED_COVERAGE_GROUPS,
): CoverageScore => {
  const groups = coverageGroups.map((group) => {
    const satisfied = characters.some((character) => group.fulfilledBy.includes(character.class))

    return {
      group,
      satisfied,
      penalty: satisfied ? 0 : group.missedPenalty,
    }
  })

  return {
    groups,
    totalPenalty: groups.reduce((total, group) => total + group.penalty, 0),
  }
}

export const countWeaponTriangleTrios = (characters: readonly CharacterCard[]): number => {
  const counts = new Map<WeaponType, number>(
    WEAPON_TRIANGLE.map((weapon) => [weapon, 0]),
  )

  for (const character of characters) {
    for (const weapon of new Set(character.weapons)) {
      if (TRIANGLE_WEAPONS.has(weapon)) {
        counts.set(weapon, (counts.get(weapon) ?? 0) + 1)
      }
    }
  }

  return Math.min(...WEAPON_TRIANGLE.map((weapon) => counts.get(weapon) ?? 0))
}

export const scoreWeaponTriangle = (characters: readonly CharacterCard[]): number =>
  countWeaponTriangleTrios(characters) * WEAPON_TRIANGLE_TRIO_BONUS

export const hasPegasusSisters = (characters: readonly CharacterCard[]): boolean => {
  const characterIds = new Set(characters.map((character) => character.id))

  for (const sisterId of PEGASUS_SISTER_IDS) {
    if (!characterIds.has(sisterId)) {
      return false
    }
  }

  return true
}

export const scorePegasusSisters = (characters: readonly CharacterCard[]): number =>
  hasPegasusSisters(characters) ? PEGASUS_SISTERS_BONUS : 0

export const scoreTeamBonuses = (characters: readonly CharacterCard[]): TeamBonusScore => {
  const coverage = scoreCoverage(characters)
  const weaponTriangleTrios = countWeaponTriangleTrios(characters)
  const weaponTriangleBonus = weaponTriangleTrios * WEAPON_TRIANGLE_TRIO_BONUS
  const pegasusSistersBonus = scorePegasusSisters(characters)

  return {
    coverage,
    weaponTriangleTrios,
    weaponTriangleBonus,
    hasPegasusSisters: pegasusSistersBonus > 0,
    pegasusSistersBonus,
    total: coverage.totalPenalty + weaponTriangleBonus + pegasusSistersBonus,
  }
}

export const scoreSoloThresholds = (
  characters: readonly CharacterCard[],
  thresholds: readonly SoloScoringThreshold[],
): SoloThresholdScore => {
  const teamPhasePower = sumPhasePower(characters)
  const thresholdsByPhase = new Map<GamePhase, readonly SoloScoringThreshold[]>(
    GAME_PHASES.map((phase) => [
      phase,
      thresholds
        .filter((threshold) => threshold.phase === phase)
        .sort((left, right) => right.minimumPower - left.minimumPower),
    ]),
  )
  const perPhase = GAME_PHASES.map((phase): SoloThresholdPhaseScore => {
    const phasePower = getPhasePower(teamPhasePower, phase)
    const matchedThreshold = thresholdsByPhase.get(phase)?.find((threshold) => phasePower >= threshold.minimumPower)

    return {
      phase,
      phasePower,
      points: matchedThreshold?.points ?? 0,
      ...(matchedThreshold ? { matchedThreshold } : {}),
    }
  })

  return {
    perPhase,
    total: perPhase.reduce((total, phaseScore) => total + phaseScore.points, 0),
  }
}
