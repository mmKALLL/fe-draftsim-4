import type { ReactNode } from 'react'
import { DRAFT_PACK_SIZE, type DraftState, type SetupState } from '../app-state'
import { CoveragePanel } from '../components/CoveragePanel'
import { ScreenHeader } from '../components/ScreenHeader'
import { WeaponGlyph } from '../components/icons'
import { getCurrentDrafter, getCurrentPackCharacters, isDraftComplete } from '../draft-utils'
import { buildResultsModel, getChartScale, PHASE_SHORT_LABELS, type ResultsPlayer } from '../results-utils'
import type { CharacterCard, PhasePower, WeaponType } from '../types'

const BAR_HEIGHTS = [3, 10, 18, 28, 34] as const
const DRAFT_CHART_X_VALUES = [28, 96, 164, 232, 300] as const

const formatClassName = (value: CharacterCard['class']): string =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())

const getPrimaryWeapon = (character: CharacterCard): WeaponType => character.weapons.find((weapon) => weapon !== 'none') ?? 'none'

const Portrait = ({ name }: { name: string }): ReactNode => (
  <span className="unit-portrait" aria-hidden="true">
    <span>{name.slice(0, 1)}</span>
  </span>
)

const getPhaseBarClass = (value: number): string => (value === 4 ? 'phase-bars__bar phase-bars__bar--max' : value === 3 ? 'phase-bars__bar phase-bars__bar--high' : 'phase-bars__bar')

const getPhaseValueClass = (value: number): string =>
  value === 4 ? 'phase-bars__value phase-bars__value--max' : value === 3 ? 'phase-bars__value phase-bars__value--high' : 'phase-bars__value'

const PhaseBars = ({ phasePower }: { phasePower: PhasePower }): ReactNode => (
  <div className="phase-bars" aria-label={`Phase power ${phasePower.join(', ')}`}>
    <div className="phase-bars__bars" aria-hidden="true">
      {phasePower.map((value, index) => (
        <span className="phase-bars__bar-cell" key={index}>
          <span className={getPhaseValueClass(value)}>{value}</span>
          <span className={getPhaseBarClass(value)} style={{ height: `${BAR_HEIGHTS[value] ?? BAR_HEIGHTS[0]}px` }} />
        </span>
      ))}
    </div>
    <div className="phase-bars__labels" aria-hidden="true">
      {PHASE_SHORT_LABELS.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  </div>
)

const DraftCard = ({
  character,
  disabled,
  onPick,
}: {
  character: CharacterCard
  disabled: boolean
  onPick: (characterId: CharacterCard['id']) => void
}): ReactNode => {
  const primaryWeapon = getPrimaryWeapon(character)

  return (
    <article className="draft-card">
      <header className="draft-card__header">
        <Portrait name={character.name} />
        <div className="draft-card__identity">
          <div className="draft-card__name-row">
            <h3 className="draft-card__name">{character.name}</h3>
            {primaryWeapon !== 'none' ? <WeaponGlyph weapon={primaryWeapon} size={15} /> : <span className="draft-card__no-weapon">-</span>}
          </div>
          <p className="draft-card__class">{formatClassName(character.class)}</p>
        </div>
        <button className="draft-card__take" type="button" onClick={() => onPick(character.id)} aria-label={`Pick ${character.name}`} disabled={disabled}>
          Pick
        </button>
      </header>
      <PhaseBars phasePower={character.phasePower} />
    </article>
  )
}

const getPlacement = (players: readonly ResultsPlayer[]): string => {
  const rank = players.find((player) => player.you)?.rank ?? 0

  return ['1st', '2nd', '3rd', '4th', '5th', '6th'][rank - 1] ?? `${rank}th`
}

const getPolylinePoints = (values: PhasePower, maxValue: number): string =>
  values
    .map((value, index) => {
      const x = DRAFT_CHART_X_VALUES[index] ?? DRAFT_CHART_X_VALUES[0]
      const y = 106 - (value / maxValue) * 88

      return `${x},${y.toFixed(1)}`
    })
    .join(' ')

const PhasePowerChart = ({
  onDetails,
  players,
}: {
  onDetails: () => void
  players: readonly ResultsPlayer[]
}): ReactNode => {
  const scale = getChartScale(players.map((player) => player.phasePower))

  return (
    <section className="draft-standings" aria-labelledby="draft-standings-title">
      <div className="draft-standings__header">
        <div className="draft-standings__rank">
          <span>{"You're"}</span>
          <strong>{getPlacement(players)}</strong>
          <span>of {players.length}</span>
        </div>
        <button className="draft-standings__details" type="button" onClick={onDetails}>
          Details
        </button>
      </div>
      <svg className="phase-chart" viewBox="0 0 320 136" role="img" aria-labelledby="draft-standings-title" key={players.map((player) => `${player.id}:${player.phasePower.join('/')}`).join('|')}>
        <title id="draft-standings-title">Team power by game phase</title>
        {scale.gridValues.map((value) => {
          const y = 106 - (value / scale.maxValue) * 88

          return (
            <g key={`grid-${value}`}>
              <line className="phase-chart__grid" x1="24" x2="312" y1={y.toFixed(1)} y2={y.toFixed(1)} />
              <text className="phase-chart__axis" x="17" y={(y + 3).toFixed(1)} textAnchor="end">
                {value}
              </text>
            </g>
          )
        })}
        {players.map((player) => (
          <g key={`${player.id}-${player.phasePower.join('-')}`}>
            <polyline
              className={player.you ? 'phase-chart__line phase-chart__line--you' : 'phase-chart__line'}
              points={getPolylinePoints(player.phasePower, scale.maxValue)}
              pathLength={1}
              style={{ stroke: player.color }}
            />
            {player.phasePower.map((value, index) => {
              const x = DRAFT_CHART_X_VALUES[index] ?? DRAFT_CHART_X_VALUES[0]
              const y = 106 - (value / scale.maxValue) * 88

              return (
                <circle
                  className={player.you ? 'phase-chart__point phase-chart__point--you' : 'phase-chart__point'}
                  cx={x}
                  cy={y.toFixed(1)}
                  key={`${player.id}-${index}`}
                  r={player.you ? 3.2 : 2.3}
                  style={{ fill: player.color }}
                />
              )
            })}
            {player.you
              ? player.phasePower.map((value, index) => {
                  const x = DRAFT_CHART_X_VALUES[index] ?? DRAFT_CHART_X_VALUES[0]
                  const y = 106 - (value / scale.maxValue) * 88

                  return (
                    <text className="phase-chart__value" key={`you-${index}`} x={x} y={(y - 8).toFixed(1)}>
                      {value}
                    </text>
                  )
                })
              : null}
          </g>
        ))}
        {PHASE_SHORT_LABELS.map((label, index) => (
          <text className="phase-chart__label" key={label} x={DRAFT_CHART_X_VALUES[index]} y="130">
            {label}
          </text>
        ))}
      </svg>
      <div className="chart-legend">
        {players.map((player) => (
          <span className="chart-legend__item" key={player.id}>
            <span className="chart-legend__swatch" style={{ background: player.color }} />
            <span>{player.name}</span>
            <strong>{player.total}</strong>
          </span>
        ))}
      </div>
    </section>
  )
}

export const DraftScreen = ({
  draft,
  onBack,
  onPick,
  onViewResults,
  setup,
}: {
  draft: DraftState
  onBack: () => void
  onPick: (characterId: CharacterCard['id']) => void
  onViewResults: () => void
  setup: SetupState
}): ReactNode => {
  const chartPlayers = buildResultsModel(setup, draft, { usePlaceholders: false }).players
  const remainingCards = getCurrentPackCharacters(setup, draft)
  const complete = isDraftComplete(draft)
  const nextPickNumber = Math.min(draft.roundNumber, DRAFT_PACK_SIZE)
  const currentDrafter = getCurrentDrafter(setup, draft)
  const canPick = currentDrafter?.kind === 'human' && !complete
  const currentDrafterLabel = currentDrafter?.id === setup.players[0]?.id ? 'Your turn' : currentDrafter ? `${currentDrafter.name}'s turn` : `${draft.picks.length} picked`
  const draftMeta = complete ? `${draft.picks.length} picked` : `${remainingCards.length} in pack · ${currentDrafterLabel}`
  const coveragePlayer = chartPlayers.find((player) => player.id === currentDrafter?.id) ?? chartPlayers.find((player) => player.you) ?? chartPlayers[0]

  return (
    <main className="app-root draft-screen" data-app="fe-draftsim" aria-label="Draft phase">
      <ScreenHeader backLabel="Back to setup" eyebrow={`Round ${nextPickNumber} / ${DRAFT_PACK_SIZE}`} title="Draft" onBack={onBack} />
      <div className="draft-screen__body">
        <section className="draft-pack" aria-labelledby="draft-pack-title">
          <div className="draft-pack__header">
            <h2 className="draft-pack__title" id="draft-pack-title">
              Pick {nextPickNumber}
              <span>of {DRAFT_PACK_SIZE}</span>
            </h2>
            <p className="draft-pack__meta">{draftMeta}</p>
          </div>
          {!complete && remainingCards.length > 0 ? (
            <div className="draft-pack__grid">
              {remainingCards.map((character) => (
                <DraftCard character={character} disabled={!canPick} key={character.id} onPick={onPick} />
              ))}
            </div>
          ) : (
            <div className="draft-pack__empty">
              <h3 className="draft-pack__empty-title">Draft Complete</h3>
              <p className="draft-pack__empty-copy">{draft.picks.length} picks recorded</p>
              <button className="draft-pack__empty-action" type="button" onClick={onViewResults}>
                View Results
              </button>
            </div>
          )}
        </section>
        <PhasePowerChart onDetails={onViewResults} players={chartPlayers} />
        {coveragePlayer ? <CoveragePanel player={coveragePlayer} /> : null}
      </div>
    </main>
  )
}
