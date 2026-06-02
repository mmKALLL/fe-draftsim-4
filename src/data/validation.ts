import type { CharacterCard, PhasePower } from '../types'

export interface CharacterTotalMismatch {
  id: CharacterCard['id']
  name: CharacterCard['name']
  phasePower: PhasePower
  expectedTotal: number
  actualTotal: number
}

const sumPhasePower = (phasePower: PhasePower): number => phasePower.reduce((sum, power) => sum + power, 0)

export const findCharacterTotalMismatches = (characters: readonly CharacterCard[]): CharacterTotalMismatch[] =>
  characters.flatMap((character) => {
    const expectedTotal = sumPhasePower(character.phasePower)

    if (expectedTotal === character.total) {
      return []
    }

    return [
      {
        id: character.id,
        name: character.name,
        phasePower: character.phasePower,
        expectedTotal,
        actualTotal: character.total,
      },
    ]
  })

export const logCharacterTotalMismatches = (characters: readonly CharacterCard[]): void => {
  const mismatches = findCharacterTotalMismatches(characters)

  if (mismatches.length === 0) {
    return
  }

  console.log('[FE DraftSim] Character total mismatches', mismatches)
}
