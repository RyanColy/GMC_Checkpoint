// Shopping Cart - Iteration 1: Renommage, extraction de méthodes, encapsulation
//
// Changes from cart.js (initial version) :
// - Encapsulated all state into ShoppingCart class (no more global variables)
// - Renamed: addStuff → addItem, removeStuff → removeItem, calc → getTotal
// - Renamed properties: n → name, p → price, q → quantity
// - Extracted calc() into three methods: getSubtotal(), applyDiscount(), applyTax()
// - Replaced manual for loops with find(), filter(), reduce()
// - Replaced magic numbers with TAX_RATE and DISCOUNTS constants

const TAX_RATE = 0.08;

const DISCOUNTS = {
  NONE: 0,
  TEN_PERCENT: 1,
  TWENTY_PERCENT: 2,
  FLAT_FIVE: 3,
};

class ShoppingCart {
  constructor(username) {
    this.username = username;
    this.items = [];
    this.discountType = DISCOUNTS.NONE;
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

  setDiscount(discountType) {
    this.discountType = discountType;
  }

  clear() {
    this.items = [];
    this.discountType = DISCOUNTS.NONE;
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

  applyDiscount(amount) {
    if (this.discountType === DISCOUNTS.TEN_PERCENT) return amount * 0.9;
    if (this.discountType === DISCOUNTS.TWENTY_PERCENT) return amount * 0.8;
    if (this.discountType === DISCOUNTS.FLAT_FIVE) return amount - 5;
    return amount;
  }

  applyTax(amount) {
    return amount * (1 + TAX_RATE);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discounted = this.applyDiscount(subtotal);
    return this.applyTax(discounted);
  }
}

// --- Usage ---
const cart = new ShoppingCart("John");
cart.addItem("Apple", 1.5, 3);
cart.addItem("Banana", 0.75, 5);
cart.addItem("Laptop", 999, 1);
cart.setDiscount(DISCOUNTS.TWENTY_PERCENT);
cart.printCart();
