/* Draft Phase — power-curve standings overview + pack-of-cards picking. */

// Mid-draft snapshot (each player has 6 of 10 picks). Powers tuned so the
// human ("You") sits 2nd on current points.
const DRAFT_PLAYERS = [
  { id:'you',   name:'You',   you:true, picks:6, power:[13,12,11, 8, 6] },
  { id:'aria',  name:'Aria',            picks:6, power:[10,11,12,13,12] },
  { id:'bram',  name:'Bram',            picks:6, power:[ 9, 8, 7, 9,10] },
  { id:'corin', name:'Corin',           picks:6, power:[ 5, 6, 9, 8, 7] },
  { id:'dell',  name:'Dell',            picks:6, power:[12,10, 7, 5, 4] },
  { id:'esca',  name:'Esca',  cpu:true, picks:6, power:[ 4, 5, 8, 9,13] },
];
const PACK = ['est','linde','jeorge','roger','maria','caesar','wolf','navarre'];

const leaderByPhase = (players) => PHASES.map((_, ph) =>
  players.reduce((best, pl, i) => (pl.power[ph] > players[best].power[ph] ? i : best), 0));

const ordinal = (n) => ['1st', '2nd', '3rd', '4th', '5th', '6th'][n - 1] || `${n}th`;

// Standardized, visually-distinct bar heights for power values 0–4.
const BAR_H = [3, 13, 22, 31, 40];

// One pack card.
function PackCard({ id }) {
  const c = byId(id);
  return (
    <div style={{ background: 'var(--paper-2)', border: '1.5px solid var(--line-strong)',
      boxShadow: '0 1px 2px rgba(43,37,29,.06)', borderRadius: 10, padding: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 9 }}>
        <Portrait name={c.name} size={36} round={7} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{c.name}</span>
            <WeaponGlyph wpn={c.wpn} size={15} color="var(--bronze)" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 3 }}>{c.cls}</div>
        </div>
      </div>
      {/* standardized phase bars — only the max (4) is highlighted */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 42, padding: '0 2px' }}>
        {c.p.map((v, ph) => (
          <div key={ph} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, marginBottom: 2,
              color: v === 4 ? 'var(--bronze-deep)' : v ? 'var(--ink-soft)' : 'var(--ink-faint)' }}>{v}</span>
            <div style={{ width: '100%', height: BAR_H[v], borderRadius: 1.5,
              background: v === 4 ? 'var(--bronze)' : v ? 'var(--line-strong)' : 'var(--line)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 3, marginBottom: 9 }}>
        {PHASES.map((ph) => <span key={ph.key} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--ink-faint)' }}>{ph.short}</span>)}
      </div>
      <button style={{ width: '100%', border: '1.5px solid var(--crimson)', borderRadius: 7, padding: '7px', cursor: 'pointer',
        background: 'transparent', color: 'var(--crimson)', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700 }}>Take</button>
    </div>
  );
}

function DraftScreen() {
  const standings = computeStandings(DRAFT_PLAYERS);
  const ranked = [...standings].sort((a, b) => b.total - a.total);
  const youRank = ranked.findIndex((p) => p.you) + 1;

  return (
    <PhoneFrame theme={{ background: 'var(--paper)' }}>
      {/* status overview — the power curve */}
      <div style={{ flexShrink: 0, margin: '8px 16px 0', padding: '12px 12px 10px', background: 'var(--paper-2)', border: '1px solid var(--line-strong)', borderRadius: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 0.8, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>You're</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--crimson)' }}>{ordinal(youRank)}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-faint)' }}>of {ranked.length}</span>
          </div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 14, cursor: 'pointer',
            border: '1px solid var(--line-strong)', background: 'var(--paper)', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>
            Details
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 3l5 5-5 5"/></svg>
          </button>
        </div>
        <PhaseLineChart players={standings} width={322} height={128} />
        <div style={{ marginTop: 9, paddingTop: 9, borderTop: '1px solid var(--line)' }}>
          <ChartLegend players={standings} columns={3} showPoints />
        </div>
      </div>

      {/* the pack */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9, padding: '0 2px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Pick 7 <span style={{ color: 'var(--ink-faint)', fontWeight: 600 }}>of 10</span></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.5, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>8 in pack · take one</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {PACK.map((id) => <PackCard key={id} id={id} />)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(transparent, var(--paper))', pointerEvents: 'none' }} />
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { DraftScreen, PackCard });
