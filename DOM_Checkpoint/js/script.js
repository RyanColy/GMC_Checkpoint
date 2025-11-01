// Get all product cards
const cards = document.querySelectorAll('.card');

// Function to calculate and update total price
function updateTotal() {
  let total = 0;
  
  cards.forEach(card => {
    const unitPrice = parseInt(card.querySelector('.unit-price').textContent);
    const quantity = parseInt(card.querySelector('.quantity').textContent);
    total += unitPrice * quantity;
  });
  
  document.querySelector('.total').textContent = `${total} $`;
}

// Add event listeners to each product card
cards.forEach(card => {
  const plusBtn = card.querySelector('.fa-plus-circle');
  const minusBtn = card.querySelector('.fa-minus-circle');
  const deleteBtn = card.querySelector('.fa-trash-alt');
  const heartBtn = card.querySelector('.fa-heart');
  const quantitySpan = card.querySelector('.quantity');
  
  // Plus button: increase quantity
  plusBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantitySpan.textContent);
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
    updateTotal();
  });
  
  // Minus button: decrease quantity (minimum 0)
  minusBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantitySpan.textContent);
    if (currentQuantity > 0) {
      currentQuantity--;
      quantitySpan.textContent = currentQuantity;
      updateTotal();
    }
  });
  
  // Delete button: remove the product card
  deleteBtn.addEventListener('click', () => {
    card.parentElement.remove();
    updateTotal();
  });
  
  // Heart button: toggle like (change color)
  heartBtn.addEventListener('click', () => {
    if (heartBtn.style.color === 'red') {
      heartBtn.style.color = 'black';
    } else {
      heartBtn.style.color = 'red';
    }
  });
});

// Initialize total price on page load
updateTotal();