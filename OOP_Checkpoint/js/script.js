// ============================================================
// Product Class
// Represents a product available in the shop.
// Stores the product's unique id, display name, and unit price.
// ============================================================
class Product {
  /**
   * @param {number} id    - Unique identifier for the product
   * @param {string} name  - Display name of the product
   * @param {number} price - Unit price of the product (in $)
   */
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// ============================================================
// ShoppingCartItem Class
// Represents a single line in the cart:
// one product associated with a chosen quantity.
// ============================================================
class ShoppingCartItem {
  /**
   * @param {Product} product  - The Product object linked to this cart line
   * @param {number} quantity  - How many units of the product are ordered (default: 0)
   */
  constructor(product, quantity = 0) {
    this.product = product;
    this.quantity = quantity;
  }

  /**
   * Calculates the subtotal for this cart line.
   * Formula: unit price × quantity
   * @returns {number} - The subtotal price for this item
   */
  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// ============================================================
// ShoppingCart Class
// Manages the entire cart: holds all ShoppingCartItem instances
// and exposes methods to add, remove, delete, and display items.
// ============================================================
class ShoppingCart {
  constructor() {
    // Internal array holding all ShoppingCartItem instances currently in the cart
    this.items = [];
  }

  /**
   * Returns the total number of individual units across all cart items.
   * Example: 2 Baskets + 3 Socks = 5 total items.
   * @returns {number}
   */
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Adds one unit of a product to the cart.
   * - If the product is already in the cart, its quantity is incremented by 1.
   * - If the product is new, a ShoppingCartItem is created with quantity 1.
   * @param {Product} product - The product to add to the cart
   */
  addItem(product) {
    // Search for an existing cart line matching this product id
    const existingItem = this.items.find(item => item.product.id === product.id);

    if (existingItem) {
      // The product is already in the cart — just bump the quantity
      existingItem.quantity++;
    } else {
      // First time adding this product — create a new cart line
      this.items.push(new ShoppingCartItem(product, 1));
    }
  }

  /**
   * Decrements the quantity of a cart item by 1.
   * If the quantity reaches 0, the item is fully removed from the cart array.
   * @param {number} productId - The id of the product whose quantity should decrease
   */
  removeItem(productId) {
    // Find the index of the matching cart item
    const itemIndex = this.items.findIndex(item => item.product.id === productId);

    if (itemIndex === -1) {
      // Edge case: trying to remove a product that isn't in the cart
      console.warn(`Product with id ${productId} not found in the cart.`);
      return;
    }

    const item = this.items[itemIndex];
    item.quantity--;

    // If the quantity hits 0, remove the item entirely from the array
    if (item.quantity <= 0) {
      this.items.splice(itemIndex, 1);
    }
  }

  /**
   * Fully removes a cart item regardless of its current quantity.
   * Used when the user clicks the trash icon to delete a product entirely.
   * @param {number} productId - The id of the product to delete from the cart
   */
  deleteItem(productId) {
    // Keep only items whose product id does NOT match the one to delete
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  /**
   * Calculates the grand total price for the entire cart.
   * Returns 0 if the cart is empty (avoids reduce errors on empty arrays).
   * @returns {number} - The sum of all item subtotals
   */
  getTotalPrice() {
    if (this.items.length === 0) return 0;
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  /**
   * Logs a formatted summary of the cart to the browser console.
   * Lists each item (name, quantity, subtotal) and prints the grand total.
   * Useful for debugging and testing the OOP layer independently from the DOM.
   */
  displayCart() {
    if (this.items.length === 0) {
      console.log("The cart is empty.");
      return;
    }

    console.log("=== Cart contents ===");
    this.items.forEach(item => {
      console.log(
        `- ${item.product.name} | Quantity: ${item.quantity} | Subtotal: ${item.getTotalPrice()} $`
      );
    });
    console.log(`=== Grand Total: ${this.getTotalPrice()} $ ===`);
  }
}

// ============================================================
// OOP <-> DOM Binding
// Instantiate the Product and ShoppingCart objects, then attach
// DOM event listeners that call the cart's OOP methods.
// ============================================================

// Define the three products matching the three HTML cards
const products = [
  new Product(1, "Baskets", 100),
  new Product(2, "Socks", 20),
  new Product(3, "Bag", 50),
];

// Single global ShoppingCart instance shared across the whole page
const cart = new ShoppingCart();

/**
 * Updates the total price text in the DOM.
 * Also triggers a brief highlight animation on the total to draw attention.
 * Edge case: if the cart is empty, displays "0 $" instead of a negative or blank value.
 */
function updateTotalDisplay() {
  const totalEl = document.querySelector(".total");
  const total = cart.getTotalPrice();

  // Display "0 $" when the cart is empty; otherwise show the computed total
  totalEl.textContent = total > 0 ? `${total} $` : "0 $";

  // Trigger a CSS animation to visually highlight the price change
  // Remove then re-add the class to restart the animation each time
  totalEl.classList.remove("price-updated");
  setTimeout(() => totalEl.classList.add("price-updated"), 10);
}

/**
 * Checks whether all product cards have been removed from the DOM.
 * If the product list is empty, injects a friendly "Your cart is empty" message
 * so the UI does not show a blank, confusing section.
 * Edge case: handles the scenario where every item has been deleted.
 */
function checkEmptyCart() {
  const listProducts = document.querySelector(".list-products");
  const remainingCards = listProducts.querySelectorAll(".card-body");

  // If no cards remain, show an empty cart message
  if (remainingCards.length === 0) {
    // Avoid inserting the message multiple times
    if (!listProducts.querySelector(".empty-cart-message")) {
      const emptyMsg = document.createElement("p");
      emptyMsg.classList.add("empty-cart-message");
      emptyMsg.textContent = "Your cart is empty. Start adding some products!";
      listProducts.appendChild(emptyMsg);
    }
  }
}

/**
 * Shows a custom confirmation dialog before deleting a product card.
 * This is more user-friendly than a native browser confirm() pop-up.
 * @param {string} productName - The name of the product shown in the dialog
 * @param {Function} onConfirm - Callback executed if the user confirms deletion
 */
function showDeleteConfirmation(productName, onConfirm) {
  // Build the dark semi-transparent overlay backdrop
  const overlay = document.createElement("div");
  overlay.classList.add("confirm-overlay");

  // Build the dialog box with a message and two action buttons
  const dialog = document.createElement("div");
  dialog.classList.add("confirm-dialog");
  dialog.innerHTML = `
    <p>Are you sure you want to remove <strong>${productName}</strong> from your cart?</p>
    <div class="confirm-buttons">
      <button class="btn-confirm-yes">Yes, remove it</button>
      <button class="btn-confirm-no">Cancel</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Fade the overlay in after a short delay to trigger the CSS transition
  setTimeout(() => overlay.classList.add("visible"), 10);

  /**
   * Closes and removes the confirmation dialog from the DOM.
   * Waits for the fade-out CSS transition to complete before removal.
   */
  function closeDialog() {
    overlay.classList.remove("visible");
    setTimeout(() => overlay.remove(), 300);
  }

  // "Yes" button: execute the deletion callback and close the dialog
  dialog.querySelector(".btn-confirm-yes").addEventListener("click", () => {
    onConfirm();
    closeDialog();
  });

  // "Cancel" button: close the dialog without taking any action
  dialog.querySelector(".btn-confirm-no").addEventListener("click", closeDialog);

  // Clicking outside the dialog box (on the backdrop) also cancels
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDialog();
  });
}

// ============================================================
// Event Listeners Setup
// Loop through each product card and attach all four button behaviors.
// ============================================================

// Grab all .card elements from the DOM — one per product
const cards = document.querySelectorAll(".card");

cards.forEach((card, index) => {
  // Map this DOM card to its Product object using the position index
  const product = products[index];

  // Cache references to interactive elements inside this card
  const plusBtn      = card.querySelector(".fa-plus-circle");
  const minusBtn     = card.querySelector(".fa-minus-circle");
  const deleteBtn    = card.querySelector(".fa-trash-alt");
  const heartBtn     = card.querySelector(".fa-heart");
  const quantitySpan = card.querySelector(".quantity");

  // ----------------------------------------------------------
  // "+" Button — Increase quantity by 1
  // ----------------------------------------------------------
  plusBtn.addEventListener("click", () => {
    // Add one unit to the OOP cart
    cart.addItem(product);

    // Sync the displayed quantity with the cart's internal state
    const item = cart.items.find(i => i.product.id === product.id);
    quantitySpan.textContent = item ? item.quantity : 0;

    // Play a small pop animation on the quantity number for visual feedback
    quantitySpan.classList.remove("quantity-bump");
    setTimeout(() => quantitySpan.classList.add("quantity-bump"), 10);

    updateTotalDisplay();
  });

  // ----------------------------------------------------------
  // "-" Button — Decrease quantity by 1 (minimum 0)
  // Edge case: if quantity is already 0, the click is silently ignored.
  // ----------------------------------------------------------
  minusBtn.addEventListener("click", () => {
    const item = cart.items.find(i => i.product.id === product.id);

    // Edge case: do nothing if the item is not in the cart or quantity is 0
    if (!item || item.quantity === 0) return;

    cart.removeItem(product.id);

    // The item may have been fully deleted from the array if quantity hit 0
    const updatedItem = cart.items.find(i => i.product.id === product.id);
    quantitySpan.textContent = updatedItem ? updatedItem.quantity : 0;

    // Pop animation on the quantity for feedback
    quantitySpan.classList.remove("quantity-bump");
    setTimeout(() => quantitySpan.classList.add("quantity-bump"), 10);

    updateTotalDisplay();
  });

  // ----------------------------------------------------------
  // Trash Button — Delete the product card entirely
  // A confirmation dialog is shown before any deletion occurs.
  // After deletion, the UI is checked for the empty cart state.
  // ----------------------------------------------------------
  deleteBtn.addEventListener("click", () => {
    // Ask the user to confirm before deleting
    showDeleteConfirmation(product.name, () => {
      // User confirmed: remove the product from the OOP cart
      cart.deleteItem(product.id);

      // Animate the card wrapper out with a CSS fade+slide animation
      const cardWrapper = card.parentElement;
      cardWrapper.classList.add("card-removing");

      // Once the CSS animation ends, remove the node from the DOM
      // { once: true } ensures this listener auto-detaches after firing once
      cardWrapper.addEventListener("animationend", () => {
        cardWrapper.remove();

        // Edge case: check if the cart is now completely empty
        checkEmptyCart();
        updateTotalDisplay();
      }, { once: true });
    });
  });

  // ----------------------------------------------------------
  // Heart Button — Toggle liked state
  // Toggles the icon between red (liked) and black (not liked).
  // A pop animation plays on each click for a satisfying feel.
  // ----------------------------------------------------------
  heartBtn.addEventListener("click", () => {
    if (heartBtn.style.color === "red") {
      heartBtn.style.color = "black"; // Remove like
    } else {
      heartBtn.style.color = "red"; // Add like
    }

    // Play a pop animation on the heart icon
    heartBtn.classList.remove("heart-pop");
    setTimeout(() => heartBtn.classList.add("heart-pop"), 10);
  });
});

// Initialize the total price display when the page first loads
updateTotalDisplay();