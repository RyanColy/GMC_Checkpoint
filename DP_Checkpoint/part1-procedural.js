let cart = [];

function addItem(name, quantity, price) {
  cart.push({ name, quantity, price });
}

function viewCart() {
  if (cart.length === 0) {
    console.log("Cart is empty.");
    return;
  }
  let total = 0;
  for (let item of cart) {
    const subtotal = item.quantity * item.price;
    console.log(`${item.name} (x${item.quantity}) - ${subtotal.toFixed(2)} TND`);
    total += subtotal;
  }
  console.log(`Total: ${total.toFixed(2)} TND`);
}

function removeItem(name) {
  cart = cart.filter(item => item.name !== name);
}

function clearCart() {
  cart = [];
}

// Test
addItem("Apple", 2, 1.5);
addItem("Orange", 3, 2.0);
viewCart();
removeItem("Apple");
viewCart();
