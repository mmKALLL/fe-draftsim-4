import type { ReactNode } from 'react'
import type { ResultsPlayer } from '../results-utils'

export const formatBonus = (value: number): string => (value > 0 ? `+${value}` : '-')

export const CoveragePanel = ({ player }: { player: ResultsPlayer }): ReactNode => (
  <section className="coverage-panel" aria-label={`${player.name} coverage bonuses`}>
    <div className="coverage-panel__header">
      <span>{player.you ? 'Your Coverage' : `${player.name} Coverage`}</span>
      <strong>{formatBonus(player.bonus.coverage.total)} pts</strong>
    </div>
    <div className="coverage-panel__groups">
      {player.bonus.coverage.groups.map((group) => (
        <span className={group.covered ? 'coverage-tile coverage-tile--met' : 'coverage-tile'} key={group.group.id}>
          <span className="coverage-tile__label">{group.group.label}</span>
          <span className="coverage-tile__mark">{group.covered ? '+' : 'x'}</span>
        </span>
      ))}
    </div>
    <div className="coverage-panel__footer">
      <span>
        Weapon-triangle trios <strong>x{player.bonus.weaponTriangleTrios}</strong> <span>(S/L/A)</span>
      </span>
      <strong>{player.bonus.weaponTriangleBonus > 0 ? `+${player.bonus.weaponTriangleBonus}` : '-'}</strong>
    </div>
    <div className="coverage-panel__footer">
      <span>Triangle attack</span>
      <strong>{player.bonus.pegasusSistersBonus > 0 ? `+${player.bonus.pegasusSistersBonus}` : '-'}</strong>
    </div>
  </section>
)
