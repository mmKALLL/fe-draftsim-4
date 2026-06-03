import type { ReactNode } from 'react'
import { GameLogo } from '../components/GameLogo'
import { Chevron } from '../components/icons'

interface MenuItem {
  title: string
  subtitle: string
  primary?: boolean
  onClick?: () => void
}

const MenuButton = ({ item }: { item: MenuItem }): ReactNode => (
  <button className={item.primary ? 'menu-button menu-button--primary' : 'menu-button'} type="button" onClick={item.onClick}>
    <span className="menu-button__copy">
      <span className="menu-button__title">{item.title}</span>
      <span className="menu-button__subtitle">{item.subtitle}</span>
    </span>
    <Chevron light={item.primary ?? false} />
  </button>
)

export const MainMenu = ({ onNewGame }: { onNewGame: () => void }): ReactNode => {
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

  return (
    <main className="app-root menu-screen" data-app="fe-draftsim" aria-label="Emblem Draft">
      <div className="ledger-lines" aria-hidden="true" />
      <section className="main-menu" aria-labelledby="main-menu-title">
        <GameLogo />
        <nav className="main-menu__actions" aria-label="Main menu">
          {menuItems.map((item) => (
            <MenuButton key={item.title} item={item} />
          ))}
        </nav>
        <footer className="main-menu__footer">
          <span className="main-menu__version">v0.4 · local play</span>
          <span className="main-menu__links">
            <button className="text-link" type="button">
              Settings
            </button>
            <button className="text-link" type="button">
              About
            </button>
          </span>
        </footer>
      </section>
    </main>
  )
}
