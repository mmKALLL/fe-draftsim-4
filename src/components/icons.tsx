import type { ReactNode } from 'react'
import type { WeaponType } from '../types'

export type WeaponGlyphName = Exclude<WeaponType, 'none'>

export const WeaponGlyph = ({ weapon, size = 20 }: { weapon: WeaponGlyphName; size?: number }): ReactNode => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const pathByWeapon: Record<WeaponGlyphName, readonly string[]> = {
    sword: ['M12 2.5l1.4 3v8h-2.8v-8z', 'M8.5 13h7', 'M12 13v5', 'M10.4 18h3.2'],
    lance: ['M12 2.5l2.2 4-2.2 2.4-2.2-2.4z', 'M12 8.9V21.5'],
    axe: ['M8.5 4.5h5.8c2.2 0 3.5 1.3 3.5 3.3 0 2.5-2.3 4.3-5.4 4.3h-2.2', 'M10.3 3v18', 'M7.4 18.7h5.8'],
    bow: ['M9 3.5c4 2.7 4 14.3 0 17', 'M9 3.5c7 3 7 14 0 17', 'M9.5 4.5v15', 'M6.5 12h9'],
    tome: ['M5 5.2c2.2-1.1 4.5-1.1 7 0v14c-2.5-1.1-4.8-1.1-7 0z', 'M12 5.2c2.5-1.1 4.8-1.1 7 0v14c-2.2-1.1-4.5-1.1-7 0z', 'M12 5.2v14'],
    staff: ['M12 3v18', 'M8.5 6.5h7', 'M12 3.5l2.2 2.2L12 7.9 9.8 5.7z', 'M9.3 18.5h5.4'],
    dragonstone: ['M12 2.8l7.2 7.2L12 21.2 4.8 10z', 'M12 2.8V21', 'M4.8 10h14.4'],
    ballista: ['M4 16h16', 'M6.5 16l3-8h9', 'M13 8l5 8', 'M6.5 19.5h2.5', 'M15 19.5h2.5', 'M9.5 8l-3.5-3'],
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="weapon-glyph">
      {pathByWeapon[weapon].map((path) => (
        <path {...common} d={path} key={path} />
      ))}
    </svg>
  )
}

export const Chevron = ({
  direction = 'right',
  light = false,
}: {
  direction?: 'left' | 'right'
  light?: boolean
}): ReactNode => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke={light ? 'var(--paper)' : 'currentColor'}
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
    className="chevron-icon"
  >
    <path d={direction === 'left' ? 'M10 3L5 8l5 5' : 'M5 3l5 5-5 5'} />
  </svg>
)

export const XIcon = (): ReactNode => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M3 3l6 6M9 3l-6 6" />
  </svg>
)
