const data = [
  {
    id: 1,
    name: "Notebook",
    price: 25,
    img: "Assets/penimage.png"
  },
  {
    id: 2,
    name: "Pencil",
    price: 20,
    img: "Assets/penimage.png"
  },
  {
    id: 3,
    name: "Pen",
    price: 10,
    img: "Assets/penimage.png"
  }
];

const container = document.getElementById("products");
const cartItemsDiv = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Render Products */
function renderProducts() {
  container.innerHTML = "";

  data.forEach(item => {
    container.innerHTML += `
      <div class="product">
        <img src="${item.img}">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    `;
  });
}

/* Add to Cart */
function addToCart(id) {
  const item = data.find(p => p.id === id);

  const existing = cart.find(p => p.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
}

/* Update Cart */
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* Render Cart */
function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>₹${item.price} x ${item.qty}</p>

        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
  });

  totalPriceEl.innerText = total;
}

/* Change Quantity */
function changeQty(id, change) {
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
}

/* INIT */
renderProducts();
renderCart();