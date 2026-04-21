// Shopping Cart - Iteration 4: Builder Pattern pour la création de produits
//
// Changes from cart_v3.js :
// - Product extended with category, stock, description and toString()
// - Created ProductBuilder with a fluent API (chainable with...() methods)
// - withObserver() integrates observer subscription directly into the build chain
// - build() assembles and returns the final Product object
// - No longer need to pass all parameters positionally in new Product(...)

const TAX_RATE = 0.08;

// --- Discount strategies (unchanged from v2) ---

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

// --- Observers (unchanged from v3) ---

class EmailNotifier {
  constructor(email) {
    this.email = email;
  }
  update(productName, oldPrice, newPrice) {
    console.log(
      `[Email → ${this.email}] Baisse de prix sur "${productName}" : ${oldPrice.toFixed(2)}$ → ${newPrice.toFixed(2)}$`
    );
  }
}

class SMSNotifier {
  constructor(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
  update(productName, oldPrice, newPrice) {
    console.log(
      `[SMS → ${this.phoneNumber}] "${productName}" est passé de ${oldPrice.toFixed(2)}$ à ${newPrice.toFixed(2)}$`
    );
  }
}

// --- Observable product (unchanged from v3) ---

class Product {
  constructor(name, price, category, stock, description) {
    this.name = name;
    this._price = price;
    this.category = category;
    this.stock = stock;
    this.description = description;
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  get price() {
    return this._price;
  }

  set price(newPrice) {
    if (newPrice < this._price) {
      const oldPrice = this._price;
      this._price = newPrice;
      this.notifyObservers(oldPrice, newPrice);
    } else {
      this._price = newPrice;
    }
  }

  notifyObservers(oldPrice, newPrice) {
    for (const observer of this.observers) {
      observer.update(this.name, oldPrice, newPrice);
    }
  }

  toString() {
    return `[${this.category}] ${this.name} — ${this._price.toFixed(2)}$ (stock: ${this.stock})`;
  }
}

// --- Builder ---

class ProductBuilder {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.category = "Général";
    this.stock = 0;
    this.description = "";
    this.observers = [];
  }

  withCategory(category) {
    this.category = category;
    return this;
  }

  withStock(stock) {
    this.stock = stock;
    return this;
  }

  withDescription(description) {
    this.description = description;
    return this;
  }

  withObserver(observer) {
    this.observers.push(observer);
    return this;
  }

  build() {
    const product = new Product(
      this.name,
      this.price,
      this.category,
      this.stock,
      this.description
    );
    for (const observer of this.observers) {
      product.addObserver(observer);
    }
    return product;
  }
}

// --- Main class ---

class ShoppingCart {
  constructor(username) {
    this.username = username;
    this.items = [];
    this.discountStrategy = new NoDiscount();
  }

  addItem(product, quantity) {
    const existing = this.findItem(product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    console.log(`"${product.name}" ajouté au panier.`);
  }

  removeItem(productName) {
    this.items = this.items.filter((item) => item.product.name !== productName);
    console.log(`"${productName}" retiré du panier.`);
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
      const subtotal = item.product.price * item.quantity;
      console.log(`${item.product.name} x${item.quantity} = ${subtotal.toFixed(2)}$`);
    }
    console.log("-------------------------");
    console.log(`Total (taxes incluses) : ${this.getTotal().toFixed(2)}$`);
  }

  // --- Private methods ---

  findItem(productName) {
    return this.items.find((item) => item.product.name === productName);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
const emailNotifier = new EmailNotifier("john@example.com");
const smsNotifier = new SMSNotifier("+33612345678");

const laptop = new ProductBuilder("Laptop", 999)
  .withCategory("Électronique")
  .withStock(10)
  .withDescription("Laptop 15 pouces, 16Go RAM")
  .withObserver(emailNotifier)
  .withObserver(smsNotifier)
  .build();

const apple = new ProductBuilder("Apple", 1.5)
  .withCategory("Alimentation")
  .withStock(100)
  .withObserver(emailNotifier)
  .build();

const banana = new ProductBuilder("Banana", 0.75)
  .withCategory("Alimentation")
  .withStock(80)
  .build();

console.log("Produits créés :");
console.log(laptop.toString());
console.log(apple.toString());
console.log(banana.toString());

const cart = new ShoppingCart("John");
cart.addItem(apple, 3);
cart.addItem(banana, 5);
cart.addItem(laptop, 1);

cart.setDiscountStrategy(new PercentageDiscount(20));
cart.printCart();

console.log("\n--- Mise à jour des prix ---");
laptop.price = 849;
apple.price = 1.2;
