# Comparing the two approaches

After running both algorithms, one thing becomes pretty clear, pretty fast: we're not really comparing two equivalent solutions. We're comparing a solution that works in production and a solution that helps us understand the problem. Here's why.

---

## Which algorithm is faster for large inputs, and why?

Greedy, without question.

On 10,000 tasks, it finishes in a few milliseconds. On 100,000 tasks, it would still be fast. The reason is straightforward: it sorts tasks by end time — one pass — then walks through them one by one. That's `O(n log n)`, dominated entirely by the sort. The actual selection work is nearly linear.

Brute-Force, on the other hand, explores every possible combination. For `n` tasks, that means `2^n` paths to walk through. At 20 tasks, that's already over a million recursive calls. At 30 tasks, we're past a billion. At 75 tasks, our machine threw up its hands and bailed after 5 seconds. For 10,000 tasks, the number of combinations to explore is so large there's no sensible human way to express it.

The speed difference isn't about micro-optimization or code quality. It's a fundamental difference in the nature of the two algorithms.

---

## Which algorithm is easier to maintain and scale?

Again, Greedy — and it's not close.

The Greedy code fits in ten lines. Sort, iterate, select. Any developer joining the team understands what it does in thirty seconds. If tomorrow we need to add a constraint — a geographic priority, a task weight, a specific vehicle type — we know exactly where to go.

Brute-Force is a nested recursion exploring a decision tree. It's elegant on a whiteboard, but in practice it gets hard to debug the moment you touch any of the conditions. More importantly, any change that slightly increases the problem's complexity can make execution time explode catastrophically. That's not code you want to maintain under pressure, in production, at 3am.

---

## What are the memory trade-offs?

Both algorithms are `O(n)` on paper — they keep an array of `n` tasks in memory. But the reality is a bit more nuanced.

Greedy creates a sorted copy of the input array, then stores the selected tasks. Clean, predictable, and the memory footprint doesn't change based on the data.

Brute-Force consumes memory in two ways. First, the recursive call stack, which can get very deep — on larger inputs you risk a stack overflow before even getting a result. Second, at every node in the recursion tree, it makes a copy of the current array with `[...current]`. Those copies pile up in memory for the entire duration of the exploration. In practice, even on medium-sized inputs, Brute-Force uses significantly more RAM than the `O(n)` notation would suggest.

---

## Summary

| | Greedy | Brute-Force |
|---|---|---|
| Speed | Fast at any scale | Collapses around ~30 tasks |
| Maintainability | Simple, readable code | Recursive logic, hard to audit |
| Memory | Stable and predictable | Deep call stack + intermediate copies |
| Production-ready | Yes | No |

Brute-Force isn't useless — it's genuinely valuable for validating the Greedy on small datasets, or for problem variants where Greedy no longer guarantees optimality. But for a real-time delivery system processing thousands of tasks per second, it simply doesn't belong.

---

# Justifying the choice

The algorithm we're recommending for the final system is the **Greedy**.

Not because it's trendy, not because it's shorter to write, but because it's the right tool for this specific problem. And there's actually a mathematical proof behind that — not just intuition.

---

## Why Greedy is the right call here

The problem we're solving — selecting the maximum number of non-overlapping tasks — is a classic interval scheduling problem. And it happens to be one of the few cases where a greedy strategy doesn't just work well, it produces the globally optimal solution every single time.

The proof is called the exchange argument. The idea is this: take any valid schedule that wasn't built by picking the earliest ending task first. You can always swap one of its choices for the one Greedy would have made, without reducing the total number of tasks selected. Repeat that process and you eventually end up with exactly what Greedy produces. Which means no other strategy can do better.

So we're not just saying Greedy is fast. We're saying it's correct — and provably so.

On top of that, the performance numbers speak for themselves. Our benchmark processed 10,000 randomly generated tasks in under 5 milliseconds. That's the kind of throughput a real-time delivery platform needs. A system receiving thousands of task assignments per second can't afford to wait. Greedy fits naturally into that constraint.

The code is also easy to reason about. A new engineer can read it, understand it, and trust it without needing a deep algorithm background. That matters in a production codebase that people will maintain for years.

---

## When Brute-Force still makes sense

There are a few scenarios where you'd still reach for Brute-Force — or at least keep it around.

The most obvious one is testing. Brute-Force is the perfect oracle. When you're writing unit tests for the Greedy, you run both on a small dataset and confirm they agree. If they ever diverge, something is broken. That's a safety net worth having.

The second scenario is if the problem changes. The Greedy we've built works because all tasks have equal value — we're just maximizing count. The moment tasks have different weights or priorities, and we need to maximize total value instead of total count, the greedy approach no longer guarantees the best answer. That's a different problem — closer to a weighted interval scheduling problem — and it requires dynamic programming or an exhaustive search. Brute-Force becomes relevant again, at least for small inputs.

---

## The bottom line

Greedy is the choice. It's fast, it's correct, it's readable, and it scales. Keep Brute-Force in the test suite — it earns its place there. But in the production pipeline, there's only one algorithm that belongs.
