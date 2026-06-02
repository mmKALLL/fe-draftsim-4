/* Score Visualization (with / without modifiers) + Game End (mobile) */

// Per-phase points breakdown chips (5/3/2/1/0).
function PtChip({ v }) {
  const on = v > 0;
  return (
    <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
      color: v >= 5 ? 'var(--crimson)' : v >= 2 ? 'var(--bronze-deep)' : 'var(--ink-faint)', opacity: on ? 1 : 0.4 }}>{v}</span>
  );
}

// Segmented 3-way view toggle.
function ViewToggle({ value }) {
  const opts = [['scores', 'Scores'], ['power', 'Team Power'], ['rosters', 'Rosters']];
  return (
    <div style={{ display: 'flex', background: 'var(--paper-3)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: 3 }}>
      {opts.map(([v, label]) => (
        <span key={v} style={{ flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
          background: v === value ? 'var(--paper)' : 'transparent', color: v === value ? 'var(--ink)' : 'var(--ink-faint)',
          boxShadow: v === value ? '0 1px 2px rgba(43,37,29,.1)' : 'none' }}>{label}</span>
      ))}
    </div>
  );
}

function ScoreScreen({ view = 'scores' }) {
  const ranked = RANKED;
  const leaders = leaderByPhase(PLAYERS);
  return (
    <PhoneFrame theme={{ background: 'var(--paper)' }}>
      {/* header + back */}
      <div style={{ flexShrink: 0, padding: '2px 18px 12px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Round 10 / 10 · Final picks in</div>
            <h2 style={{ margin: '2px 0 0', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>Standings</h2>
          </div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 16, cursor: 'pointer',
            border: '1px solid var(--line-strong)', background: 'var(--paper-2)', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 2 }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
            Back
          </button>
        </div>
        <div style={{ marginTop: 12 }}><ViewToggle value={view} /></div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'scores' && <ScoresView ranked={ranked} />}
        {view === 'power' && <PowerView leaders={leaders} />}
        {view === 'rosters' && <RostersView />}
      </div>
    </PhoneFrame>
  );
}

// ---- Scores view: chart + coverage modifiers + leaderboard w/ bonus col ----
function ScoresView({ ranked }) {
  const mods = computeTeamModifiers(YOUR_TEAM);
  const netColor = mods.net > 0 ? 'var(--sage)' : mods.net < 0 ? 'var(--crimson)' : 'var(--ink-faint)';
  return (
    <React.Fragment>
      <div style={{ flexShrink: 0, padding: '12px 18px 6px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.5, color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 8 }}>Power across phases</div>
        <PhaseLineChart players={PLAYERS} width={336} height={132} />
        <div style={{ marginTop: 9 }}><ChartLegend players={PLAYERS} columns={3} showPoints /></div>
      </div>

      {/* coverage modifiers */}
      <div style={{ flexShrink: 0, margin: '4px 18px 0', padding: '10px 12px', background: 'var(--paper-2)', border: '1px solid var(--line-strong)', borderRadius: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 1.2, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Your coverage</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: netColor }}>{mods.net > 0 ? `+${mods.net}` : mods.net} / phase</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {mods.coverage.map((g) => (
            <div key={g.id} style={{ flex: 1, textAlign: 'center', padding: '6px 2px', borderRadius: 6,
              background: g.met ? 'rgba(95,122,85,.12)' : 'rgba(157,59,44,.1)',
              border: `1px solid ${g.met ? 'rgba(95,122,85,.35)' : 'rgba(157,59,44,.3)'}` }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 0.3, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>{g.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3, lineHeight: 1, color: g.met ? 'var(--sage)' : 'var(--crimson)' }}>
                {g.met ? '✓' : '✕'}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, color: 'var(--ink-soft)' }}>Weapon-triangle trios <b style={{ color: 'var(--ink)' }}>×{mods.trios}</b> <span style={{ color: 'var(--ink-faint)' }}>(S·A·L)</span></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: mods.trios ? 'var(--sage)' : 'var(--ink-faint)' }}>{mods.trios ? `+${mods.trios}` : '—'} all phases</span>
        </div>
      </div>

      {/* leaderboard with bonus column */}
      <div style={{ flex: 1, minHeight: 0, padding: '12px 18px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px 6px' }}>
          <span style={{ width: 84, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Player</span>
          <div style={{ flex: 1, display: 'flex' }}>
            {PHASES.map((ph) => <span key={ph.key} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--ink-faint)' }}>{ph.short}</span>)}
          </div>
          <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Bon</span>
          <span style={{ width: 30, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Pts</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {ranked.map((pl, rank) => (
            <div key={pl.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 8px', borderRadius: 8,
              background: pl.you ? 'rgba(157,59,44,.08)' : 'var(--paper-2)', border: `1px solid ${pl.you ? 'rgba(157,59,44,.3)' : 'var(--line)'}` }}>
              <div style={{ width: 84, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: rank === 0 ? 'var(--bronze-deep)' : 'var(--ink-faint)' }}>{rank + 1}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: pl.you ? 700 : 600, color: pl.you ? 'var(--crimson)' : 'var(--ink)' }}>{pl.name}</span>
              </div>
              <div style={{ flex: 1, display: 'flex' }}>
                {pl.phasePts.map((v, i) => <PtChip key={i} v={v} />)}
              </div>
              <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700,
                color: pl.bonus > 0 ? 'var(--sage)' : pl.bonus < 0 ? 'var(--crimson)' : 'var(--ink-faint)' }}>
                {pl.bonus > 0 ? `+${pl.bonus}` : pl.bonus < 0 ? pl.bonus : '—'}
              </span>
              <span style={{ width: 30, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: pl.you ? 'var(--crimson)' : 'var(--ink)' }}>{pl.total}</span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

// ---- Team Power view: per-phase power table for every player ----
function PowerView({ leaders }) {
  const ranked = [...PLAYERS].map((pl) => ({ ...pl, sum: pl.power.reduce((a, b) => a + b, 0) }));
  return (
    <div style={{ flex: 1, minHeight: 0, padding: '14px 18px 0' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.5, color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 10 }}>Team power by phase</div>
      <div style={{ border: '1px solid var(--line-strong)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', background: 'var(--paper-3)', borderBottom: '1px solid var(--line-strong)', padding: '8px 12px' }}>
          <span style={{ width: 66, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Player</span>
          {PHASES.map((ph) => <span key={ph.key} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-faint)' }}>{ph.short}</span>)}
          <span style={{ width: 34, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Σ</span>
        </div>
        {PLAYERS.map((pl, i) => (
          <div key={pl.id} style={{ display: 'flex', alignItems: 'center', padding: '11px 12px',
            borderBottom: i < PLAYERS.length - 1 ? '1px solid var(--line)' : 'none',
            background: pl.you ? 'rgba(157,59,44,.07)' : i % 2 ? 'rgba(0,0,0,.012)' : 'transparent' }}>
            <span style={{ width: 66, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: pl.cpu ? 'var(--ink-faint)' : 'var(--sage)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: pl.you ? 700 : 500, color: pl.you ? 'var(--crimson)' : 'var(--ink)' }}>{pl.name}</span>
            </span>
            {pl.power.map((v, ph) => (
              <span key={ph} style={{ flex: 1, textAlign: 'center', position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
                color: leaders[ph] === i ? 'var(--bronze-deep)' : 'var(--ink-soft)' }}>
                {v}
                {leaders[ph] === i && <span style={{ position: 'absolute', left: '50%', bottom: -4, transform: 'translateX(-50%)', width: 12, height: 2, borderRadius: 1, background: 'var(--bronze)' }} />}
              </span>
            ))}
            <span style={{ width: 34, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{pl.power.reduce((a, b) => a + b, 0)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '0 2px' }}>
        <span style={{ width: 10, height: 2, background: 'var(--bronze)', borderRadius: 1 }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10.5, color: 'var(--ink-faint)' }}>phase leader · scores 5 pts</span>
      </div>
    </div>
  );
}

// ---- Rosters view: player selector + the selected player's drafted team ----
function RostersView() {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 0 0' }}>
      {/* player tabs */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 7, padding: '0 18px 12px', overflow: 'hidden' }}>
        {PLAYERS.map((pl) => (
          <span key={pl.id} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 16, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
            background: pl.you ? 'var(--crimson)' : 'var(--paper-2)', color: pl.you ? 'var(--paper)' : 'var(--ink-soft)',
            border: `1px solid ${pl.you ? 'var(--crimson)' : 'var(--line-strong)'}` }}>{pl.name}</span>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 18px', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {YOUR_TEAM.map((id) => {
            const c = byId(id);
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 9px', background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 7 }}>
                <Portrait name={c.name} size={30} round={5} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{c.name}</span>
                    <WeaponGlyph wpn={c.wpn} size={12} color="var(--bronze)" />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.3 }}>{c.cls}</span>
                </div>
                <div style={{ width: 88 }}><PhaseStats p={c.p} variant="numbers" /></div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, background: 'linear-gradient(transparent, var(--paper))', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

// =====================================================================
// GAME END
// =====================================================================
function GameEnd() {
  const ranked = RANKED;
  const winner = ranked[0];
  const podium = [ranked[1], ranked[0], ranked[2]]; // 2-1-3 visual order
  const podiumH = [78, 116, 58];
  return (
    <PhoneFrame theme={{ background: 'var(--paper)' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '0 22px' }}>
        {/* title */}
        <div style={{ textAlign: 'center', paddingTop: 22, flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--bronze-deep)', textTransform: 'uppercase' }}>The draft is sealed</div>
          <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
            <span style={{ color: 'var(--crimson)' }}>{winner.name}</span> wins
          </h1>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-faint)', marginTop: 6 }}>
            {winner.total} points across five phases
          </div>
        </div>

        {/* podium */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginTop: 24, flexShrink: 0 }}>
          {podium.map((pl, i) => {
            const place = pl === ranked[0] ? 1 : pl === ranked[1] ? 2 : 3;
            return (
              <div key={pl.id} style={{ flex: 1, textAlign: 'center' }}>
                <Portrait name={pl.name} size={place === 1 ? 52 : 42} round={place === 1 ? 26 : 21} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: place === 1 ? 16 : 14, fontWeight: 700, color: 'var(--ink)', marginTop: 6 }}>{pl.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bronze-deep)' }}>{pl.total} pts</div>
                <div style={{ height: podiumH[i], marginTop: 8, borderRadius: '6px 6px 0 0',
                  background: place === 1 ? 'var(--bronze)' : 'var(--paper-3)',
                  border: '1px solid var(--line-strong)', borderBottom: 'none',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: place === 1 ? 'var(--paper)' : 'var(--ink-faint)' }}>{place}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* full results */}
        <div style={{ flex: 1, minHeight: 0, marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ranked.map((pl, rank) => (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', borderRadius: 7,
                background: pl.you ? 'rgba(157,59,44,.08)' : 'var(--paper-2)', border: `1px solid ${pl.you ? 'rgba(157,59,44,.25)' : 'var(--line)'}` }}>
                <span style={{ width: 18, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: rank === 0 ? 'var(--bronze-deep)' : 'var(--ink-faint)' }}>{rank + 1}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 14.5, fontWeight: pl.you ? 700 : 600,
                  color: pl.you ? 'var(--crimson)' : 'var(--ink)' }}>{pl.name}{pl.you && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)', marginLeft: 6 }}>YOU</span>}{pl.cpu && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--ink-faint)', border: '1px solid var(--line-strong)', borderRadius: 3, padding: '0 3px', marginLeft: 6 }}>CPU</span>}</span>
                {/* phase spark */}
                <span style={{ display: 'flex', gap: 3, marginRight: 12, alignItems: 'flex-end' }}>
                  {pl.phasePts.map((v, i) => (
                    <span key={i} style={{ width: 5, borderRadius: 1,
                      background: v > 0 ? 'var(--bronze)' : 'var(--line-strong)', height: 4 + v * 2 }} />
                  ))}
                </span>
                <span style={{ width: 26, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{pl.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        <div style={{ flexShrink: 0, display: 'flex', gap: 10, padding: '10px 0 16px' }}>
          <button style={{ flex: 1, border: '1px solid var(--line-strong)', background: 'var(--paper-2)', color: 'var(--ink)', borderRadius: 8, padding: '13px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>View teams</button>
          <button style={{ flex: 1, border: 'none', background: 'var(--crimson)', color: 'var(--paper)', borderRadius: 8, padding: '13px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 5px 14px rgba(157,59,44,.28)' }}>Rematch</button>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ScoreScreen, GameEnd });
