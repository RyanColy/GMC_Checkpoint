# QA Report — Project Checkpoint (Counter App)

## Unit tests

18 tests across 3 suites, run with `npm test -- --watchAll=false`.

**`src/counter/counterLogic.test.js`** — pure logic (10 tests)
- `clamp`: value within bounds, below min, above max
- `applyDelta`: adding within bounds, hitting the max bound, hitting the min bound
- `clampStep`: rounding fractional steps, flooring at 1, falling back to the default on non-finite input
- `isAtMin` / `isAtMax`: boundary checks in both directions

**`src/counter/Counter.test.jsx`** — component behavior (5 tests)
- Increment/decrement by the current step
- Reset returns the count to zero
- The increment button disables at the configured max bound
- Changing the step input changes the increment amount
- Actions are recorded in the visible history log

**`src/App.test.js`** — smoke tests (2 tests)
- The counter heading renders
- The counter starts at zero

## Linter

CRA's built-in ESLint (`react-app` + `react-app/jest` config) runs as part of
`npm run build`. With `CI=true`, warnings fail the build the same way errors
do — this was run after every change.

Issues found and fixed during development:
- Unused `logo.svg` import left over from the CRA template — removed along
  with the unused asset file.

Final state: **0 errors, 0 warnings**.

## Code review

This was solo work, so review took the form of a self-review pass instead of
a peer PR review:

- **Structure check**: went back over every file to check for anything
  growing too large or doing too many things at once (largest file is 84
  lines, well within a reasonable size), and noticed the initial
  `logic/` + `components/` split organized code by technical layer rather
  than by feature. Fixed by consolidating everything into a single
  `src/counter/` folder grouped by feature. Re-ran the test suite immediately
  after and it stayed green (18/18), confirming the reorganization didn't
  change behavior.
- **UI pass**: revisited the layout for spacing, hierarchy, and interaction
  details (card container, subtle borders, hover/active states, badge-style
  history entries), with light/dark support.
