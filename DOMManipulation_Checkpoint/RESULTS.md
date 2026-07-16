# Benchmark Results — React vs Angular vs Vue vs Svelte

## Methodology

Each app implements the same to-do list (`task/ui/benchmark` domains, see root `CLAUDE.md`)
with a **Benchmark** tab exposing three buttons: `Render 1000`, `Update 50`, `Delete 50`.
Timing is measured with `performance.now()`, captured after two chained
`requestAnimationFrame` calls so the elapsed time includes the browser paint, not just
the JS state update.

For each framework the three buttons were clicked once, in sequence, on the same running
app: Render 1000 tasks → Update the first 50 → Delete the first 50 of the remaining 950.
This is a **single measurement pass per framework**, not an average over multiple runs —
sufficient to compare architectural behavior for this exercise, but numbers can vary a few
percent between runs. All four apps ran as unoptimized Vite dev builds in the same Chrome
browser, one after another, on the same machine.

## Results table

| Framework | Render 1000 tasks (ms) | Update 50 tasks (ms) | Delete 50 tasks (ms) |
|---|---|---|---|
| React    | 291.00 | 171.40 | 147.00 |
| Angular  | 317.80 |  23.40 |  56.00 |
| Vue      | 242.90 |  36.20 |  68.20 |
| Svelte   | 325.10 |  30.60 |  31.80 |

## Chart

```
Render 1000 tasks (ms)
React    ██████████████████████████████████████████████████████████ 291.0
Angular  ████████████████████████████████████████████████████████████████ 317.8
Vue      ██████████████████████████████████████████████████ 242.9
Svelte   ███████████████████████████████████████████████████████████████ 325.1

Update 50 tasks (ms)
React    ███████████████████████████████████████████████████████████████████ 171.4
Angular  █████████ 23.4
Vue      ██████████████ 36.2
Svelte   ████████████ 30.6

Delete 50 tasks (ms)
React    ██████████████████████████████████████████████████████████ 147.0
Angular  ██████████████████████ 56.0
Vue      ███████████████████████████ 68.2
Svelte   █████████████ 31.8
```

## Reflection report (≈270 words)

Working across four frameworks that implement the same to-do list surfaced clear
differences in how much manual optimization each one demands. In React, keeping renders
cheap required using stable `key`s on list items and avoiding recreating the task array
unnecessarily; without care, updating even a handful of items risks re-rendering the whole
list, since React re-evaluates the surrounding component tree on every state change before
diffing. Angular's signal-based reactivity (v22) made fine-grained updates almost
automatic — the framework only recomputes what actually changed, so batching updates and
deletions needed no extra thought. Vue's reactivity system behaved similarly, though its
virtual-DOM diffing still has to reconcile whole lists on bulk updates. Svelte was the most
surprising: because reactivity and re-render logic are resolved entirely at compile time,
its runtime has almost nothing left to do at update time, and the generated code patches
DOM nodes directly with minimal overhead.

These architectural differences show up directly in the numbers. Rendering 1000 tasks from
scratch was roughly comparable across all four (243–325ms), since that operation is
dominated by raw DOM node creation rather than each framework's diffing strategy. The gap
widens sharply on smaller mutations: React took over 170ms to update 50 tasks — more than
5x slower than Angular (23ms) or Svelte (31ms) — because it re-diffs the surrounding tree
instead of surgically patching only the changed nodes. Angular's signals and Svelte's
compiled reactivity both localize updates to exactly what changed, which is why they
dominated the update and delete benchmarks.

Overall, Angular and Svelte were the strongest performers for incremental updates and
deletions, while full-list render performance was fairly framework-agnostic. For an app
dominated by frequent small edits — like a real to-do list — fine-grained reactivity
(signals or compile-time reactivity) clearly outperforms virtual-DOM diffing at scale.
