/* Main Menu + Game Setup (mobile) */

function GameLogo({ size = 1 }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 * size, color: 'var(--bronze)' }}>
        <WeaponGlyph wpn="Sword" size={20 * size} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 * size, letterSpacing: 4 * size,
          color: 'var(--ink-faint)', textTransform: 'uppercase' }}>The</span>
        <WeaponGlyph wpn="Lance" size={20 * size} />
      </div>
      <h1 style={{ margin: `${6 * size}px 0 0`, fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 46 * size, lineHeight: 0.94, color: 'var(--ink)', letterSpacing: -1 }}>
        Emblem<br /><span style={{ color: 'var(--crimson)' }}>Draft</span>
      </h1>
      <div style={{ marginTop: 8 * size, fontFamily: 'var(--font-mono)', fontSize: 10.5 * size,
        letterSpacing: 2 * size, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>
        An FE11 Draft Simulator
      </div>
    </div>
  );
}

function MainMenu() {
  const items = [
    { label: 'New Game', sub: '2–6 players · local', primary: true },
    { label: 'Continue', sub: 'Round 7 · 4 players' },
    { label: 'How to Play', sub: 'Rules & scoring' },
    { label: 'Roster', sub: '60 characters' },
  ];
  return (
    <PhoneFrame theme={{ background: 'var(--paper)' }}>
      {/* faint ledger rule lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(var(--paper) 0 35px, var(--line) 35px 36px)',
        opacity: 0.4, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '0 26px' }}>
        <div style={{ flex: '0 0 auto', paddingTop: 64, paddingBottom: 40 }}>
          <GameLogo />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it) => (
            <button key={it.label} style={{ textAlign: 'left', cursor: 'pointer', border: it.primary ? 'none' : '1px solid var(--line-strong)',
              background: it.primary ? 'var(--crimson)' : 'var(--paper-2)', borderRadius: 8, padding: '15px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              boxShadow: it.primary ? '0 6px 18px rgba(157,59,44,.28)' : 'none' }}>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
                  whiteSpace: 'nowrap', color: it.primary ? 'var(--paper)' : 'var(--ink)' }}>{it.label}</span>
                <span style={{ display: 'block', marginTop: 1, fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: 0.5, textTransform: 'uppercase', color: it.primary ? 'rgba(244,239,227,.7)' : 'var(--ink-faint)' }}>{it.sub}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={it.primary ? 'var(--paper)' : 'var(--ink-faint)'} strokeWidth="1.8" strokeLinecap="round"><path d="M5 3l5 5-5 5"/></svg>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: 0.5 }}>v0.4 · local play</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {['Settings', 'About'].map((t) => (
              <span key={t} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-soft)', borderBottom: '1px solid var(--line-strong)', paddingBottom: 1 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ---- Game Setup ----
function SetupSection({ title, children, hint }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--ink-faint)' }}>{title}</h3>
        {hint && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-faint)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function OptionCard({ label, desc, selected, recommended }) {
  return (
    <div style={{ flex: 1, border: `1.5px solid ${selected ? 'var(--crimson)' : 'var(--line-strong)'}`,
      background: selected ? 'rgba(157,59,44,.06)' : 'var(--paper-2)', borderRadius: 8, padding: '12px 13px',
      position: 'relative' }}>
      {recommended && <div style={{ position: 'absolute', top: -8, right: 10 }}><Tag tone="bronze">Rec</Tag></div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, border: `1.5px solid ${selected ? 'var(--crimson)' : 'var(--line-strong)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {selected && <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--crimson)' }} />}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
      </div>
      <p style={{ margin: '7px 0 0', fontSize: 11.5, lineHeight: 1.4, color: 'var(--ink-soft)' }}>{desc}</p>
    </div>
  );
}

function GameSetup() {
  return (
    <PhoneFrame theme={{ background: 'var(--paper)' }}>
      {/* header */}
      <div style={{ flexShrink: 0, padding: '6px 22px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--line-strong)', background: 'var(--paper-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--ink-soft)" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>New Game</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.5, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Configure the draft</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 22px 0' }}>
        <SetupSection title="Players" hint="2–6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[{ name: 'Player 1', cpu: false }, { name: 'Player 2', cpu: false }, { name: 'Player 3', cpu: true }, { name: 'Player 4', cpu: true }].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', background: 'var(--paper-2)', border: '1px solid var(--line-strong)', borderRadius: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, flexShrink: 0,
                  background: p.cpu ? 'var(--paper-3)' : 'rgba(95,122,85,.14)', border: `1px solid ${p.cpu ? 'var(--line-strong)' : 'rgba(95,122,85,.4)'}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: p.cpu ? 'var(--ink-faint)' : 'var(--sage)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 0.4, textTransform: 'uppercase', color: p.cpu ? 'var(--ink-soft)' : 'var(--sage)', fontWeight: 700 }}>{p.cpu ? 'CPU' : 'Human'}</span>
                </span>
                <input defaultValue={p.name} style={{ flex: 1, minWidth: 0, border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: 6, padding: '7px 9px', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', outline: 'none' }} />
                <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line-strong)', background: 'var(--paper)', cursor: 'pointer', color: 'var(--ink-faint)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
            {[['+ Add Human', false], ['+ Add CPU', true]].map(([label, cpu]) => (
              <button key={label} style={{ flex: 1, padding: '10px', borderRadius: 7, cursor: 'pointer',
                border: `1px dashed ${cpu ? 'var(--line-strong)' : 'rgba(95,122,85,.5)'}`, background: 'transparent',
                fontFamily: 'var(--font-ui)', fontSize: 12.5, fontWeight: 600, color: cpu ? 'var(--ink-soft)' : 'var(--sage)' }}>{label}</button>
            ))}
          </div>
        </SetupSection>

        <SetupSection title="Scoring Variant" hint="how points are won">
          <div style={{ display: 'flex', gap: 10 }}>
            <OptionCard label="Versus" desc="Score points by your placement in each phase." selected />
            <OptionCard label="Solo" desc="Beat fixed power thresholds each phase for points." />
          </div>
        </SetupSection>

        <SetupSection title="Modifiers">
          {[['Hidden picks', 'Reveal totals only at pick 5 & end', false],
            ['Bonus & penalty rules', 'Coverage groups & weapon triangle', true]].map(([l, d, on]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{l}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 1 }}>{d}</div>
              </div>
              <span style={{ width: 40, height: 23, borderRadius: 12, background: on ? 'var(--sage)' : 'var(--line-strong)', position: 'relative', flexShrink: 0 }}>
                <span style={{ position: 'absolute', top: 2.5, left: on ? 20 : 2.5, width: 18, height: 18, borderRadius: 9, background: 'var(--paper)', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
              </span>
            </div>
          ))}
        </SetupSection>
      </div>

      {/* sticky CTA */}
      <div style={{ flexShrink: 0, padding: '12px 22px 16px', borderTop: '1px solid var(--line)', background: 'var(--paper)' }}>
        <button style={{ width: '100%', border: 'none', background: 'var(--crimson)', color: 'var(--paper)', borderRadius: 8,
          padding: '15px', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(157,59,44,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ whiteSpace: 'nowrap' }}>Begin Draft</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--paper)" strokeWidth="1.8" strokeLinecap="round"><path d="M5 3l5 5-5 5"/></svg>
        </button>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { MainMenu, GameSetup, GameLogo });
