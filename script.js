// Main Js file first.html and Webshite JS file

let data = [];
async function loadProducts() {
  const res = await fetch(
    "http://localhost:3000/api/products"
  );

  const result = await res.json();

  data = result.products;
  mobileProductsShown = 18;
  renderProducts();
  renderCategorySections();
  renderOfferProducts();
  mobileOffersShown = 20;
  renderNewArrivals();
  checkUserLogin();
}

window.addEventListener("load", loadProducts);
function checkUserLogin() {

    const user = JSON.parse(localStorage.getItem("user"));

    const popup = document.getElementById("accountPopup");

    if (!popup) return;

    if (user) {
        popup.style.display = "none";
    } else {
        popup.style.display = "flex";
    }

}

const container = document.getElementById("products");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
function createProductCard(item) {
  return `
<div class="product">
<img
src="${item.image_url}"
alt="Wait"
loading="lazy">
<h4>${item.name}</h4>
${getPriceHTML(item)}
<button onclick="addToCart(${item.product_id})">Add To Cart</button>
</div>`;
}
function renderProducts() {
  container.innerHTML = "";
  data.forEach(item => {
    container.innerHTML += createProductCard(item);
  });
}

// Ceprateee categoryy card system ... 
function renderCategorySections() {
  const sectionColors = [
    "#cbf5e6",
    "#f9e7cd",
    "#c0d4fa",
    "#f8d1de",
    "#bcccf1",
    "#f4fff1",
    "#fffbea",
    "#eefcff",
    "#f9f3ff",
    "#fff4ef",
    "#edfdf3",
    "#f7f7ff"
  ];

  const container = document.getElementById("categorySections");

  container.innerHTML = "";
  const categories = [...new Set(data.map(p => p.category))];

  categories.forEach((cat, index) => {
    const bgColor = sectionColors[index % sectionColors.length];
    const products = data.filter(p => p.category === cat);
    const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
    const id = cat.toLowerCase().replace(/\s+/g, "");
    const firstProducts = window.innerWidth <= 768 ? products.slice(0, 3) : products.slice(0, 5);

    const remainingProducts = window.innerWidth <= 768 ? products.slice(3) : products.slice(5);

    const showMore = window.innerWidth <= 768 ? products.length > 3 : products.length > 5;
    container.innerHTML += `
<section id="${id}" class="category-down-section" style="background:${bgColor};">
<div class="category-down-header">
<div class="category-down-title">
📦 <span>Best in ${categoryName}</span>
</div>

${showMore ? `
<div class="category-see-more"
onclick="toggleCategory('${id}')">
<span id="text-${id}">See More</span>
<i id="icon-${id}" class="fa-solid fa-angle-down"></i>
</div>` : ""}
</div>

<div class="down-category-products">
${firstProducts.map(item => createProductCard(item)).join("")}
</div>

${showMore ? `
<div id="extra-${id}" class="extra" style="display:none;">
${remainingProducts.map(item => createProductCard(item)).join("")}
</div>` : ""}

</section>`;
  });
}

function toggleCategory(id) {
  const extra = document.getElementById("extra-" + id);
  const icon = document.getElementById("icon-" + id);
  const text = document.getElementById("text-" + id);
  if (!extra) return;

  if (extra.style.display === "grid") {
    extra.style.display = "none";
    icon.classList.remove("fa-angle-up");
    icon.classList.add("fa-angle-down");
    text.innerText = "See More";
  } else {
    extra.style.display = "grid";
    icon.classList.remove("fa-angle-down");
    icon.classList.add("fa-angle-up");
    text.innerText = "Show Less";
  }

}
function mobileViewMoreOffers() {
  mobileOffersShown += 20;
  renderOfferProducts();
}

let mobileOffersShown = 20;

function renderOfferProducts() {
  const container = document.getElementById("offerProducts");
  container.innerHTML = "";
  const offers = data.filter(item => item.offer);
  const offersToShow = window.innerWidth <= 768 ? offers.slice(0, mobileOffersShown) : offers;

  if (offers.length === 0) {
    return;
  }
  container.innerHTML = `
<section class="category-down-section">
<div class="category-down-header">
<div class="category-down-title">
<i class="fa-regular fa-id-badge"></i>
<span>Today's Best Offers</span>
</div>
</div>
<div class="down-category-products" id="offerCards"></div>

</section>`;

  const offerCards = document.getElementById("offerCards");
  offersToShow.forEach(item => {
    offerCards.innerHTML += createProductCard(item);
  });
}
function renderNewArrivals() {
  const container = document.getElementById("newArrivalCards");
  const section = document.getElementById("newArrivalSection");
  const now = Date.now();
  const arrivals = data.filter(item => {
    const created = new Date(item.created_at).getTime();
    return item.price >= 50 &&
      (now - created) < 86400000;
  });

  if (arrivals.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  container.innerHTML = "";
  arrivals.forEach(item => {
    container.innerHTML += createProductCard(item);
  });

  if (arrivals.length > 5) {
    container.innerHTML += container.innerHTML;
    container.classList.add("auto-slide");
  } else {
    container.classList.remove("auto-slide");
  }
  startArrivalTimer(arrivals);
}

function startArrivalTimer(arrivals) {
  if (arrivals.length == 0) return;

  const timer = document.getElementById("arrivalTimer");

  function update() {
    const oldest = Math.min(...arrivals.map(x => new Date(x.created_at).getTime()));
    const left = 86400000 - (Date.now() - oldest);
    if (left <= 0) {
      renderNewArrivals();
      clearInterval(interval);
      return;
    }

    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);

    timer.innerHTML =
      String(h).padStart(2, "0") + ":" +
      String(m).padStart(2, "0") + ":" +
      String(s).padStart(2, "0");
  }
  update();
  const interval = setInterval(update, 1000);
}

function addToCart(product_id) {
  const item = data.find(p => p.product_id === product_id);
  if (!item) {
    showError("Product not found ❌");
    return;
  }
  const existing = cart.find(p => p.product_id === product_id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
  showPopup("Item added to cart ✅", "Check in your cart");
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
/* poster ................................................................. */
const images = [
  "Posters/Komal Chand Journal Store Poster..jpg",
  "Posters/BACK_TO_SCHOOL.jpg",
  "Posters/CRAVINGS.jpg",
  "Posters/WHY_SHOP_WITH_US.jpg",
  "Posters/Everything_You_Need.jpg",
  "Posters/Komal Chand Journal Store Poster 2.jpg"
];

const heroImage = document.getElementById("heroImage");

let currentIndex = 0;

setInterval(() => {
  heroImage.style.opacity = "0";
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % images.length;
    heroImage.src = images[currentIndex];
    heroImage.style.opacity = "1";
  }, 500);
}, 6000);/* her 6 sec me image change hogii */

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");
const clearSearchBtn = document.getElementById("clearSearch");
searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  if (!value) {
    suggestionsBox.style.display = "none";
    clearSearchBtn.classList.remove("show");
    renderProducts();
    return;
  }

  clearSearchBtn.classList.add("show");

  const filtered = data
    .filter(item => item.name.toLowerCase().includes(value))
    .slice(0, 6); // max 6 items only..

  if (filtered.length === 0) {
    suggestionsBox.innerHTML = `
      <div style="color:gray;">No results found</div>`;
  } else {
    suggestionsBox.innerHTML = filtered.map(item => `
      <div onclick="selectProduct(${item.product_id})">
        ${item.name}
      </div>
    `).join("");
  }
  suggestionsBox.style.display = "block";
});

clearSearchBtn.addEventListener("click", function () {
  searchInput.value = "";
  suggestionsBox.style.display = "none";
  clearSearchBtn.classList.remove("show");
  renderProducts();
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search")) {
    suggestionsBox.style.display = "none";
  }
});

searchInput.addEventListener("input", function () {
  if (!this.value.trim()) renderProducts();
});

function selectProduct(product_id) {
  const product = data.find(item => item.product_id === product_id);
  searchInput.value = product.name;
  clearSearchBtn.classList.add("show");
  container.innerHTML = createProductCard(product);
  suggestionsBox.style.display = "none";
  document.querySelector(".products").scrollIntoView({
    behavior: "smooth"
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const value = this.value.toLowerCase();
      clearSearchBtn.classList.add("show");
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(value)
      );

      container.innerHTML = "";

      if (filtered.length === 0) {
        container.innerHTML = "<h3>No products found</h3>";
      } else {
        filtered.forEach(item => {
          container.innerHTML += createProductCard(item);
        });
      }

      suggestionsBox.style.display = "none";
      document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
    }
  });
}
function clearErrors() {
  document.querySelectorAll(".input-error").forEach(e => e.innerText = "");
  document.querySelectorAll("input").forEach(i => i.classList.remove("input-invalid"));
}

function setError(id, msg) {
  document.getElementById(id + "Error").innerText = msg;
  document.getElementById(id).classList.add("input-invalid");
}

function saveAccount() {
  clearErrors();
  const errorBox = document.getElementById("formError");
  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const landmark = document.getElementById("landmark").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  errorBox.innerText = "";
  let valid = true;

  if (fname == "") {
    setError("fname", "First name required");
    valid = false;
  }
  else if (!/^[A-Za-z ]+$/.test(fname)) {
    setError("fname", "Only letters allowed");
    valid = false;
  }

  if (lname == "") {
    setError("lname", "Last name required");
    valid = false;
  }

  else if (!/^[A-Za-z ]+$/.test(lname)) {
    setError("lname", "Only letters allowed");
    valid = false;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    setError("phone", "Enter valid 10 digit number");
    valid = false;
  }

  if (!emailRegex.test(email)) {
    setError("email", "Enter valid email");
    valid = false;
  }

  if (address == "") {
    setError("address", "Address required");
    valid = false;
  }

  if (!/^\d{6}$/.test(pincode)) {
    setError("pincode", "Invalid pincode");
    valid = false;
  }

  if (landmark == "") {
    setError("landmark", "Landmark required");
    valid = false;
  }

  if (!/[0-9]/.test(password)) {
    setError("password", "Must atlest 1 number");
    valid = false;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    setError("password", "Must atlest 1 special character");
    valid = false;
  }

  if (password.length < 8) {
    setError("password", "Minimum 8 characters");
    valid = false;
  }

  if (password !== confirmPassword) {
    setError("confirmPassword", "Passwords do not match");
    valid = false;
  }

  if (!valid) return;

  fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ first_name: fname, last_name: lname, email, phone, password, address, landmark, pincode })
  })

    .then(res => res.json())
    .then(result => {
      if (!result.success) {
        if (result.message.includes("Email")) {
          setError("email", result.message);
        }
        else if (result.message.includes("Phone")) {
          setError("phone", result.message);
        }
        else {
          showError(result.message);
        }
        return;
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      document.getElementById("accountPopup").style.display = "none";
      showPopup("Account Created ✅", "Welcome to Komal Store");
    })

    .catch(() => {
      errorBox.innerText =
        "Server Error ❌";
    });
}
document.getElementById("phone").addEventListener("input", function () {
  this.value = this.value
    .replace(/\D/g, "")
    .slice(0, 10);

});
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
document.getElementById("fname").addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-Z ]/g, "");
});

document.getElementById("lname").addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");
  });

function showLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}
//  account login karne bale functions 

async function loginAccount() {
  const loginError = document.getElementById("loginError");
  loginError.innerText = "";
  const loginUser = document
    .getElementById("loginUser").value.trim();

  const password = document
    .getElementById("loginPassword").value.trim();
  try {
    const res = await fetch(
      "http://localhost:3000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          loginUser,
          password
        })
      }
    );

    const result = await res.json();
    if (!result.success) {
      loginError.innerText = result.message;
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(result.user)
    );

    document.getElementById("accountPopup").style.display = "none";

    showPopup(
      "Login Successful ✅","Welcome " + result.user.first_name
    );
  }

  catch (err) {
    loginError.innerText ="Server Error ❌";
  }
}



function closePopup() {
  document.getElementById("popupMsg").style.display = "none";
}

function toggleMore() {
  document.getElementById("extraCategory").classList.toggle("show");
}

function scrollCategory(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

const header = document.querySelector(".header");
const categoryTop = document.querySelector(".category-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("sticky-shadow");
    categoryTop.classList.add("sticky-shadow");
  } else {
    header.classList.remove("sticky-shadow");
    categoryTop.classList.remove("sticky-shadow");
  }
});

(function () {
  const u = JSON.parse(localStorage.getItem("user"));
  const el = document.getElementById("mWelcomeName");
  if (u && el) {
    el.innerText = u.first_name || u.name || "Guest";
  } else if (el) {
    el.innerText = "Guest";
  }
})();

function mobileSyncSearch(val) {
  const si = document.getElementById("searchInput");
  if (!si) return;
  si.value = val;
  si.dispatchEvent(new Event("input"));
}
function mobileSyncKeydown(e) {
  const si = document.getElementById("searchInput");
  if (!si) return;
  if (e.key === "Enter") si.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
}

let mobileShowAll = false;
function mobileViewMoreProducts() {
  document.getElementById("mobileViewMore").style.display = "none";
  renderProducts();
}

let mobileProductsShown = 18;

function mobileViewMoreProducts() {
  mobileProductsShown += 18;
  renderProducts();
}

const _origRenderProducts = window.renderProducts;
if (typeof _origRenderProducts === "function") {
  window.renderProducts = function () {
    _origRenderProducts();
    if (window.innerWidth <= 768) {
      const grid = document.getElementById("products");
      const cards = grid.querySelectorAll(".product");
      cards.forEach((card, index) => {
        card.style.display = index < mobileProductsShown ? "" : "none";
      });
      const btn = document.getElementById("mobileViewMore");
      if (btn) {
        if (mobileProductsShown >= cards.length) {
          btn.style.display = "none";
        } else {
          btn.style.display = "block";
        }
      }
    }
  };
}

/*number dalna hai .......................................................... */
function openWhatsAppSupport() {
  window.open("https://wa.me/919999999999", "_blank");
}
function callStore() {
  window.location.href = "tel:9999999999";
}

function getPriceHTML(item) {
  if (!item.offer) {
    return `
        <div class="price-box">
            <span class="normal-price">
                ₹${item.price}
            </span>
        </div>`;
  }

  let badge = "";
  if (
    item.offer_type === "percent" ||
    item.offer_type === "Percent" ||
    item.offer_type === "%"
  ) {
    badge = item.offer_text || `${item.offer_value}% OFF`;
  }

  else if (
    item.offer_type === "flat" ||
    item.offer_type === "Flat"
  ) {
    badge = item.offer_text || `Flat ₹${item.offer_value} OFF`;
  }

  else if (
    item.offer_type === "buy1get1" ||
    item.offer_type === "buy1" ||
    item.offer_type === "Buy1get1" ||
    item.offer_type === "Buy1"
  ) {
    badge = item.offer_text || "Buy 1 Get 1 FREE";
  }
  return `
<div class="price-box">
<span class="offer-price">
₹${item.offer_price}
</span>

<span class="old-price">
₹${item.price}
</span>
</div>
${badge ? `<div class="offer-badge">
${badge}
</div>` : ""}
`;
}
