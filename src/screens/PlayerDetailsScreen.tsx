import type { ReactNode } from 'react'
import type { DraftState, SetupParticipant, SetupState } from '../app-state'
import { Chevron, WeaponGlyph } from '../components/icons'
import { ScreenHeader } from '../components/ScreenHeader'
import { buildResultsModel, formatClassName, getPrimaryWeapon, PHASE_LABELS, type ResultsPlayer } from '../results-utils'
import type { CharacterCard } from '../types'

const ResultPick = ({
  character,
  index,
}: {
  character: CharacterCard
  index: number
}): ReactNode => {
  const primaryWeapon = getPrimaryWeapon(character)

  return (
    <li className="results-pick">
      <span className="results-pick__number">#{index + 1}</span>
      <span className="unit-portrait unit-portrait--compact" aria-hidden="true">
        <span>{character.name.slice(0, 1)}</span>
      </span>
      <span className="results-pick__identity">
        <span className="results-pick__name">{character.name}</span>
        <span className="results-pick__class">{formatClassName(character.class)}</span>
      </span>
      {primaryWeapon !== 'none' ? (
        <span className="results-pick__weapon">
          <WeaponGlyph weapon={primaryWeapon} size={15} />
        </span>
      ) : (
        <span className="results-pick__weapon results-pick__weapon--empty">-</span>
      )}
      <span className="results-pick__power" aria-label={`Phase power ${character.phasePower.join(', ')}`}>
        {character.phasePower.map((power, phaseIndex) => (
          <span
            className={
              power === 4
                ? 'results-pick__power-value results-pick__power-value--max'
                : power === 3
                  ? 'results-pick__power-value results-pick__power-value--high'
                  : 'results-pick__power-value'
            }
            key={`${character.id}-${phaseIndex}`}
          >
            {power}
          </span>
        ))}
      </span>
    </li>
  )
}

const EmptyPlayer: ResultsPlayer = {
  id: 'empty',
  name: 'Player',
  you: false,
  cpu: false,
  color: 'var(--ink-faint)',
  characters: [],
  phasePower: [0, 0, 0, 0, 0],
  phasePoints: [0, 0, 0, 0, 0],
  scorePoints: 0,
  bonus: {
    coverage: {
      groups: [],
      total: 0,
    },
    weaponTriangleTrios: 0,
    weaponTriangleBonus: 0,
    hasPegasusSisters: false,
    pegasusSistersBonus: 0,
    total: 0,
  },
  total: 0,
  rank: 0,
}

export const PlayerDetailsScreen = ({
  draft,
  onBack,
  onMainMenu,
  playerId,
  setup,
}: {
  draft: DraftState
  onBack: () => void
  onMainMenu: () => void
  playerId: SetupParticipant['id']
  setup: SetupState
}): ReactNode => {
  const model = buildResultsModel(setup, draft, { usePlaceholders: false })
  const player = model.players.find((candidate) => candidate.id === playerId) ?? model.players[0] ?? EmptyPlayer
  const maxPhaseTotal = Math.max(1, ...player.phasePower)
  const rawPower = player.phasePower.reduce((sum, power) => sum + power, 0)

  return (
    <main className="app-root results-screen" data-app="fe-draftsim" aria-label={`${player.name} details`}>
      <ScreenHeader backLabel="Back to results" eyebrow={`Rank ${player.rank || '-'} · ${player.characters.length} units`} title={player.you ? 'Your Team' : player.name} onBack={onBack} />
      <div className="results-screen__body">
        <section className="results-summary" aria-label="Player summary">
          <div className="results-summary__stat results-summary__stat--accent">
            <span>Points</span>
            <strong>{player.total}</strong>
          </div>
          <div className="results-summary__stat">
            <span>Power</span>
            <strong>{rawPower}</strong>
          </div>
          <div className="results-summary__stat">
            <span>Bonus</span>
            <strong>{player.bonus.total > 0 ? `+${player.bonus.total}` : '-'}</strong>
          </div>
        </section>

        <section className="results-phase" aria-labelledby="results-phase-title">
          <div className="results-section-header">
            <h2 className="results-section-header__title" id="results-phase-title">
              Phase Power
            </h2>
            <span className="results-section-header__meta">{setup.scoring}</span>
          </div>
          <div className="results-phase__list">
            {player.phasePower.map((power, index) => (
              <div className="results-phase__row" key={PHASE_LABELS[index]}>
                <span className="results-phase__label">{PHASE_LABELS[index]}</span>
                <span className="results-phase__bar-track">
                  <span className="results-phase__bar" style={{ width: power === 0 ? '0%' : `${Math.max(8, (power / maxPhaseTotal) * 100)}%` }} />
                </span>
                <strong className="results-phase__value">{power}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="results-roster" aria-labelledby="results-roster-title">
          <div className="results-section-header">
            <h2 className="results-section-header__title" id="results-roster-title">
              Picked Units
            </h2>
            <span className="results-section-header__meta">{player.characters.length} total</span>
          </div>
          {player.characters.length > 0 ? (
            <ol className="results-pick-list">
              {player.characters.map((character, index) => (
                <ResultPick character={character} index={index} key={character.id} />
              ))}
            </ol>
          ) : (
            <p className="results-roster__empty">No picks recorded</p>
          )}
        </section>
      </div>
      <footer className="results-screen__footer">
        <button className="primary-cta" type="button" onClick={onMainMenu}>
          <span>Main Menu</span>
          <Chevron light />
        </button>
      </footer>
    </main>
  )
}
