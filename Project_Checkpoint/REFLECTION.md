# Reflection

The biggest challenge was less about any single Git or CI command and more
about the workflow discipline around them. Since this checkpoint's folder
lives inside an existing repository alongside earlier checkpoints, the right
move was to branch off the existing `master` for each concern rather than
starting fresh — it took a moment to notice that and avoid creating a
confusing, redundant setup. On the QA side, a small version mismatch in the
testing library (an older `user-event` API than the one I first reached for)
was a good reminder to check what's actually installed instead of assuming
the latest API is available.

The CI pipeline earned its keep quickly: because the build step runs CRA's
ESLint with warnings treated as errors, a leftover unused import from the
template got caught automatically, the same way it would on a real push,
instead of slipping through to a reviewer. Scoping the workflow with path
filters and a working directory also kept it from misfiring against the
repository's other checkpoint folders — a detail that matters more once a
repo holds more than one project.

Working in feature branches (one for the app itself, one for the CI setup,
one for the docs) made the project much easier to reason about than one
large commit would have. Each branch had a single, clear reason to exist,
and merging them back individually left a commit history that explains
itself without extra notes. Re-running the test suite before and after every
structural change — like reorganizing files by feature instead of by file
type — caught regressions immediately instead of letting them build up
silently. Overall, the exercise made the payoff of version control and CI
concrete: it's less about following rules and more about catching mistakes
earlier and cheaper.
