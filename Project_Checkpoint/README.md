# Project Checkpoint — Counter App

A small React app (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
built to demonstrate Git version control, a CI pipeline, and basic QA
practices, per [`Context.md`](./Context.md).

Increment/decrement a counter within configurable bounds, adjust the step
size, reset, and see the last few actions in a history log.

See [`QA_REPORT.md`](./QA_REPORT.md) for the QA summary and
[`REFLECTION.md`](./REFLECTION.md) for the reflection report.

## Available Scripts

In this directory, you can run:

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Runs the Jest/React Testing Library suite in interactive watch mode. Use
`npm test -- --watchAll=false` for a single non-interactive run (this is what
CI uses).

### `npm run build`

Builds the app for production into the `build` folder. This also runs CRA's
built-in ESLint checks; the CI pipeline runs this with `CI=true` so lint
warnings fail the build.

## CI

`.github/workflows/project-checkpoint-ci.yml` (at the repo root) runs `npm
test` and `npm run build` on every push/PR that touches this directory.
