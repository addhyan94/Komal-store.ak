/* ----------------Add new products and edit  ---------------- */

const data = [
  // Stationery
  { id: 1, name: "Classmate Notebook", price: 25, img: "Assets/penimage.png" },
  { id: 2, name: "Natraj Pencil (10pcs)", price: 20, img: "Assets/penimage.png" },
  { id: 3, name: "Cello Pen (Blue)", price: 10, img: "Assets/penimage.png" },
  { id: 4, name: "Apsara Eraser", price: 5, img: "Assets/penimage.png" },
  { id: 5, name: "Sharpener", price: 10, img: "Assets/penimage.png" },

  // Glue & Office
  { id: 6, name: "Fevicol MR", price: 55, img: "Assets/penimage.png" },
  { id: 7, name: "File Folder", price: 30, img: "Assets/penimage.png" },
  { id: 8, name: "Register", price: 80, img: "Assets/penimage.png" },

  // Food Items
  { id: 9, name: "Cadbury Dairy Milk", price: 40, img: "Assets/penimage.png" },
  { id: 10, name: "KitKat", price: 20, img: "Assets/penimage.png" },
  { id: 11, name: "Perk Chocolate", price: 10, img: "Assets/penimage.png" },

  // Snacks
  { id: 12, name: "Lays Classic Chips", price: 20, img: "Assets/penimage.png" },
  { id: 13, name: "Kurkure", price: 20, img: "Assets/penimage.png" },

  // Drinks
  { id: 14, name: "Coca Cola", price: 40, img: "Assets/penimage.png" },
  { id: 15, name: "Pepsi", price: 40, img: "Assets/penimage.png" },

  // Daily Use
  { id: 16, name: "Surf Excel", price: 120, img: "Assets/penimage.png" },
  { id: 17, name: "Dettol Liquid", price: 90, img: "Assets/penimage.png" },

  // Cosmetics
  { id: 18, name: "Lipstick", price: 150, img: "Assets/penimage.png" },
  { id: 19, name: "Face Powder", price: 120, img: "Assets/penimage.png" },

  // Misc
  { id: 20, name: "Gift Item", price: 200, img: "Assets/penimage.png" },
  { id: 21, name: "Pen Box", price: 250, img: "Assets/penimage.png" }
];

const container = document.getElementById("products");
const cartItemsDiv = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ---------------- products card hover text show ---------------- */
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

/* ---------------- Card sidebar products ---------------- */
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

/* ---------------- autoupdate cart ---------------- */
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ---------------- checker cart  ---------------- */
function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
    totalPriceEl.innerText = 0;
    return;
  }

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

/* ---------------- add and discard cart products ---------------- */
function changeQty(id, change) {
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
}

/* ---------------- cart tonggle btn ---------------- */
function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("active");
}

/* ---------------- init ---------------- */
renderProducts();
renderCart();

/* ---------------- Scroll Btn Top Shop Now Button  ---------------- */

let topshopbtnn = document.getElementById("top-shop-btn");
let prdutidsection = document.getElementById("Best-products");
topshopbtnn.onclick = function () {
  prdutidsection.scrollIntoView({
    behavior: "smooth"
  });
}

