import { createElement, useState, type ReactNode } from 'react'

type WeaponGlyphName = 'sword' | 'lance'
type AppScreen = 'menu' | 'setup'
type SetupParticipantKind = 'human' | 'cpu'
type SetupScoring = 'versus' | 'solo'

interface MenuItem {
  title: string
  subtitle: string
  primary?: boolean
  onClick?: () => void
}

interface SetupParticipant {
  id: string
  name: string
  kind: SetupParticipantKind
}

interface SetupState {
  players: SetupParticipant[]
  scoring: SetupScoring
  hiddenPicks: boolean
  modifiersEnabled: boolean
}

const h = createElement

const MIN_PLAYERS = 2
const MAX_PLAYERS = 6

let nextParticipantId = 5

const DEFAULT_SETUP_STATE: SetupState = {
  players: [
    { id: 'human-1', name: 'Player 1', kind: 'human' },
    { id: 'cpu-2', name: 'Player 2', kind: 'cpu' },
    { id: 'cpu-3', name: 'Player 3', kind: 'cpu' },
    { id: 'cpu-4', name: 'Player 4', kind: 'cpu' },
  ],
  scoring: 'versus',
  hiddenPicks: false,
  modifiersEnabled: true,
}

const WeaponGlyph = ({ weapon, size = 20 }: { weapon: WeaponGlyphName; size?: number }): ReactNode => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (weapon === 'sword') {
    return h(
      'svg',
      {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        'aria-hidden': 'true',
        className: 'weapon-glyph',
      },
      h('path', { ...common, d: 'M12 2.5l1.4 3v8h-2.8v-8z' }),
      h('path', { ...common, d: 'M8.5 13h7' }),
      h('path', { ...common, d: 'M12 13v5' }),
      h('path', { ...common, d: 'M10.4 18h3.2' }),
    )
  }

  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
      className: 'weapon-glyph',
    },
    h('path', { ...common, d: 'M12 2.5l2.2 4-2.2 2.4-2.2-2.4z' }),
    h('path', { ...common, d: 'M12 8.9V21.5' }),
  )
}

const Chevron = ({
  direction = 'right',
  light = false,
}: {
  direction?: 'left' | 'right'
  light?: boolean
}): ReactNode =>
  h(
    'svg',
    {
      width: 16,
      height: 16,
      viewBox: '0 0 16 16',
      fill: 'none',
      stroke: light ? 'var(--paper)' : 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      'aria-hidden': 'true',
      className: 'chevron-icon',
    },
    h('path', { d: direction === 'left' ? 'M10 3L5 8l5 5' : 'M5 3l5 5-5 5' }),
  )

const XIcon = (): ReactNode =>
  h(
    'svg',
    {
      width: 12,
      height: 12,
      viewBox: '0 0 12 12',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      'aria-hidden': 'true',
    },
    h('path', { d: 'M3 3l6 6M9 3l-6 6' }),
  )

const GameLogo = (): ReactNode =>
  h(
    'div',
    { className: 'game-logo' },
    h(
      'div',
      { className: 'game-logo__glyph-row' },
      h(WeaponGlyph, { weapon: 'sword', size: 20 }),
      h('span', { className: 'game-logo__the' }, 'The'),
      h(WeaponGlyph, { weapon: 'lance', size: 20 }),
    ),
    h('h1', { className: 'game-logo__title', id: 'main-menu-title' }, 'Emblem', h('br'), h('span', null, 'Draft')),
    h('p', { className: 'game-logo__subtitle' }, 'An FE11 Draft Simulator'),
  )

const MenuButton = ({ item }: { item: MenuItem }): ReactNode =>
  h(
    'button',
    {
      className: item.primary ? 'menu-button menu-button--primary' : 'menu-button',
      type: 'button',
      onClick: item.onClick,
    },
    h(
      'span',
      { className: 'menu-button__copy' },
      h('span', { className: 'menu-button__title' }, item.title),
      h('span', { className: 'menu-button__subtitle' }, item.subtitle),
    ),
    h(Chevron, { light: item.primary }),
  )

const MainMenu = ({ onNewGame }: { onNewGame: () => void }): ReactNode => {
  const menuItems: readonly MenuItem[] = [
    {
      title: 'New Game',
      subtitle: '2–6 players · local',
      primary: true,
      onClick: onNewGame,
    },
    {
      title: 'Continue',
      subtitle: 'Round 7 · 4 players',
    },
    {
      title: 'How to Play',
      subtitle: 'Rules & scoring',
    },
    {
      title: 'Roster',
      subtitle: '60 characters',
    },
  ]

  return h(
    'main',
    {
      className: 'app-root menu-screen',
      'data-app': 'fe-draftsim',
      'aria-label': 'Emblem Draft',
    },
    h('div', { className: 'ledger-lines', 'aria-hidden': 'true' }),
    h(
      'section',
      { className: 'main-menu', 'aria-labelledby': 'main-menu-title' },
      h(GameLogo),
      h(
        'nav',
        { className: 'main-menu__actions', 'aria-label': 'Main menu' },
        ...menuItems.map((item) => h(MenuButton, { key: item.title, item })),
      ),
      h(
        'footer',
        { className: 'main-menu__footer' },
        h('span', { className: 'main-menu__version' }, 'v0.4 · local play'),
        h(
          'span',
          { className: 'main-menu__links' },
          h('button', { className: 'text-link', type: 'button' }, 'Settings'),
          h('button', { className: 'text-link', type: 'button' }, 'About'),
        ),
      ),
    ),
  )
}

const ScreenHeader = ({
  eyebrow,
  title,
  onBack,
}: {
  eyebrow: string
  title: string
  onBack: () => void
}): ReactNode =>
  h(
    'header',
    { className: 'screen-header' },
    h(
      'button',
      {
        className: 'icon-button',
        type: 'button',
        onClick: onBack,
        'aria-label': 'Back to main menu',
      },
      h(Chevron, { direction: 'left' }),
    ),
    h(
      'div',
      { className: 'screen-header__copy' },
      h('h1', { className: 'screen-header__title' }, title),
      h('p', { className: 'screen-header__eyebrow' }, eyebrow),
    ),
  )

const SetupSection = ({
  children,
  hint,
  title,
}: {
  children: ReactNode
  hint?: string
  title: string
}): ReactNode =>
  h(
    'section',
    { className: 'setup-section', 'aria-labelledby': `setup-${title.toLowerCase().replaceAll(' ', '-')}` },
    h(
      'div',
      { className: 'setup-section__header' },
      h('h2', { className: 'setup-section__title', id: `setup-${title.toLowerCase().replaceAll(' ', '-')}` }, title),
      hint ? h('span', { className: 'setup-section__hint' }, hint) : null,
    ),
    children,
  )

const ParticipantBadge = ({ kind }: { kind: SetupParticipantKind }): ReactNode =>
  h(
    'span',
    {
      className:
        kind === 'human'
          ? 'participant-badge participant-badge--human'
          : 'participant-badge participant-badge--cpu',
    },
    h('span', { className: 'participant-badge__dot', 'aria-hidden': 'true' }),
    h('span', null, kind === 'human' ? 'Human' : 'CPU'),
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
}): ReactNode =>
  h(
    'div',
    { className: 'player-row' },
    h(ParticipantBadge, { kind: player.kind }),
    h('input', {
      className: 'player-row__input',
      'aria-label': `${player.kind === 'human' ? 'Human' : 'CPU'} player name`,
      value: player.name,
      onChange: (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
          onNameChange(player.id, event.target.value)
        }
      },
    }),
    h(
      'button',
      {
        className: 'player-row__remove',
        type: 'button',
        disabled: !canRemove,
        onClick: () => onRemove(player.id),
        'aria-label': `Remove ${player.name}`,
      },
      h(XIcon),
    ),
  )

const AddPlayerButton = ({
  kind,
  onClick,
  disabled,
}: {
  kind: SetupParticipantKind
  onClick: () => void
  disabled: boolean
}): ReactNode =>
  h(
    'button',
    {
      className: kind === 'human' ? 'add-player add-player--human' : 'add-player',
      type: 'button',
      onClick,
      disabled,
    },
    kind === 'human' ? '+ Add Human' : '+ Add CPU',
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
}): ReactNode =>
  h(
    'button',
    {
      className: selected ? 'option-card option-card--selected' : 'option-card',
      type: 'button',
      onClick,
      'aria-pressed': selected,
    },
    h(
      'span',
      { className: 'option-card__heading' },
      h(
        'span',
        { className: 'option-card__radio', 'aria-hidden': 'true' },
        selected ? h('span', { className: 'option-card__radio-dot' }) : null,
      ),
      h('span', null, label),
    ),
    h('span', { className: 'option-card__description' }, description),
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
}): ReactNode =>
  h(
    'button',
    {
      className: 'toggle-row',
      type: 'button',
      onClick,
      'aria-pressed': on,
    },
    h(
      'span',
      { className: 'toggle-row__copy' },
      h('span', { className: 'toggle-row__label' }, label),
      h('span', { className: 'toggle-row__description' }, description),
    ),
    h(
      'span',
      { className: on ? 'toggle-switch toggle-switch--on' : 'toggle-switch', 'aria-hidden': 'true' },
      h('span', { className: 'toggle-switch__knob' }),
    ),
  )

const NewGameSetup = ({
  onBack,
  setup,
  setSetup,
}: {
  onBack: () => void
  setup: SetupState
  setSetup: (next: SetupState | ((previous: SetupState) => SetupState)) => void
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

  return h(
    'main',
    {
      className: 'app-root setup-screen',
      'data-app': 'fe-draftsim',
      'aria-label': 'New game setup',
    },
    h(ScreenHeader, {
      eyebrow: 'Configure the draft',
      title: 'New Game',
      onBack,
    }),
    h(
      'div',
      { className: 'setup-screen__body' },
      h(
        SetupSection,
        { title: 'Players', hint: '2–6' },
        h(
          'div',
          { className: 'player-list' },
          ...setup.players.map((player) =>
            h(PlayerRow, {
              key: player.id,
              canRemove,
              onNameChange: changeParticipantName,
              onRemove: removeParticipant,
              player,
            }),
          ),
        ),
        h(
          'div',
          { className: 'add-player-group' },
          h(AddPlayerButton, {
            disabled: !canAdd,
            kind: 'human',
            onClick: () => addParticipant('human'),
          }),
          h(AddPlayerButton, {
            disabled: !canAdd,
            kind: 'cpu',
            onClick: () => addParticipant('cpu'),
          }),
        ),
      ),
      h(
        SetupSection,
        { title: 'Scoring Variant', hint: 'how points are won' },
        h(
          'div',
          { className: 'option-grid' },
          h(OptionCard, {
            description: 'Score points by your placement in each phase.',
            label: 'Versus',
            onClick: () => setSetup({ ...setup, scoring: 'versus' }),
            selected: setup.scoring === 'versus',
          }),
          h(OptionCard, {
            description: 'Beat fixed power thresholds each phase for points.',
            label: 'Solo',
            onClick: () => setSetup({ ...setup, scoring: 'solo' }),
            selected: setup.scoring === 'solo',
          }),
        ),
      ),
      h(
        SetupSection,
        { title: 'Modifiers' },
        h(ToggleRow, {
          description: 'Reveal totals only at pick 5 and end',
          label: 'Hidden picks',
          on: setup.hiddenPicks,
          onClick: () => setSetup({ ...setup, hiddenPicks: !setup.hiddenPicks }),
        }),
        h(ToggleRow, {
          description: 'Coverage, weapon triangle, and triangle attack',
          label: 'Bonus rules',
          on: setup.modifiersEnabled,
          onClick: () => setSetup({ ...setup, modifiersEnabled: !setup.modifiersEnabled }),
        }),
      ),
    ),
    h(
      'footer',
      { className: 'setup-screen__footer' },
      h(
        'button',
        { className: 'primary-cta', type: 'button' },
        h('span', null, 'Begin Draft'),
        h(Chevron, { light: true }),
      ),
    ),
  )
}

export const App = (): ReactNode => {
  const [screen, setScreen] = useState<AppScreen>('menu')
  const [setup, setSetup] = useState<SetupState>(DEFAULT_SETUP_STATE)

  if (screen === 'setup') {
    return h(NewGameSetup, {
      onBack: () => setScreen('menu'),
      setup,
      setSetup,
    })
  }

  return h(MainMenu, { onNewGame: () => setScreen('setup') })
}
