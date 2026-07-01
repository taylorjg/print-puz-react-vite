# TypeScript Migration Plan

Assessment and plan for switching this repo from JavaScript to TypeScript.

**Generated:** July 2026  
**Baseline:** `src/`, `cypress/`, and root config files (`vite.config.js`, `eslint.config.js`, `cypress.config.js`)

## Verdict

**Not a huge deal.** For ~1,500 lines and a focused app (homepage → fetch puzzle → render/print PDF), this is a **small migration** — comfortably **weekend-scale**, likely toward the **lower end** of a 1–2 day estimate.

| Approach | Effort |
|----------|--------|
| Minimal (tooling + rename + fix errors, `strict: false`) | ~half a day |
| Solid (shared puzzle/API types, `strict: true`, tests passing) | ~1 day, maybe a bit more if PDF layout typing gets fiddly |

The payoff is strongest if you plan to keep evolving the PDF layout and API integration. If the app is mostly stable, staying on JavaScript is also reasonable.

---

## Current Codebase Size

| Area | Files | Notes |
|------|-------|-------|
| `src/` total | ~36 JS/JSX files | |
| `src/pages/puzzle-page/` | 10 files (~600 lines) | PDF generation + viewer |
| `src/pages/homepage/` | ~8 files | Home / puzzle selection UI |
| Shared (`components`, `helpers`, `mocks`, etc.) | ~12 files | |
| Cypress + configs | ~5 files | |
| **Total** | **~41 files, ~1,500 lines** | |

There is **one** puzzle page: `src/pages/puzzle-page/`, exported via `src/pages/index.js` and wired in `main.jsx`. Legacy layout folders (`puzzle-page-old-html-layout`, `puzzle-page-new-pdf-layout`) are gone.

---

## What's Already in Your Favor

- **Vite + React** — first-class TypeScript support; mostly rename files and add `tsconfig.json`
- **`@types/react` and `@types/react-dom`** are already in `devDependencies` (but `typescript` itself is not yet installed)
- **`jsconfig.json`** already defines the `@app/*` path alias — maps cleanly to `tsconfig.json`
- **`prop-types`** is barely used (2 components) — TypeScript replaces it easily
- Dependencies (**MUI, pdf-lib, axios, react-router, MSW**) all have good type support
- CI is simple (lint → vitest → cypress build); adding `tsc --noEmit` would be straightforward

---

## Where the Real Work Is

The mechanical part — renaming `.js`/`.jsx` → `.ts`/`.tsx`, updating ESLint, adding `typescript` — is quick.

The meaningful effort is **domain typing**, concentrated in one puzzle page (no duplicate work across legacy layouts):

### 1. API / domain types

- `serverless.js` — axios responses (`puzzleUrl`, puzzle list, parsed puzzle)
- `puzzle753.json` — concrete shape to model (`puzzle`, `grid`, `clues`, etc.)
- MSW handlers in `src/mocks/handlers.js`

### 2. PDF pipeline

- `generate-crossword-pdf.js`
- `pdf-layout.js`, `draw-banner.js`, `banner-layout.js`

Lots of object destructuring today is implicit; these modules benefit most from shared `ParsedPuzzle` (or similar) types.

### 3. React surfaces

- `homepage` — state + navigation + API data
- `puzzle-page` — loading/error/PDF viewer flow

### 4. Small shared layer

- `helpers/puzzle-route.js`, `utils.js`
- `components/` (alerts, version, etc.)

---

## Easy vs. Medium vs. Optional

### Easy

- `helpers/puzzle-route.js`, `utils.js`, routing in `main.jsx`
- Simple presentational components (`loading-alert`, `version`, etc.)
- MSW handlers — a few response types

### Medium

- Homepage + puzzle page React components (state + navigation)
- Vitest tests — usually fine after components are typed

### Optional / defer

- **Cypress** — many teams leave e2e in JavaScript and only migrate `src/`
- **Emotion `.styles.js` files** — rename to `.ts`; low risk
- **`vite.config.js` / `eslint.config.js`** — can stay JavaScript or move to `.ts` later

---

## Suggested Approach

Use an **incremental** migration for low risk:

1. Add `typescript`, `typescript-eslint`, and a Vite-style `tsconfig.json` with `allowJs: true`
2. Introduce shared types (e.g. `ParsedPuzzle`, puzzle list item, API responses) — `puzzle753.json` is a good reference
3. Migrate `src/helpers` and `src/serverless` first
4. Convert `src/pages/puzzle-page` (PDF pipeline + page component)
5. Convert `src/pages/homepage` and remaining `src/components`
6. Tighten `strict` over time (or start with `strict: true` — at this size it is manageable)
7. Leave Cypress in JavaScript unless full consistency is desired

### Suggested first PR

Tooling + shared puzzle types + `helpers` / `serverless`, without touching Cypress.

---

## Tooling Checklist

- [ ] Install `typescript` and `@typescript-eslint/*` dev dependencies
- [ ] Add `tsconfig.json` (extend Vite React template; mirror `@app/*` from `jsconfig.json`)
- [ ] Update `eslint.config.js` for `**/*.{ts,tsx}` files
- [ ] Optionally add `"typecheck": "tsc --noEmit"` script and run it in CI
- [ ] Remove `prop-types` once components are typed
- [ ] Replace `jsconfig.json` with `tsconfig.json` (or keep both briefly during transition with `allowJs: true`)

---

## Verification Checklist

After each phase:

```bash
npm run build
npm test
npm run lint
npm run test:cypress
```

If `typecheck` is added:

```bash
npm run typecheck
```
