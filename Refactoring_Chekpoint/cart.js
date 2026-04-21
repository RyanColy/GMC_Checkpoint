// Shopping Cart - Version initiale (code intentionnellement mauvais)

let items = [];
let u = "John";
let disc = 0;

function addStuff(n, p, q) {
  let found = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].n == n) {
      items[i].q += q;
      found = true;
    }
  }
  if (!found) {
    items.push({ n: n, p: p, q: q });
  }
  console.log("added " + n);
}

function removeStuff(n) {
  let newItems = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].n != n) {
      newItems.push(items[i]);
    }
  }
  items = newItems;
  console.log("removed");
}

function calc() {
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    t = t + items[i].p * items[i].q;
  }

  // apply discount
  if (disc == 1) {
    t = t - t * 0.1;
  } else if (disc == 2) {
    t = t - t * 0.2;
  } else if (disc == 3) {
    t = t - 5;
  }

  // tax
  t = t + t * 0.08;

  return t;
}

function printCart() {
  console.log("Cart for: " + u);
  for (let i = 0; i < items.length; i++) {
    console.log(items[i].n + " x" + items[i].q + " = " + items[i].p * items[i].q + "$");
  }
  console.log("Total: " + calc() + "$");
}

function setDisc(d) {
  disc = d;
}

function clearAll() {
  items = [];
  disc = 0;
  console.log("cart cleared");
}

// --- Usage ---
addStuff("Apple", 1.5, 3);
addStuff("Banana", 0.75, 5);
addStuff("Laptop", 999, 1);
setDisc(2);
printCart();
