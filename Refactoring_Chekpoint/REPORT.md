# Summary Report — Shopping Cart Refactoring

## 1. Iteration Summary

### Initial Version — `cart.js`
Intentionally bad code used as a starting point.

**Code smells identified:**
- Global variables (`items`, `u`, `disc`) accessible from anywhere
- Unreadable naming (`n`, `p`, `q`, `addStuff`, `calc`)
- Magic numbers (`0.1`, `0.2`, `5`, `0.08`) with no context
- `calc()` method too long: subtotal, discount and tax all in one function
- Discount logic using nested `if/else` blocks, hard to extend
- No object-oriented structure

---

### Iteration 1 — `cart_v1.js` : Basic Cleanup

**Changes made:**
- Encapsulated all code into a `ShoppingCart` class
- Renamed all variables and functions to expressive names
- Extracted `getSubtotal()`, `applyDiscount()`, `applyTax()` from `calc()`
- Replaced manual `for` loops with `find()`, `filter()`, `reduce()`
- Introduced `TAX_RATE` and `DISCOUNTS` constants

**Principles applied:**
- Single Responsibility: each method has one clear purpose
- DRY: no duplicated loop logic
- Expressive naming: code reads like plain English

---

### Iteration 2 — `cart_v2.js` : Strategy Pattern

**Problem solved:** `applyDiscount()` grew with every new discount type, violating the Open/Closed Principle.

**Changes made:**
- Created `NoDiscount`, `PercentageDiscount`, `FlatDiscount` classes
- Each strategy exposes an `apply(amount)` method
- `ShoppingCart` delegates calculation to `this.discountStrategy.apply()`
- Added `setDiscountStrategy()` to swap strategies at runtime

**Benefits:**
- Adding a new discount = creating a new class, no changes to `ShoppingCart`
- Each strategy is independently testable
- Strategy can be swapped dynamically during a session

---

### Iteration 3 — `cart_v3.js` : Observer Pattern

**Problem solved:** No mechanism to notify users of a price drop without coupling that logic to the cart.

**Changes made:**
- Created `Product` class (observable subject) with `get/set price`
- The setter automatically detects a price drop and calls `notifyObservers()`
- Created `EmailNotifier` and `SMSNotifier` (observers) implementing `update()`
- `ShoppingCart` now receives `Product` objects instead of raw data

**Benefits:**
- `ShoppingCart` has zero knowledge of notification logic
- Adding a new notification channel = creating a new observer class
- Observers subscribe/unsubscribe freely via `addObserver()` / `removeObserver()`

---

### Iteration 4 — `cart_v4.js` : Builder Pattern

**Problem solved:** `Product` constructor with multiple optional parameters was fragile and unreadable at instantiation.

**Changes made:**
- Created `ProductBuilder` with a fluent API (chainable methods)
- Each optional property becomes a `with...()` method
- `withObserver()` integrates observer subscription directly into the build chain
- `build()` assembles and returns the final `Product` object

**Benefits:**
- Readable and self-documenting construction
- Default values centralized in the builder
- New fields can be added without modifying the `Product` constructor

---

## 2. Clean Code Principles Applied

| Principle | Application |
|-----------|-------------|
| **Expressive naming** | `addItem`, `getSubtotal`, `applyTax` vs `addStuff`, `calc` |
| **Single Responsibility** | Each class/method has one reason to change |
| **Open/Closed** | New discounts and observers added without modifying existing code |
| **DRY** | All duplicated logic eliminated |
| **Encapsulation** | No global variables, state managed inside classes |
| **Separation of concerns** | Calculation, notification, construction = separate classes |

---

## 3. Design Patterns Overview

| Pattern | File | Role |
|---------|------|------|
| **Strategy** | `cart_v2.js` | Swap discount algorithms without modifying `ShoppingCart` |
| **Observer** | `cart_v3.js` | Automatically notify subscribers on price drops |
| **Builder** | `cart_v4.js` | Build complex `Product` objects in a readable and flexible way |

---

## 4. Code Quality Evolution

```
cart.js      → Global variables, unreadable names, no structure
cart_v1.js   → Class, proper naming, extracted methods
cart_v2.js   → Extensible discounts without modifying the cart
cart_v3.js   → Decoupled notifications via events
cart_v4.js   → Flexible and readable product construction
```

The code evolved from a fragile procedural script into a modular, extensible, and maintainable object-oriented architecture.
