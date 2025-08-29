// main.js

// ========== GLOBAL VARIABLES ==========
const API_BASE = 'https://fakestoreapi.com/products';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header(s)
function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count, #cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElements.forEach((el) => {
    el.textContent = totalItems;
  });
}

// ========== ADD TO CART ==========
function addToCart(id, title, price, image) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  alert(`${title} added to cart!`);
}

// ========== CART PAGE ==========
function renderCartPage() {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    document.getElementById('subtotal').textContent = '0';
    document.getElementById('total').textContent = '0';
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" width="50">
                    <span>${item.title}</span>
                    <span>₦${item.price}</span>
                    <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
                `
      )
      .join('');
    updateCartTotals();
  }
  updateCartCount();
}

function updateQuantity(index, quantity) {
  cart[index].quantity = parseInt(quantity);
  if (cart[index].quantity <= 0) cart[index].quantity = 1;
  saveCart();
  renderCartPage();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartPage();
}

function updateCartTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('total').textContent = subtotal.toFixed(2);
}

// ========== CHECKOUT PAGE ==========
function renderCheckoutPage() {
  const orderSummary = document.getElementById('order-summary');
  const checkoutTotal = document.getElementById('checkout-total');
  if (!orderSummary || !checkoutTotal) return;
  if (cart.length === 0) {
    orderSummary.innerHTML = '<p>No items in cart.</p>';
    checkoutTotal.textContent = '0';
  } else {
    orderSummary.innerHTML = cart
      .map(
        (item) => `
                <p>${item.title} (x${item.quantity}) - ₦${(
          item.price * item.quantity
        ).toFixed(2)}</p>
                `
      )
      .join('');
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    checkoutTotal.textContent = total.toFixed(2);
  }
  updateCartCount();
}

// Handle checkout form submission
const checkoutForm = document.querySelector('.checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Order placed successfully! 🎉');
    cart = [];
    saveCart();
    updateCartCount();
    checkoutForm.reset();
    renderCheckoutPage();
  });
}
