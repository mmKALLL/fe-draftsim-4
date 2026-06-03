import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { MAX_PLAYERS, MIN_PLAYERS, type SetupParticipant, type SetupParticipantKind, type SetupState } from '../app-state'
import { Chevron, XIcon } from '../components/icons'
import { ScreenHeader } from '../components/ScreenHeader'

let nextParticipantId = 5

const SetupSection = ({
  children,
  hint,
  title,
}: {
  children: ReactNode
  hint?: string
  title: string
}): ReactNode => {
  const labelId = `setup-${title.toLowerCase().replaceAll(' ', '-')}`

  return (
    <section className="setup-section" aria-labelledby={labelId}>
      <div className="setup-section__header">
        <h2 className="setup-section__title" id={labelId}>
          {title}
        </h2>
        {hint ? <span className="setup-section__hint">{hint}</span> : null}
      </div>
      {children}
    </section>
  )
}

const ParticipantBadge = ({ kind }: { kind: SetupParticipantKind }): ReactNode => (
  <span className={kind === 'human' ? 'participant-badge participant-badge--human' : 'participant-badge participant-badge--cpu'}>
    <span className="participant-badge__dot" aria-hidden="true" />
    <span>{kind === 'human' ? 'Human' : 'CPU'}</span>
  </span>
)

const PlayerRow = ({
  canRemove,
  onNameChange,
  onRemove,
  player,
}: {
  canRemove: boolean
  onNameChange: (id: string, name: string) => void
  onRemove: (id: string) => void
  player: SetupParticipant
}): ReactNode => (
  <div className="player-row">
    <ParticipantBadge kind={player.kind} />
    <input
      className="player-row__input"
      aria-label={`${player.kind === 'human' ? 'Human' : 'CPU'} player name`}
      value={player.name}
      onChange={(event: Event) => {
        if (event.target instanceof HTMLInputElement) {
          onNameChange(player.id, event.target.value)
        }
      }}
    />
    <button className="player-row__remove" type="button" disabled={!canRemove} onClick={() => onRemove(player.id)} aria-label={`Remove ${player.name}`}>
      <XIcon />
    </button>
  </div>
)

const AddPlayerButton = ({
  disabled,
  kind,
  onClick,
}: {
  disabled: boolean
  kind: SetupParticipantKind
  onClick: () => void
}): ReactNode => (
  <button className={kind === 'human' ? 'add-player add-player--human' : 'add-player'} type="button" onClick={onClick} disabled={disabled}>
    {kind === 'human' ? '+ Add Human' : '+ Add CPU'}
  </button>
)

const OptionCard = ({
  description,
  label,
  onClick,
  selected,
}: {
  description: string
  label: string
  onClick: () => void
  selected: boolean
}): ReactNode => (
  <button className={selected ? 'option-card option-card--selected' : 'option-card'} type="button" onClick={onClick} aria-pressed={selected}>
    <span className="option-card__heading">
      <span className="option-card__radio" aria-hidden="true">
        {selected ? <span className="option-card__radio-dot" /> : null}
      </span>
      <span>{label}</span>
    </span>
    <span className="option-card__description">{description}</span>
  </button>
)

const ToggleRow = ({
  description,
  label,
  on,
  onClick,
}: {
  description: string
  label: string
  on: boolean
  onClick: () => void
}): ReactNode => (
  <button className="toggle-row" type="button" onClick={onClick} aria-pressed={on}>
    <span className="toggle-row__copy">
      <span className="toggle-row__label">{label}</span>
      <span className="toggle-row__description">{description}</span>
    </span>
    <span className={on ? 'toggle-switch toggle-switch--on' : 'toggle-switch'} aria-hidden="true">
      <span className="toggle-switch__knob" />
    </span>
  </button>
)

export const NewGameSetup = ({
  onBack,
  onBeginDraft,
  setup,
  setSetup,
}: {
  onBack: () => void
  onBeginDraft: () => void
  setup: SetupState
  setSetup: Dispatch<SetStateAction<SetupState>>
}): ReactNode => {
  const canAdd = setup.players.length < MAX_PLAYERS
  const canRemove = setup.players.length > MIN_PLAYERS

  const addParticipant = (kind: SetupParticipantKind): void => {
    setSetup((previous) => {
      if (previous.players.length >= MAX_PLAYERS) {
        return previous
      }

      const nextNumber = previous.players.length + 1
      const participant: SetupParticipant = {
        id: `${kind}-${nextParticipantId++}`,
        kind,
        name: `Player ${nextNumber}`,
      }

      return {
        ...previous,
        players: [...previous.players, participant],
      }
    })
  }

  const removeParticipant = (id: string): void => {
    setSetup((previous) => {
      if (previous.players.length <= MIN_PLAYERS) {
        return previous
      }

      return {
        ...previous,
        players: previous.players.filter((player) => player.id !== id),
      }
    })
  }

  const changeParticipantName = (id: string, name: string): void => {
    setSetup((previous) => ({
      ...previous,
      players: previous.players.map((player) => (player.id === id ? { ...player, name } : player)),
    }))
  }

  return (
    <main className="app-root setup-screen" data-app="fe-draftsim" aria-label="New game setup">
      <ScreenHeader backLabel="Back to main menu" eyebrow="Configure the draft" title="New Game" onBack={onBack} />
      <div className="setup-screen__body">
        <SetupSection title="Players" hint="2-6">
          <div className="player-list">
            {setup.players.map((player) => (
              <PlayerRow key={player.id} canRemove={canRemove} onNameChange={changeParticipantName} onRemove={removeParticipant} player={player} />
            ))}
          </div>
          <div className="add-player-group">
            <AddPlayerButton disabled={!canAdd} kind="human" onClick={() => addParticipant('human')} />
            <AddPlayerButton disabled={!canAdd} kind="cpu" onClick={() => addParticipant('cpu')} />
          </div>
        </SetupSection>

        <SetupSection title="Scoring Variant" hint="how points are won">
          <div className="option-grid">
            <OptionCard
              description="Score points by your placement in each phase."
              label="Versus"
              onClick={() => setSetup({ ...setup, scoring: 'versus' })}
              selected={setup.scoring === 'versus'}
            />
            <OptionCard
              description="Beat fixed power thresholds each phase for points."
              label="Solo"
              onClick={() => setSetup({ ...setup, scoring: 'solo' })}
              selected={setup.scoring === 'solo'}
            />
          </div>
        </SetupSection>

        <SetupSection title="Modifiers">
          <ToggleRow
            description="Reveal totals only at pick 5 and end"
            label="Hidden picks"
            on={setup.hiddenPicks}
            onClick={() => setSetup({ ...setup, hiddenPicks: !setup.hiddenPicks })}
          />
          <ToggleRow
            description="Coverage, weapon triangle, and triangle attack"
            label="Bonus rules"
            on={setup.modifiersEnabled}
            onClick={() => setSetup({ ...setup, modifiersEnabled: !setup.modifiersEnabled })}
          />
        </SetupSection>
      </div>
      <footer className="setup-screen__footer">
        <button className="primary-cta" type="button" onClick={onBeginDraft}>
          <span>Begin Draft</span>
          <Chevron light />
        </button>
      </footer>
    </main>
  )
}
