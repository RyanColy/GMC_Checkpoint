// Shopping Cart - Iteration 2: Strategy Pattern pour les remises
//
// Changes from cart_v1.js :
// - Removed applyDiscount() and DISCOUNTS object from ShoppingCart
// - Created NoDiscount, PercentageDiscount, FlatDiscount classes (each with apply())
// - discountType (integer) replaced by discountStrategy (strategy object)
// - setDiscount() renamed to setDiscountStrategy() — receives an object, not a code
// - New discount types can be added without modifying ShoppingCart (Open/Closed)

const TAX_RATE = 0.08;

// --- Discount strategies ---

class NoDiscount {
  apply(amount) {
    return amount;
  }
}

class PercentageDiscount {
  constructor(percent) {
    this.percent = percent;
  }
  apply(amount) {
    return amount * (1 - this.percent / 100);
  }
}

class FlatDiscount {
  constructor(flatAmount) {
    this.flatAmount = flatAmount;
  }
  apply(amount) {
    return Math.max(0, amount - this.flatAmount);
  }
}

// --- Main class ---

class ShoppingCart {
  constructor(username) {
    this.username = username;
    this.items = [];
    this.discountStrategy = new NoDiscount();
  }

  addItem(name, price, quantity) {
    const existing = this.findItem(name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ name, price, quantity });
    }
    console.log(`"${name}" ajouté au panier.`);
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
    console.log(`"${name}" retiré du panier.`);
  }

  setDiscountStrategy(strategy) {
    this.discountStrategy = strategy;
  }

  clear() {
    this.items = [];
    this.discountStrategy = new NoDiscount();
    console.log("Panier vidé.");
  }

  printCart() {
    console.log(`\nPanier de : ${this.username}`);
    console.log("-------------------------");
    for (const item of this.items) {
      const subtotal = item.price * item.quantity;
      console.log(`${item.name} x${item.quantity} = ${subtotal.toFixed(2)}$`);
    }
    console.log("-------------------------");
    console.log(`Total (taxes incluses) : ${this.getTotal().toFixed(2)}$`);
  }

  // --- Private methods ---

  findItem(name) {
    return this.items.find((item) => item.name === name);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  applyTax(amount) {
    return amount * (1 + TAX_RATE);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discounted = this.discountStrategy.apply(subtotal);
    return this.applyTax(discounted);
  }
}

// --- Usage ---
const cart = new ShoppingCart("John");
cart.addItem("Apple", 1.5, 3);
cart.addItem("Banana", 0.75, 5);
cart.addItem("Laptop", 999, 1);

cart.setDiscountStrategy(new PercentageDiscount(20));
cart.printCart();

cart.setDiscountStrategy(new FlatDiscount(5));
cart.printCart();
