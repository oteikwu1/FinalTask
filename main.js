
 
  const API_BASE = 'https://api.escuelajs.co/api/v1/products';

  fetch(API_BASE)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error('Fetch error:', err));

    [
      {
        id: 4,
        title: 'Handmade Fresh Table',
        slug: 'handmade-fresh-table',
        price: 687,
        description: 'Andy shoes are designed to keeping in...',
        category: {
          id: 5,
          name: 'Others',
          image: 'https://placehold.co/600x400',
          slug: 'others',
        },
        images: [
          'https://placehold.co/600x400',
          'https://placehold.co/600x400',
          'https://placehold.co/600x400',
        ],
      },
      // ...
    ];



fetch(API_BASE)
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error('Fetch error:', err));



let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];



// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count, #cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  countElements.forEach((el) => {
    el.textContent = totalItems;
  });
};

const searchInput = document.querySelector('.search-icon-btn');

function handleSearch(query) {
  const productList = document.getElementById('product-list');
  const filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredProducts.length > 0) {
    productList.innerHTML = filteredProducts
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.images[0]}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>₦${product.price}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `
      )
      .join('');

  
    document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');
        const productId = productCard.dataset.productId;
        const selectedProduct = allProducts.find((p) => p.id == productId);
        if (selectedProduct) {
          addToCart(
            selectedProduct.id,
            selectedProduct.title,
            selectedProduct.price,
            selectedProduct.images[0]
          );
        }
      });
    });
  } else {
    productList.innerHTML = '<p>No products found matching your search.</p>';
  }
}

//  LANDING PAGE
document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');;
  const searchInput = document.getElementById('search');
  const searchButton = document.querySelector('.search-icon-btn');

  

  if (productList) {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((products) => {
        allProducts = products; 
        handleSearch(''); 
        
        productList.innerHTML = products
          .map(
            (product) => `
                        <div class="product-card" data-product-id="${product.id}">
                            <img src="${product.images[0]}" alt="${product.title}">
                            <h3>${product.title}</h3>
                            <p>₦${product.price}</p>
                            <button class="add-to-cart-btn">
                                Add to Cart
                            </button>
                        </div>
                        `
          )
          .join('');

        document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
          button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.productId;

            const selectedProduct = products.find((p) => p.id == productId);

            if (selectedProduct) {
              addToCart(
                selectedProduct.id,
                selectedProduct.title,
                selectedProduct.price,
                selectedProduct.images[0]
              );
            }
          });
        });
      });
  }
  updateCartCount();
});

// ADD TO CART 
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

//  CART PAGE 
function renderCartPage() {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p >Your cart is empty</p>';
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
                    <button  onclick="removeItem(${index})">Remove</button>
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

//  CHECKOUT PAGE
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
