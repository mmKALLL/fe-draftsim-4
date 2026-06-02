# FE11 Draft Sim

Local TS + Vite scaffold for a mobile-first multiplayer draft game prototype.

## Scripts

- `npm install` installs the local toolchain.
- `npm run dev` starts Vite at `http://localhost:5173/`.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` typechecks and builds the static app into `dist/`.

## Project Shape

- `src/main.ts` mounts an intentionally empty app root for design-driven screens.
- `src/styles.css` contains the mobile-first reset and shared CSS tokens.
- `src/types.ts` defines draft, scoring, roster, and future card-effect types.
- `src/data/rules.ts` keeps rules from `initial-spec.md` as typed data.
- `src/data/characters.ts` seeds the 60-character draft pool without inventing full stats.

The frontend is deliberately minimal until the Claude Design screenshots establish the screen structure.

