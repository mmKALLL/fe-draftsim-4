import { useState, type ReactNode } from 'react'
import type { DraftState, SetupParticipant, SetupState } from '../app-state'
import { CoveragePanel, formatBonus } from '../components/CoveragePanel'
import { Chevron, WeaponGlyph } from '../components/icons'
import { buildResultsModel, formatClassName, getChartScale, getPrimaryWeapon, PHASE_SHORT_LABELS, type ResultsPlayer } from '../results-utils'
import type { CharacterCard } from '../types'

type ResultsView = 'scores' | 'power' | 'rosters'

const VIEW_OPTIONS: readonly { id: ResultsView; label: string }[] = [
  { id: 'scores', label: 'Scores' },
  { id: 'power', label: 'Team Power' },
  { id: 'rosters', label: 'Rosters' },
]

interface ChartSeries {
  id: string
  name: string
  you: boolean
  color: string
  values: readonly number[]
  legendValue: number
}

const PHASE_X_VALUES = [30, 100, 170, 240, 310] as const

const getPhasePointClass = (value: number): string => {
  if (value >= 5) {
    return 'standings-point standings-point--max'
  }

  if (value >= 2) {
    return 'standings-point standings-point--mid'
  }

  return value > 0 ? 'standings-point' : 'standings-point standings-point--zero'
}

const getPolylinePoints = (values: readonly number[], maxValue: number): string =>
  values
    .map((value, index) => {
      const x = PHASE_X_VALUES[index] ?? PHASE_X_VALUES[0]
      const y = 108 - (value / maxValue) * 84

      return `${x},${y.toFixed(1)}`
    })
    .join(' ')

const sumValues = (values: readonly number[]): number => values.reduce((sum, value) => sum + value, 0)

const getPhasePowerClass = (player: ResultsPlayer, phaseIndex: number, phaseLeaders: readonly string[]): string => {
  const power = player.phasePower[phaseIndex] ?? 0

  if (phaseLeaders[phaseIndex] === player.id && power > 0) {
    return 'standings-point standings-point--max'
  }

  return power > 0 ? 'standings-point' : 'standings-point standings-point--zero'
}

const buildScoreChartSeries = (players: readonly ResultsPlayer[]): readonly ChartSeries[] =>
  players.map((player) => ({
    id: player.id,
    name: player.name,
    you: player.you,
    color: player.color,
    values: player.phasePoints,
    legendValue: player.total,
  }))

const buildPowerChartSeries = (players: readonly ResultsPlayer[]): readonly ChartSeries[] =>
  players.map((player) => ({
    id: player.id,
    name: player.name,
    you: player.you,
    color: player.color,
    values: player.phasePower,
    legendValue: sumValues(player.phasePower),
  }))

const ResultsToggle = ({
  onChange,
  value,
}: {
  onChange: (value: ResultsView) => void
  value: ResultsView
}): ReactNode => (
  <div className="standings-toggle" role="tablist" aria-label="Results view">
    {VIEW_OPTIONS.map((option) => (
      <button
        className={option.id === value ? 'standings-toggle__option standings-toggle__option--active' : 'standings-toggle__option'}
        key={option.id}
        type="button"
        onClick={() => onChange(option.id)}
        role="tab"
        aria-selected={option.id === value}
      >
        {option.label}
      </button>
    ))}
  </div>
)

const ResultsLineChart = ({
  ariaLabel,
  series,
}: {
  ariaLabel: string
  series: readonly ChartSeries[]
}): ReactNode => {
  const scale = getChartScale(series.map((player) => player.values))

  return (
    <svg className="standings-chart" viewBox="0 0 340 132" role="img" aria-label={ariaLabel} key={series.map((player) => `${player.id}:${player.values.join('/')}`).join('|')}>
      {scale.gridValues.map((value) => {
        const y = 108 - (value / scale.maxValue) * 84

        return (
          <g key={`grid-${value}`}>
            <line className="standings-chart__grid" x1="30" x2="310" y1={y.toFixed(1)} y2={y.toFixed(1)} />
            <text className="standings-chart__axis" x="22" y={(y + 3).toFixed(1)} textAnchor="end">
              {value}
            </text>
          </g>
        )
      })}
      {series.map((player) => (
        <g key={`${player.id}-${player.values.join('-')}`}>
          <polyline className={player.you ? 'standings-chart__line standings-chart__line--you' : 'standings-chart__line'} points={getPolylinePoints(player.values, scale.maxValue)} pathLength={1} style={{ stroke: player.color }} />
          {player.values.map((value, index) => {
            const x = PHASE_X_VALUES[index] ?? PHASE_X_VALUES[0]
            const y = 108 - (value / scale.maxValue) * 84

            return (
              <circle
                className={player.you ? 'standings-chart__point standings-chart__point--you' : 'standings-chart__point'}
                cx={x}
                cy={y.toFixed(1)}
                key={`${player.id}-${index}`}
                r={player.you ? 3.3 : 2.4}
                style={{ stroke: player.color }}
              />
            )
          })}
          {player.you
            ? player.values.map((value, index) => {
                const x = PHASE_X_VALUES[index] ?? PHASE_X_VALUES[0]
                const y = 108 - (value / scale.maxValue) * 84

                return (
                  <text className="standings-chart__value" key={`value-${index}`} x={x} y={(y - 8).toFixed(1)}>
                    {value}
                  </text>
                )
              })
            : null}
        </g>
      ))}
      {PHASE_SHORT_LABELS.map((label, index) => (
        <text className="standings-chart__label" key={label} x={PHASE_X_VALUES[index]} y="127">
          {label}
        </text>
      ))}
    </svg>
  )
}

const ChartLegend = ({ series }: { series: readonly ChartSeries[] }): ReactNode => (
  <div className="standings-legend">
    {series.map((player) => (
      <span className="standings-legend__item" key={player.id}>
        <span className="standings-legend__swatch" style={{ background: player.color }} />
        <span className={player.you ? 'standings-legend__name standings-legend__name--you' : 'standings-legend__name'}>{player.name}</span>
        <span className="standings-legend__points">({player.legendValue})</span>
      </span>
    ))}
  </div>
)

const ComparisonView = ({
  chartAriaLabel,
  chartSeries,
  chartTitle,
  children,
  className,
  legendSeries,
  playerForCoverage,
}: {
  chartAriaLabel: string
  chartSeries: readonly ChartSeries[]
  chartTitle: string
  children: ReactNode
  className: string
  legendSeries: readonly ChartSeries[]
  playerForCoverage: ResultsPlayer | undefined
}): ReactNode => (
  <div className={`standings-view ${className}`}>
    <section className="standings-chart-section" aria-label={chartTitle}>
      <h2 className="standings-section-label">{chartTitle}</h2>
      <ResultsLineChart ariaLabel={chartAriaLabel} series={chartSeries} />
      <ChartLegend series={legendSeries} />
    </section>

    {playerForCoverage ? <CoveragePanel player={playerForCoverage} /> : null}

    {children}
  </div>
)

const StandingsTable = ({
  mode,
  onViewPlayerDetails,
  phaseLeaders = [],
  rankedPlayers,
}: {
  mode: 'scores' | 'power'
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  phaseLeaders?: readonly string[]
  rankedPlayers: readonly ResultsPlayer[]
}): ReactNode => {
  const ariaLabel = mode === 'scores' ? 'Score leaderboard' : 'Team power leaderboard'
  const totalLabel = mode === 'scores' ? 'Pts' : 'Pow'

  return (
    <section className="leaderboard" aria-label={ariaLabel}>
      <div className="leaderboard__header">
        <span>Player</span>
        <span>EAR</span>
        <span>E-M</span>
        <span>MID</span>
        <span>M-L</span>
        <span>LATE</span>
        <span>Bon</span>
        <span>{totalLabel}</span>
      </div>
      <div className="leaderboard__rows">
        {rankedPlayers.map((player) => {
          const phaseValues = mode === 'scores' ? player.phasePoints : player.phasePower
          const total = mode === 'scores' ? player.total : sumValues(player.phasePower)

          return (
            <button className={player.you ? 'leaderboard-row leaderboard-row--you' : 'leaderboard-row'} key={player.id} type="button" onClick={() => onViewPlayerDetails(player.id)}>
              <span className="leaderboard-row__player">
                <span className={player.rank === 1 ? 'leaderboard-row__rank leaderboard-row__rank--first' : 'leaderboard-row__rank'}>{player.rank}</span>
                <span className={player.you ? 'leaderboard-row__name leaderboard-row__name--you' : 'leaderboard-row__name'}>{player.name}</span>
              </span>
              {phaseValues.map((value, index) => (
                <span className={mode === 'scores' ? getPhasePointClass(value) : getPhasePowerClass(player, index, phaseLeaders)} key={`${player.id}-${index}`}>
                  {value}
                </span>
              ))}
              <span className={player.bonus.total > 0 ? 'leaderboard-row__bonus leaderboard-row__bonus--positive' : 'leaderboard-row__bonus'}>{formatBonus(player.bonus.total)}</span>
              <strong className={player.you ? 'leaderboard-row__total leaderboard-row__total--you' : 'leaderboard-row__total'}>{total}</strong>
            </button>
          )
        })}
      </div>
    </section>
  )
}

const ScoresTable = ({
  onViewPlayerDetails,
  rankedPlayers,
}: {
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  rankedPlayers: readonly ResultsPlayer[]
}): ReactNode => <StandingsTable mode="scores" onViewPlayerDetails={onViewPlayerDetails} rankedPlayers={rankedPlayers} />

const PowerTable = ({
  onViewPlayerDetails,
  phaseLeaders,
  rankedPlayers,
}: {
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  phaseLeaders: readonly string[]
  rankedPlayers: readonly ResultsPlayer[]
}): ReactNode => (
  <>
    <StandingsTable mode="power" onViewPlayerDetails={onViewPlayerDetails} phaseLeaders={phaseLeaders} rankedPlayers={rankedPlayers} />
    <p className="leaderboard-caption">
      <span />
      phase leader
    </p>
  </>
)

const ScoresView = ({
  onViewPlayerDetails,
  players,
  rankedPlayers,
}: {
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  players: readonly ResultsPlayer[]
  rankedPlayers: readonly ResultsPlayer[]
}): ReactNode => {
  const you = players.find((player) => player.you) ?? players[0]

  return (
    <ComparisonView
      chartAriaLabel="Phase score points by player"
      chartSeries={buildScoreChartSeries(players)}
      chartTitle="Score points by phase"
      className="standings-view--scores"
      legendSeries={buildScoreChartSeries(rankedPlayers)}
      playerForCoverage={you}
    >
      <ScoresTable onViewPlayerDetails={onViewPlayerDetails} rankedPlayers={rankedPlayers} />
    </ComparisonView>
  )
}

const PowerView = ({
  onViewPlayerDetails,
  phaseLeaders,
  players,
  rankedPlayers,
}: {
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  phaseLeaders: readonly string[]
  players: readonly ResultsPlayer[]
  rankedPlayers: readonly ResultsPlayer[]
}): ReactNode => {
  const you = players.find((player) => player.you) ?? players[0]

  return (
    <ComparisonView
      chartAriaLabel="Raw team power by player"
      chartSeries={buildPowerChartSeries(players)}
      chartTitle="Team power by phase"
      className="standings-view--power"
      legendSeries={buildPowerChartSeries(rankedPlayers)}
      playerForCoverage={you}
    >
      <PowerTable onViewPlayerDetails={onViewPlayerDetails} phaseLeaders={phaseLeaders} rankedPlayers={rankedPlayers} />
    </ComparisonView>
  )
}

const RosterRow = ({ character }: { character: CharacterCard }): ReactNode => {
  const primaryWeapon = getPrimaryWeapon(character)

  return (
    <li className="roster-row">
      <span className="unit-portrait unit-portrait--compact" aria-hidden="true">
        <span>{character.name.slice(0, 1)}</span>
      </span>
      <span className="roster-row__identity">
        <span className="roster-row__name-row">
          <span className="roster-row__name">{character.name}</span>
          {primaryWeapon !== 'none' ? <WeaponGlyph weapon={primaryWeapon} size={13} /> : null}
        </span>
        <span className="roster-row__class">{formatClassName(character.class)}</span>
      </span>
      <span className="roster-row__power">
        {character.phasePower.map((value, index) => (
          <span key={`${character.id}-${index}`}>{value}</span>
        ))}
      </span>
    </li>
  )
}

const RostersView = ({
  onSelectPlayer,
  onViewPlayerDetails,
  players,
  selectedPlayerId,
}: {
  onSelectPlayer: (playerId: SetupParticipant['id']) => void
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  players: readonly ResultsPlayer[]
  selectedPlayerId: SetupParticipant['id']
}): ReactNode => {
  const selectedPlayer = players.find((player) => player.id === selectedPlayerId) ?? players[0]

  return (
    <div className="standings-view standings-view--rosters">
      <div className="roster-tabs" role="tablist" aria-label="Player rosters">
        {players.map((player) => (
          <button
            className={player.id === selectedPlayer?.id ? 'roster-tabs__tab roster-tabs__tab--active' : 'roster-tabs__tab'}
            key={player.id}
            type="button"
            onClick={() => onSelectPlayer(player.id)}
            role="tab"
            aria-selected={player.id === selectedPlayer?.id}
          >
            {player.name}
          </button>
        ))}
      </div>
      {selectedPlayer ? (
        <section className="roster-panel" aria-label={`${selectedPlayer.name} roster`}>
          <div className="roster-panel__header">
            <h2>{selectedPlayer.you ? 'Your Team' : selectedPlayer.name}</h2>
            <button type="button" onClick={() => onViewPlayerDetails(selectedPlayer.id)}>
              Details
            </button>
          </div>
          <ol className="roster-list">
            {selectedPlayer.characters.map((character) => (
              <RosterRow character={character} key={character.id} />
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  )
}

export const ResultsScreen = ({
  draft,
  onBack,
  onMainMenu,
  onViewPlayerDetails,
  setup,
}: {
  draft: DraftState
  onBack: () => void
  onMainMenu: () => void
  onViewPlayerDetails: (playerId: SetupParticipant['id']) => void
  setup: SetupState
}): ReactNode => {
  const [view, setView] = useState<ResultsView>('scores')
  const [selectedRosterPlayerId, setSelectedRosterPlayerId] = useState<SetupParticipant['id']>(setup.players[0]?.id ?? 'human-1')
  const model = buildResultsModel(setup, draft, { usePlaceholders: false })
  const you = model.players.find((player) => player.you) ?? model.players[0]

  return (
    <main className="app-root standings-screen" data-app="fe-draftsim" aria-label="Overall results">
      <header className="standings-header">
        <div className="standings-header__top">
          <div className="standings-header__copy">
            <p className="standings-header__eyebrow">Round 10 / 10 · Final picks in</p>
            <h1 className="standings-header__title">Standings</h1>
          </div>
          <button className="standings-header__back" type="button" onClick={onBack}>
            <Chevron direction="left" />
            <span>Back</span>
          </button>
        </div>
        <ResultsToggle onChange={setView} value={view} />
      </header>
      <div className="standings-screen__body">
        {view === 'scores' ? (
          <ScoresView onViewPlayerDetails={onViewPlayerDetails} players={model.players} rankedPlayers={model.rankedPlayers} />
        ) : view === 'power' ? (
          <PowerView onViewPlayerDetails={onViewPlayerDetails} phaseLeaders={model.phaseLeaders} players={model.players} rankedPlayers={model.rankedPlayers} />
        ) : (
          <RostersView onSelectPlayer={setSelectedRosterPlayerId} onViewPlayerDetails={onViewPlayerDetails} players={model.players} selectedPlayerId={selectedRosterPlayerId} />
        )}
      </div>
      <footer className="standings-screen__footer">
        <button className="standings-secondary-action" type="button" onClick={() => you && onViewPlayerDetails(you.id)} disabled={!you}>
          View Team
        </button>
        <button className="standings-primary-action" type="button" onClick={onMainMenu}>
          Main Menu
        </button>
      </footer>
    </main>
  )
}
