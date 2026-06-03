import type { CharacterTier, PhasePower } from './types'

export const sumPhasePowerValues = (phasePower: PhasePower): number => phasePower.reduce((sum, power) => sum + power, 0)

export const getCharacterTier = (phasePower: PhasePower): CharacterTier => {
  const total = sumPhasePowerValues(phasePower)

  if (total >= 9) {
    return 'A'
  }

  if (total >= 7) {
    return 'B'
  }

  if (total === 6) {
    return 'C'
  }

  return 'D'
}
