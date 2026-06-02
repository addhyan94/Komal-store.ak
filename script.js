// Main Js file 

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
  showToast("Item added to cart ✔");
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
        <img src="${item.img}">

        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>

          <div class="qty-box">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  totalPriceEl.innerText = total;
}
// function renderCart() {
//   cartItemsDiv.innerHTML = "";
//   let total = 0;

//   if (cart.length === 0) {
//     cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
//     totalPriceEl.innerText = 0;
//     return;
//   }

//   cart.forEach(item => {
//     total += item.price * item.qty;

//     cartItemsDiv.innerHTML += `
//       <div class="cart-item">
//         <h4>${item.name}</h4>
//         <p>₹${item.price} x ${item.qty}</p>

//         <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
//         <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
//       </div>
//     `;
//   });

//   totalPriceEl.innerText = total;
// }

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

/* ---------------- close cart kahi bhi click karne per  ----------------*/
document.addEventListener("click", function (e) {
  const cartPanel = document.getElementById("cartPanel");

  if (cartPanel.classList.contains("active")) {


    if (cartPanel.contains(e.target)) return;


    if (e.target.closest("[onclick='toggleCart()']")) return;

    cartPanel.classList.remove("active");
  }
});

// document.addEventListener("click", function (e) {

//   const cartPanel = document.getElementById("cartPanel");

//   if (cartPanel.classList.contains("active")) {

//    if (
//   !cartPanel.contains(e.target) &&
//   !e.target.closest("#cartPanel") &&
//   !e.target.closest("[onclick='toggleCart()']")
// ) {
//       cartPanel.classList.remove("active");
//     }
//   }
// });

/* ----------------Close cart esc btn click karne per ----------------*/
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("cartPanel").classList.remove("active");
  }
});
/* ----------------Clear button in cart ----------------*/
function clearCart() {
  cart = [];
  updateCart();
}

/* ---------------- CLEAN SEARCH SYSTEM ---------------- */

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  if (!value) {
    suggestionsBox.style.display = "none";
    return;
  }
  const filtered = data
    .filter(item => item.name.toLowerCase().includes(value))
    .slice(0, 6); // max 6 items only

  if (filtered.length === 0) {
    suggestionsBox.innerHTML = `
      <div style="color:gray;">No results found</div>
    `;
  } else {
    suggestionsBox.innerHTML = filtered.map(item => `
      <div onclick="selectProduct(${item.id})">
        ${item.name}
      </div>
    `).join("");
  }

  suggestionsBox.style.display = "block";
});

/* click select */
function selectProduct(id) {
  const product = data.find(item => item.id === id);
  searchInput.value = product.name;

  container.innerHTML = `
    <div class="product">
      <img src="${product.img}">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `;

  suggestionsBox.style.display = "none";

  document.querySelector(".products").scrollIntoView({
    behavior: "smooth"
  });
}

/* ENTER search */
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = this.value.toLowerCase();

    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(value)
    );

    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = "<h3>No products found</h3>";
    } else {
      filtered.forEach(item => {
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

    suggestionsBox.style.display = "none";
    document.querySelector(".products").scrollIntoView({
      behavior: "smooth"
    });
  }
});

/* ---------------- ACCOUNT SYSTEM ---------------- */

// check on page load
window.addEventListener("load", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  const popup = document.getElementById("accountPopup");

  if (!user && popup) {
    popup.style.display = "flex";
  }
});

// window.onload = function () {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!user) {
//     document.getElementById("accountPopup").style.display = "flex";
//   }
// };

// save account
function saveAccount() {
  const errorBox = document.getElementById("formError");

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const phone2 = document.getElementById("phone2").value.trim();
  const address = document.getElementById("address").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const landmark = document.getElementById("landmark").value.trim();

  errorBox.innerText = "";

  if (!name || !phone || !address || !pincode || !landmark) {
    errorBox.innerText = "All fields are required ❌";
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    errorBox.innerText = "Phone must be exactly 10 digits ❌";
    return;
  }

  if (phone2 && !/^[0-9]{10}$/.test(phone2)) {
    errorBox.innerText = "Second phone must be 10 digits ❌";
    return;
  }

  const user = { name, phone, phone2, address, pincode, landmark };

  localStorage.setItem("user", JSON.stringify(user));

  document.getElementById("accountPopup").style.display = "none";

  showToast("Account created successfully ✅");
}

// function saveAccount() {
//   const user = {
//     name: document.getElementById("name").value,
//     phone: document.getElementById("phone").value,
//     phone2: document.getElementById("phone2").value,
//     address: document.getElementById("address").value,
//     pincode: document.getElementById("pincode").value,
//     landmark: document.getElementById("landmark").value
//   };

//   localStorage.setItem("user", JSON.stringify(user));

//   document.getElementById("accountPopup").style.display = "none";
//  showToast("Account created successfully ✅");
// }


function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function goToAccount() {
  window.location.href = "account.html";
}