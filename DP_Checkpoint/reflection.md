# Reflection Report — Design Patterns Checkpoint

## Challenges During the Refactor

The main challenge was shifting my mindset from thinking in terms of independent functions to thinking in terms of a self-contained unit. In procedural code, functions and data exist separately in the global scope, which feels natural at first. When refactoring to the Module Pattern, I had to understand how closures work in JavaScript — specifically, that the inner `cart` variable stays alive and private inside the IIFE even after it has finished executing. Getting comfortable with the idea of returning only a selected public API (and hiding everything else) took some adjustment.

## How the Design Pattern Improved the Code

The Module Pattern brought two major improvements. First, **encapsulation**: the `cart` array is now completely private. In the procedural version, any part of the code could accidentally (or intentionally) modify `cart` directly, leading to unpredictable bugs. In the module version, the only way to interact with the cart is through the defined methods. Second, **namespace clarity**: instead of having several loosely related functions floating in the global scope, everything is grouped under `CartModule`. This makes the code easier to read and avoids naming conflicts in larger projects.

## When to Choose a Design Pattern Over Procedural Code

Procedural code is perfectly fine for small, self-contained scripts where simplicity matters more than structure. However, once a project grows — multiple developers, multiple features, shared state — design patterns become essential. I would choose a pattern like the Module Pattern whenever the code manages shared state that must be protected, when I want to expose a clean public API while hiding implementation details, or when the same logic will be reused across different parts of an application. In short: procedural for quick scripts, design patterns for maintainable, scalable code.
