/* ============================================================
   FE11 DRAFT SIMULATOR — demo data
   Plain JS, attaches everything to window for the JSX screens.
   Character STATS are factual references (5 phase-power values,
   0–4 each). Portraits are intentionally placeholders.
   ============================================================ */

// The five simulated phases of the run.
const PHASES = [
  { key: 'early',   short: 'EARLY',  label: 'Earlygame',     chapters: 'Ch. 1–5' },
  { key: 'earlymid',short: 'E-MID',  label: 'Early Midgame', chapters: 'Ch. 6–9' },
  { key: 'mid',     short: 'MID',    label: 'Midgame',       chapters: 'Ch. 10–13' },
  { key: 'earlylate',short:'M-LATE', label: 'Mid-Lategame',  chapters: 'Ch. 14–17' },
  { key: 'late',    short: 'LATE',   label: 'Lategame',      chapters: 'Ch. 18–20' },
];

// Points awarded per phase by team-power rank (1st → 6th).
const SCORE_SPREAD = [5, 3, 2, 1, 0, 0];

// Weapon types → triangle relationship. Sword > Axe > Lance > Sword.
const WEAPONS = {
  Sword: { beats: 'Axe' },
  Axe:   { beats: 'Lance' },
  Lance: { beats: 'Sword' },
  Bow:   { beats: null },
  Tome:  { beats: null },
  Staff: { beats: null },
  Stone: { beats: null },
};

// Character pool. p = [early, earlymid, mid, earlylate, late], each 0–4.
// role tags drive the bonus/penalty engine (healer / defensive / flier…).
const POOL = [
  { id:'marth',   name:'Marth',   cls:'Lord',        wpn:'Sword', p:[2,3,3,3,3], tags:['lord'] },
  { id:'jagen',   name:'Jagen',   cls:'Paladin',     wpn:'Lance', p:[4,2,1,0,0], tags:['mounted','defensive'] },
  { id:'frey',    name:'Frey',    cls:'Cavalier',    wpn:'Lance', p:[1,1,2,2,2], tags:['mounted','defensive'] },
  { id:'caeda',   name:'Caeda',   cls:'Pegasus Kt.', wpn:'Lance', p:[3,3,2,1,1], tags:['flier'] },
  { id:'cain',    name:'Cain',    cls:'Cavalier',    wpn:'Lance', p:[2,3,3,2,2], tags:['mounted','defensive'] },
  { id:'abel',    name:'Abel',    cls:'Cavalier',    wpn:'Lance', p:[2,3,3,2,2], tags:['mounted','defensive'] },
  { id:'ogma',    name:'Ogma',    cls:'Mercenary',   wpn:'Sword', p:[3,3,2,1,1], tags:[] },
  { id:'barst',   name:'Barst',   cls:'Fighter',     wpn:'Axe',   p:[2,3,3,2,1], tags:[] },
  { id:'bord',    name:'Bord',    cls:'Fighter',     wpn:'Axe',   p:[1,2,2,1,1], tags:[] },
  { id:'cord',    name:'Cord',    cls:'Fighter',     wpn:'Axe',   p:[1,2,2,1,1], tags:[] },
  { id:'draug',   name:'Draug',   cls:'Knight',      wpn:'Lance', p:[2,2,1,1,1], tags:['defensive','armor'] },
  { id:'gordin',  name:'Gordin',  cls:'Archer',      wpn:'Bow',   p:[2,2,2,1,1], tags:[] },
  { id:'norne',   name:'Norne',   cls:'Archer',      wpn:'Bow',   p:[2,2,2,1,1], tags:[] },
  { id:'wrys',    name:'Wrys',    cls:'Curate',      wpn:'Staff', p:[3,1,1,0,0], tags:['healer'] },
  { id:'lena',    name:'Lena',    cls:'Cleric',      wpn:'Staff', p:[1,2,2,1,1], tags:['healer'] },
  { id:'navarre', name:'Navarre', cls:'Myrmidon',    wpn:'Sword', p:[1,2,3,3,3], tags:[] },
  { id:'merric',  name:'Merric',  cls:'Mage',        wpn:'Tome',  p:[1,2,3,3,2], tags:[] },
  { id:'matthis',  name:'Matthis', cls:'Cavalier',   wpn:'Lance', p:[1,1,1,1,1], tags:['mounted','defensive'] },
  { id:'castor',  name:'Castor',  cls:'Hunter',      wpn:'Bow',   p:[1,2,1,1,0], tags:[] },
  { id:'julian',  name:'Julian',  cls:'Thief',       wpn:'Sword', p:[2,2,1,1,1], tags:['utility'] },
  { id:'rickard', name:'Rickard', cls:'Thief',       wpn:'Sword', p:[0,1,1,1,1], tags:['utility'] },
  { id:'hardin',  name:'Hardin',  cls:'Cavalier',    wpn:'Lance', p:[1,3,3,3,2], tags:['mounted','defensive'] },
  { id:'wolf',    name:'Wolf',    cls:'Horseman',    wpn:'Bow',   p:[0,0,1,2,3], tags:['mounted'] },
  { id:'sedgar',  name:'Sedgar',  cls:'Horseman',    wpn:'Bow',   p:[0,0,1,2,3], tags:['mounted'] },
  { id:'roshea',  name:'Roshea',  cls:'Cavalier',    wpn:'Lance', p:[0,1,2,2,2], tags:['mounted','defensive'] },
  { id:'vyland',  name:'Vyland',  cls:'Cavalier',    wpn:'Lance', p:[0,1,2,2,2], tags:['mounted','defensive'] },
  { id:'wendell', name:'Wendell', cls:'Sage',        wpn:'Tome',  p:[1,3,2,2,1], tags:['healer'] },
  { id:'minerva', name:'Minerva', cls:'Wyvern Kt.',  wpn:'Axe',   p:[0,2,3,4,3], tags:['flier','defensive'] },
  { id:'linde',   name:'Linde',   cls:'Mage',        wpn:'Tome',  p:[0,2,3,3,3], tags:[] },
  { id:'jeorge',  name:'Jeorge',  cls:'Sniper',      wpn:'Bow',   p:[0,1,3,3,3], tags:[] },
  { id:'maria',   name:'Maria',   cls:'Cleric',      wpn:'Staff', p:[0,1,2,2,2], tags:['healer'] },
  { id:'caesar',  name:'Caesar',  cls:'Mercenary',   wpn:'Sword', p:[0,2,2,2,1], tags:[] },
  { id:'radd',    name:'Radd',    cls:'Myrmidon',    wpn:'Sword', p:[0,1,2,2,2], tags:[] },
  { id:'roger',   name:'Roger',   cls:'Knight',      wpn:'Lance', p:[0,1,2,2,2], tags:['defensive','armor'] },
  { id:'bantu',   name:'Bantu',   cls:'Manakete',    wpn:'Stone', p:[1,1,1,1,1], tags:['defensive'] },
  { id:'athena',  name:'Athena',  cls:'Myrmidon',    wpn:'Sword', p:[0,1,2,2,2], tags:[] },
  { id:'palla',   name:'Palla',   cls:'Pegasus Kt.', wpn:'Lance', p:[0,2,3,3,3], tags:['flier'] },
  { id:'catria',  name:'Catria',  cls:'Pegasus Kt.', wpn:'Lance', p:[0,2,3,4,3], tags:['flier'] },
  { id:'est',     name:'Est',     cls:'Pegasus Kt.', wpn:'Lance', p:[0,0,1,3,4], tags:['flier'] },
  { id:'astram',  name:'Astram',  cls:'Hero',        wpn:'Sword', p:[0,1,3,3,3], tags:[] },
  { id:'arran',   name:'Arran',   cls:'Paladin',     wpn:'Lance', p:[0,2,2,2,1], tags:['mounted','defensive'] },
  { id:'midia',   name:'Midia',   cls:'Paladin',     wpn:'Lance', p:[0,1,2,2,1], tags:['mounted','defensive'] },
  { id:'samson',  name:'Samson',  cls:'Hero',        wpn:'Sword', p:[0,1,3,3,3], tags:[] },
  { id:'horace',  name:'Horace',  cls:'General',     wpn:'Lance', p:[0,0,2,3,3], tags:['defensive','armor'] },
  { id:'etzel',   name:'Etzel',   cls:'Sorcerer',    wpn:'Tome',  p:[0,0,2,3,3], tags:[] },
  { id:'tiki',    name:'Tiki',    cls:'Manakete',    wpn:'Stone', p:[0,0,2,4,4], tags:['defensive'] },
  { id:'lorenz',  name:'Lorenz',  cls:'General',     wpn:'Lance', p:[0,1,2,3,2], tags:['defensive','armor'] },
  { id:'elice',   name:'Elice',   cls:'Sage',        wpn:'Staff', p:[0,0,2,3,3], tags:['healer'] },
  { id:'nagi',    name:'Nagi',    cls:'Manakete',    wpn:'Stone', p:[0,0,0,0,4], tags:['defensive'] },
  { id:'gotoh',   name:'Gotoh',   cls:'Sage',        wpn:'Tome',  p:[0,0,0,0,4], tags:['healer'] },
  { id:'xane',    name:'Xane',    cls:'Freelancer',  wpn:'Stone', p:[0,0,0,0,0], tags:['copy'], effect:'mirror' },
  { id:'zas',     name:'Zas',     cls:'Generic',     wpn:'Lance', p:[1,1,1,0,0], tags:['mounted'] },
];

const byId = (id) => POOL.find((c) => c.id === id);

// ---- "You" — a mid-draft / completed team used across screens ----
const YOUR_TEAM = ['marth','jagen','caeda','ogma','wrys','barst','merric','draug','cain','navarre'];

// ---- Six demo players with authored per-phase team-power totals.
//      (kept self-consistent with the standings + final scores below) ----
const PLAYERS = [
  { id:'you',   name:'You',           you:true,  power:[12,14,11, 9, 7], bonus: 0 },
  { id:'aria',  name:'Aria',                     power:[ 8,10,13,15,14], bonus:+1 },
  { id:'bram',  name:'Bram',                     power:[10, 9, 8,11,13], bonus:+1 },
  { id:'corin', name:'Corin',                    power:[ 6, 8,12,10, 9], bonus:-1 },
  { id:'dell',  name:'Dell',                     power:[14,11, 9, 7, 5], bonus:-1 },
  { id:'esca',  name:'Esca',          cpu:true,  power:[ 5, 7,10,12,16], bonus: 0 },
];

// Compute phase points + totals from the authored power numbers so the
// scoreboard, chart, and game-end screen never drift out of sync.
function computeStandings(players) {
  const phasePts = players.map(() => [0,0,0,0,0]);
  PHASES.forEach((_, ph) => {
    const ranked = players
      .map((pl, i) => ({ i, v: pl.power[ph] }))
      .sort((a, b) => b.v - a.v);
    ranked.forEach((r, rank) => { phasePts[r.i][ph] = SCORE_SPREAD[rank] || 0; });
  });
  return players.map((pl, i) => {
    const scorePts = phasePts[i].reduce((a, b) => a + b, 0);
    const bonus = pl.bonus || 0;
    return { ...pl, phasePts: phasePts[i], scorePts, bonus, total: scorePts + bonus };
  });
}

const STANDINGS = computeStandings(PLAYERS);
const RANKED = [...STANDINGS].sort((a, b) => b.total - a.total);

// ---- Coverage groups: a team needs at least ONE of each group, or it
//      takes a −1 (all-phases) penalty for every group it's missing. ----
const COVERAGE_GROUPS = [
  { id:'mage',     label:'Mage',     hint:'pierces defense',   test:(c)=>c.wpn==='Tome' },
  { id:'cleric',   label:'Cleric',   hint:'healing',           test:(c)=>c.wpn==='Staff' },
  { id:'ranged',   label:'Ranged',   hint:'archer / ballista', test:(c)=>c.wpn==='Bow' },
  { id:'defense',  label:'Defense',  hint:'knight / cavalier', test:(c)=>c.tags.includes('armor')||c.tags.includes('mounted') },
  { id:'mobility', label:'Mobility', hint:'cavalier / pegasus', test:(c)=>c.tags.includes('mounted')||c.tags.includes('flier') },
];

// Compute a team's bonus/penalty modifier:
//  • +1 (all phases) for every TRIO of characters covering Sword+Axe+Lance
//  • −1 (all phases) for every coverage group the team is missing
function computeTeamModifiers(ids) {
  const team = ids.map(byId).filter(Boolean);
  const coverage = COVERAGE_GROUPS.map((g) => ({ ...g, met: team.some((c) => g.test(c)) }));
  const missed = coverage.filter((g) => !g.met);
  const wc = { Sword: 0, Axe: 0, Lance: 0 };
  team.forEach((c) => { if (wc[c.wpn] !== undefined) wc[c.wpn]++; });
  const trios = Math.min(wc.Sword, wc.Axe, wc.Lance);
  return {
    coverage, missed, trios,
    bonus: trios,             // +1 per completed weapon-triangle trio
    penalty: missed.length,   // −1 per missing coverage group
    net: trios - missed.length,
    weaponCounts: wc,
  };
}

Object.assign(window, {
  PHASES, SCORE_SPREAD, WEAPONS, POOL, byId,
  YOUR_TEAM, PLAYERS, STANDINGS, RANKED, computeStandings,
  COVERAGE_GROUPS, computeTeamModifiers,
});
