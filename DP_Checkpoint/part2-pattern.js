const CartModule = (function () {
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

  return { addItem, viewCart, removeItem, clearCart };
})();

// Test
CartModule.addItem("Apple", 2, 1.5);
CartModule.addItem("Orange", 3, 2.0);
CartModule.viewCart();
CartModule.removeItem("Apple");
CartModule.viewCart();
