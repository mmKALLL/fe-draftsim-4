import type { ReactNode } from 'react'

export const GameLogo = (): ReactNode => (
  <div className="game-logo">
    <h1 className="game-logo__title" id="main-menu-title">
      Emblem
      <br />
      <span>Draft</span>
    </h1>
    <p className="game-logo__subtitle">An FE11 Draft Simulator</p>
  </div>
)
