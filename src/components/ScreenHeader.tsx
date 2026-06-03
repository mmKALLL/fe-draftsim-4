import type { ReactNode } from 'react'
import { Chevron } from './icons'

export const ScreenHeader = ({
  backLabel,
  eyebrow,
  title,
  onBack,
}: {
  backLabel: string
  eyebrow: string
  title: string
  onBack: () => void
}): ReactNode => (
  <header className="screen-header">
    <button className="icon-button" type="button" onClick={onBack} aria-label={backLabel}>
      <Chevron direction="left" />
    </button>
    <div className="screen-header__copy">
      <h1 className="screen-header__title">{title}</h1>
      <p className="screen-header__eyebrow">{eyebrow}</p>
    </div>
  </header>
)
