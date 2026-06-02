/* ============================================================
   Shared UI primitives for the FE11 Draft Sim mockups.
   Exports to window at the bottom.
   ============================================================ */

// ---- Weapon icons: compact line glyphs, one per weapon type ----
function WeaponGlyph({ wpn, size = 14, color = 'currentColor' }) {
  const s = size, st = { display: 'block' };
  const g = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const V = (children) => <svg width={s} height={s} viewBox="0 0 24 24" style={st}>{children}</svg>;
  switch (wpn) {
    case 'Sword': // blade up, crossguard, grip, pommel
      return V(<g {...g}><path d="M12 2.5l1.4 3v8H10.6V5.5z"/><path d="M8.5 13h7"/><path d="M12 13v5"/><path d="M10.4 18h3.2"/></g>);
    case 'Lance': // leaf head on a long shaft
      return V(<g {...g}><path d="M12 2.5l2.2 4-2.2 2.4-2.2-2.4z"/><path d="M12 8.9V21.5"/></g>);
    case 'Axe': // handle + crescent blade
      return V(<g {...g}><path d="M9 3v18.5"/><path d="M9 4.2c5-1 9 1.6 8.4 6.4C14 9.4 11.4 9.2 9 9.6z" fill={color} fillOpacity="0.18"/></g>);
    case 'Bow': // curved bow, string, arrow
      return V(<g {...g}><path d="M7.5 3C2 8 2 16 7.5 21"/><path d="M7.5 3v18"/><path d="M5 12h14"/><path d="M16 9.3l3 2.7-3 2.7"/></g>);
    case 'Tome': // open book
      return V(<g {...g}><path d="M12 6.5C9.6 4.8 6 4.8 3.5 6v13C6 17.8 9.6 17.8 12 19.4"/><path d="M12 6.5c2.4-1.7 6-1.7 8.5-.5v13c-2.5-1.2-6.1-1.2-8.5.4"/><path d="M12 6.5v12.9"/></g>);
    case 'Staff': // ring on a rod
      return V(<g {...g}><circle cx="12" cy="6" r="3.1"/><path d="M12 9.1V21.5"/></g>);
    case 'Stone': // faceted dragonstone
      return V(<g {...g}><path d="M12 3l6 5-2.6 13H8.6L6 8z"/><path d="M6 8h12"/><path d="M12 3v18"/></g>);
    default:
      return V(<g/>);
  }
}

// A small weapon chip (glyph + label).
function WeaponChip({ wpn, mono }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--ink-soft)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase' }}>
      <WeaponGlyph wpn={wpn} size={13} />{wpn}
    </span>
  );
}

// ---- Phase-power readout: five values, with a max-4 tick scale ----
// variant: 'numbers' (mono digits) | 'bars' (vertical fill) | 'mini'
function PhaseStats({ p, variant = 'numbers', accent = 'var(--bronze)' }) {
  if (variant === 'bars') {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 30 }}>
        {p.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ height: `${(v / 4) * 100}%`, minHeight: 2, background: v ? accent : 'var(--line)',
              borderRadius: 1, opacity: v ? 1 : 0.5 }} />
          </div>
        ))}
      </div>
    );
  }
  if (variant === 'mini') {
    return (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 0.5, color: 'var(--ink-soft)' }}>
        {p.join('/')}
      </span>
    );
  }
  // numbers
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {p.map((v, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13,
          fontWeight: 700, color: v === 0 ? 'var(--ink-faint)' : v >= 3 ? 'var(--crimson)' : 'var(--ink)',
          opacity: v === 0 ? 0.5 : 1 }}>{v}</div>
      ))}
    </div>
  );
}

// Header row of phase short-labels, aligned with PhaseStats columns.
function PhaseHeader({ small }) {
  return (
    <div style={{ display: 'flex' }}>
      {PHASES.map((ph) => (
        <div key={ph.key} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)',
          fontSize: small ? 8 : 9, letterSpacing: 0.5, color: 'var(--ink-faint)' }}>{ph.short}</div>
      ))}
    </div>
  );
}

// ---- Portrait placeholder (no copyrighted art) ----
function Portrait({ name, size = 44, round = 6 }) {
  const initials = name.slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: round, flexShrink: 0, position: 'relative',
      background: 'repeating-linear-gradient(135deg, var(--paper-3) 0 6px, var(--paper-2) 6px 12px)',
      border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.34,
        color: 'var(--ink-faint)' }}>{initials}</span>
    </div>
  );
}

// ---- The phase line-chart: each player a line across the 5 phases ----
function PhaseLineChart({ players, width = 326, height = 168, highlightId, showAxis = true }) {
  const padL = 28, padR = 10, padT = 12, padB = 22;
  const innerW = width - padL - padR, innerH = height - padT - padB;
  const allMax = Math.max(...players.flatMap((p) => p.power));
  const maxY = Math.ceil(allMax / 4) * 4;
  const x = (i) => padL + (innerW * i) / (PHASES.length - 1);
  const y = (v) => padT + innerH - (innerH * v) / maxY;
  const colors = ['var(--crimson)', 'var(--bronze)', 'var(--sage)', '#6a86a8', '#8a6aa0', '#b08a3e'];

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {/* gridlines */}
      {[0, maxY / 2, maxY].map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={width - padR} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
          {showAxis && <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-faint)">{v}</text>}
        </g>
      ))}
      {/* phase labels */}
      {PHASES.map((ph, i) => (
        <text key={ph.key} x={x(i)} y={height - 6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--ink-faint)" letterSpacing="0.3">{ph.short}</text>
      ))}
      {/* lines */}
      {players.map((pl, idx) => {
        const dim = highlightId && pl.id !== highlightId;
        const c = pl.you ? 'var(--crimson)' : colors[idx % colors.length];
        const d = pl.power.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
        return (
          <g key={pl.id} opacity={dim ? 0.28 : 1}>
            <path d={d} fill="none" stroke={c} strokeWidth={pl.you ? 2.6 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
            {pl.power.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={pl.you ? 3 : 2.2} fill="var(--paper)" stroke={c} strokeWidth={pl.you ? 2.2 : 1.6} />
            ))}
            {/* the human player's points carry their power value */}
            {pl.you && pl.power.map((v, i) => (
              <text key={`l${i}`} x={x(i)} y={y(v) - 7} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="700" fill="var(--crimson)">{v}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// Legend swatches matching the chart colors. With showPoints, each player's
// total points appear after their name and the list is ranked high→low.
function ChartLegend({ players, columns = 3, showPoints = false }) {
  const colors = ['var(--crimson)', 'var(--bronze)', 'var(--sage)', '#6a86a8', '#8a6aa0', '#b08a3e'];
  const colorOf = (pl) => (pl.you ? 'var(--crimson)' : colors[players.indexOf(pl) % colors.length]);
  const list = showPoints ? [...players].sort((a, b) => (b.total || 0) - (a.total || 0)) : players;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '5px 10px' }}>
      {list.map((pl) => (
        <div key={pl.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-soft)' }}>
          <span style={{ width: 14, height: 3, borderRadius: 2, background: colorOf(pl), flexShrink: 0 }} />
          <span style={{ fontWeight: pl.you ? 700 : 500, color: pl.you ? 'var(--crimson)' : 'var(--ink)' }}>{pl.name}</span>
          {showPoints && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-faint)' }}>({pl.total})</span>}
        </div>
      ))}
    </div>
  );
}

// ---- Phone frame (390×844 screen) ----
function PhoneFrame({ children, statusDark = false, theme }) {
  const fg = statusDark ? 'var(--paper)' : 'var(--ink)';
  return (
    <div style={{ width: 390, height: 844, position: 'relative', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: 'var(--font-ui)', ...theme }}>
      {/* status bar */}
      <div style={{ height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', position: 'relative', zIndex: 5, color: fg }}>
        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-ui)', letterSpacing: -0.2 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill={fg}><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke={fg} opacity="0.5"/><rect x="2" y="2" width="14" height="7" rx="1.2" fill={fg}/><rect x="20" y="3.5" width="1.6" height="4" rx="0.8" fill={fg} opacity="0.5"/></svg>
        </div>
      </div>
      {/* content */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{ height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 5 }}>
        <div style={{ width: 134, height: 5, borderRadius: 3, background: fg, opacity: 0.35 }} />
      </div>
    </div>
  );
}

// Small reusable pill / tag.
function Tag({ children, tone = 'default', style }) {
  const tones = {
    default: { bg: 'var(--paper-3)', fg: 'var(--ink-soft)', bd: 'var(--line)' },
    bronze:  { bg: 'rgba(154,120,72,.14)', fg: 'var(--bronze-deep)', bd: 'rgba(154,120,72,.4)' },
    crimson: { bg: 'rgba(157,59,44,.12)', fg: 'var(--crimson)', bd: 'rgba(157,59,44,.35)' },
    sage:    { bg: 'rgba(95,122,85,.16)', fg: 'var(--sage)', bd: 'rgba(95,122,85,.4)' },
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`, fontFamily: 'var(--font-mono)', fontSize: 9.5,
      letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700, ...style }}>{children}</span>
  );
}

Object.assign(window, {
  WeaponGlyph, WeaponChip, PhaseStats, PhaseHeader, Portrait,
  PhaseLineChart, ChartLegend, PhoneFrame, Tag,
});
