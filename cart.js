// Cart.js file ->
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartDiv = document.getElementById("cartItems");

let mrpTotal = 0;
let finalTotal = 0;
let totalDiscount = 0;

function renderCart() {
    const summary_card = document.getElementById("summary-card");
    mrpTotal = 0;
    finalTotal = 0;
    totalDiscount = 0;
    if (cart.length === 0) {
        summary_card.style.display = "none"

        cartDiv.innerHTML = `

    <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h2>Your Cart is Empty</h2>
        <p>Add products to place your first order.</p>
<button class="place-btn continue-shoping-emptybtn"onclick="goHome()">Continue Shopping</button>

    </div>`;

        document.getElementById("subtotal").innerText = "0";
        document.getElementById("total").innerText = "0";
        const title = document.getElementById("priceDetailsTitle");
        title.innerText = "Price Details (0 Items)";
        return;

    }
    summary_card.style.display = "block";
    cartDiv.innerHTML = "";

    cart.forEach(item => {
        const mrp = Number(item.price);
        const offerPrice = item.offer && item.offer_price ? Number(item.offer_price) : mrp;
        mrpTotal += mrp * item.qty;
        finalTotal += offerPrice * item.qty;
        totalDiscount += (mrp - offerPrice) * item.qty;

        cartDiv.innerHTML += `
      <div class="card">

        <div class="remove" onclick="removeItem(${item.product_id})">✖ Remove</div>

        <div class="product">
          <img src="${item.image_url}">

          <div class="details">
            <h4>${item.name}</h4>

                <div class="price">${item.offer && item.offer_price ? `
                    <span class="offer-price">₹${item.offer_price}</span>
                        <span class="old-price">₹${item.price}</span>
                            <span class="discount-tag">${item.offer_text}</span>` : `
                                <span class="offer-price">₹${item.price}</span>`
            }
        </div>
            <p>All issue easy returns</p>
            <p>Quantity : ${item.qty}</p>

            <div class="qty">
              <button onclick="changeQty(${item.product_id}, -1)">-</button>
              ${item.qty}
              <button onclick="changeQty(${item.product_id}, 1)">+</button>
            </div>
          </div>
        </div>
      </div>`;
    });

    document.getElementById("subtotal").innerText = mrpTotal;
    document.getElementById("discount").innerText = totalDiscount;
    document.getElementById("savedMoney").innerText = totalDiscount;
    document.getElementById("total").innerText = finalTotal;
    const priceTitle = document.getElementById("priceDetailsTitle");
    if (priceTitle) priceTitle.innerText = `Price Details (${cart.length} Items)`;
    const badge = document.getElementById("mCartBadge");
    if (badge) badge.innerText = cart.length;
}

function changeQty(product_id, val) {
    const item = cart.find(i => i.product_id === product_id);
    if (!item) return;
    item.qty += val;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.product_id !== product_id);
    }
    updateCart();
}

function removeItem(product_id) {
    cart = cart.filter(i => i.product_id !== product_id);
    updateCart();
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

renderCart();

function showOrderPopup() {
    const container = document.getElementById("orderPopupContainer");
    container.innerHTML = `
  
  <div class="order-popup-card-style">
    <button class="cross-button-style" onclick="closeOrderPopup()">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="popup-card-header-style">
      <div class="tick-timage-style">
        ✔
      </div>

      <div class="card-text-items">
        <span class="card-titel-text">Order SuccessFull</span>
        <p class="card-main-text-message">
          Thank you for your purchase. your package will be delivered within 2 days.
        </p>
      </div>

      <div class="card-buttons-style">
        <button class="Continue-shoping-button-style" onclick="goHome()">Continue Shopping</button>
        <button class="go-to-order-button-style" onclick="openOrders()">My package</button>
      </div>
    </div>
  </div>`;
    container.style.display = "flex";
}

function closeOrderPopup() {
    document.getElementById("orderPopupContainer").style.display = "none";
}
function clearCart() {
    console.log("🧹 Clearing Cart...");
    console.log("Before clear - Cart Length:", cart.length);

    cart.length = 0;
    console.log("After clear - Cart Length:", cart.length);

    localStorage.setItem("cart", JSON.stringify([]));
    console.log("LocalStorage updated:", localStorage.getItem("cart"));

    renderCart();
    console.log("renderCart() called");

    showOrderPopup();
    console.log("showOrderPopup() called");
}

function buildOrder(user) {
    return {
        user: {
            user_id: user.user_id,
            name: `${user.first_name} ${user.last_name}`.trim(),
            phone: user.phone,
            address: user.address
        },
        items: cart.map(item => ({
            product_id: item.product_id,
            name: item.name,
            price: item.offer
                ? Number(item.offer_price)
                : Number(item.price),
            qty: item.qty
        })),

        total: finalTotal
    };

}

async function handlePlaceOrder() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            showError("Please login first to place order ❌");
            return;
        }

        const order = buildOrder(user);
        console.log("🛒 Order Building:", order);

        console.log("📤 Before Send");
        const result = await sendOrder(order);
        console.log("📥 After Send", result);

        if (!result || !result.success) {
            const errorMsg = result?.message || "Failed to place order";
            console.error("❌ Order Failed:", errorMsg);
            showError(errorMsg);
            return;
        }

        console.log("✅ Order Success - Clearing Cart");
        clearCart();
        console.log("✅ Cart Cleared Successfully");
    }
    catch (err) {
        console.error("❌ Error in handlePlaceOrder:", err);
        showError(err.message || "Something went wrong while placing order");
    }
}

async function sendOrder(order) {
    try {
        const response = await fetch(
            "https://komal-store-ak.onrender.com/api/cart/place-order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            }
        );

        console.log("📊 Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Server Error Response:", errorText);
            return {
                success: false,
                message: `Server Error: ${response.status}`
            };
        }

        const text = await response.text();
        console.log("📄 RAW RESPONSE TEXT:", text);

        if (!text || text.trim() === "") {
            console.warn("⚠️ Empty response from server");
            return { success: false, message: "Empty response from server" };
        }

        try {
            const parsed = JSON.parse(text);
            console.log("✅ Parsed Response:", parsed);
            return parsed;
        } catch (parseErr) {
            console.error("❌ JSON Parse Error:", parseErr.message);
            return {
                success: false,
                message: "Invalid response format from server"
            };
        }
    }
    catch (err) {
        console.error("❌ Fetch Error:", err.message);
        return {
            success: false,
            message: err.message || "Network error occurred"
        };
    }
}

const scrollFab = document.getElementById("scrollFab");
const scrollFabIcon = document.getElementById("scrollFabIcon");

function isNearBottom() {
    return (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 40);
}

function updateScrollFabIcon() {
    if (isNearBottom()) {
        scrollFabIcon.classList.remove("fa-arrow-down");
        scrollFabIcon.classList.add("fa-arrow-up");
    } else {
        scrollFabIcon.classList.remove("fa-arrow-up");
        scrollFabIcon.classList.add("fa-arrow-down");
    }
}

function handleScrollFab() {
    if (isNearBottom()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
    setTimeout(updateScrollFabIcon, 400);
}

window.addEventListener("scroll", updateScrollFabIcon);
window.addEventListener("resize", updateScrollFabIcon);
updateScrollFabIcon();