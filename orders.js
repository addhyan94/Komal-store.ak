//  Order.js file .. 
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.user_id) {
  window.location.href = "account.html";
}
let orders = [];
async function loadOrders() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    orders = [];
    return;
  }

  const response = await fetch(
    `https://komal-store-ak.onrender.com/api/onlymyorders/${user.user_id}`
  );

  const result = await response.json();

  if (!result.success) {
    orders = [];
    return;
  }

  orders = [];

  result.orders.forEach(order => {

    order.items.forEach(item => {

      orders.push({
        order_id: order.order_id,
        id: item.product_id,
        name: item.product_name,
        img: item.image_url,
        qty: item.qty,
        price: item.price,
        sellingPrice: item.offer_price,
        offerType: item.offer_type,
        total: order.total_amount,
        fees: 0,
        status: "placed",
        statusText: "Order Placed",
        sub: "Your order has been placed",
        color: "-",
        size: "-",
        category: item.category || ""
      });
    });
  });
}
const containerDesktop = document.getElementById("ordersContainerDesktop");
const noMoreWrapDesktop = document.getElementById("noMoreWrapDesktop");

function renderOrdersDesktop(list) {
  containerDesktop.innerHTML = "";

  if (!list || list.length === 0) {
    containerDesktop.innerHTML = `<div class="empty-state">No orders found</div>`;
    noMoreWrapDesktop.style.display = "none";
    return;
  }
  noMoreWrapDesktop.style.display = "block";

  list.forEach(order => {
    const dotClass = order.status === "delivered" ? "green" : "orange";

    const sizeLine = order.size
      ? `Color: ${order.color}&nbsp;&nbsp;Size: ${order.size}`
      : `Color: ${order.color}`;

    containerDesktop.innerHTML += `
        <div class="order-card">
          <div class="order-left">
            <img src="${order.img}" alt="${order.name}">
            <div class="order-info">
              <h4>${order.name}</h4>
              <div class="meta">${sizeLine}&nbsp;&nbsp;Qty: ${order.qty}</div>
              <div class="order-id"><a href="#" onclick="event.preventDefault(); toggleDetailsDesktop(${order.order_id})">Order ID : #${order.order_id}</a></div>
            </div>
          </div>

          <div class="order-price">₹${order.price}</div>

          <div class="order-status">
            <div class="status-line"><span class="dot ${dotClass}"></span>${order.statusText}</div>
            <div class="status-sub">${order.sub}</div>
            <button class="buy-btn" onclick="buyAgain(${order.id})">Buy Again</button>
          </div>
        </div>
      `;
  });
}

function filterOrdersDesktop() {
  const q = document.getElementById("orderSearchDesktop").value.toLowerCase().trim();
  if (!q) { renderOrdersDesktop(orders); return; }
  const filtered = orders.filter(o =>
    o.name.toLowerCase().includes(q) || String(o.id).includes(q)
  );
  renderOrdersDesktop(filtered);
}

function toggleDetailsDesktop(id) {
  alert("Order ID: #" + id);
}
const containerMobile = document.getElementById("ordersContainerMobile");
const noMoreOrdersMobile = document.getElementById("noMoreOrdersMobile");
let currentMobileFilter = "All";

function renderOrdersMobile() {
  containerMobile.innerHTML = "";

  let list = orders;
  if (currentMobileFilter !== "All") {
    list = orders.filter(o => o.category === currentMobileFilter);
  }

  const q = document.getElementById("orderSearchMobile").value.toLowerCase().trim();
  if (q) {
    list = list.filter(o => o.name.toLowerCase().includes(q) || String(o.id).includes(q));
  }

  if (list.length === 0) {
    containerMobile.innerHTML = `<div class="m-empty-state">No orders found</div>`;
    noMoreOrdersMobile.style.display = "none";
    return;
  }
  noMoreOrdersMobile.style.display = "block";

  list.forEach(order => {
    const dotClass = order.status === "delivered" ? "green" : "orange";

    containerMobile.innerHTML += `
        <div class="m-order-card" id="m-card-${order.order_id}-${order.id}">
          <div class="m-order-row" onclick="toggleMobileCard('${order.order_id}-${order.id}')">
            <img src="${order.img}" alt="${order.name}">
            <div class="m-order-main">
              <div class="m-order-status-text">
                <span class="m-dot ${dotClass}"></span>
                ${order.statusText}
              </div>
              <div class="m-order-name">${order.name}</div>
              <div class="m-order-id"><span class="label">Order ID :</span> <span class="value">#${order.order_id}</span></div>
            </div>
            <div class="m-chevron-wrap"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg></div>
          </div>

          <div class="m-price-details">
            <h3>Price details</h3>
            <div class="m-price-box">
              <div class="m-pd-title">${order.name}</div>
              <div class="m-price-line"><span>MRP <span class="m-info-dot">i</span></span><span>₹${order.price}</span></div>
              <div class="m-price-line"><span>Selling price <span class="m-info-dot">i</span></span><span>₹${order.sellingPrice}</span></div>
              <div class="m-price-line"><span>Discount</span><span> ${order.offerType}</span></div>
              <div class="m-price-line"><span>Quantity</span><span>${order.qty}</span></div>
              <div class="m-price-line"><span>Category</span><span>${order.category}</span></div>
              <div class="m-price-line"><span>fees</span><span>₹${order.fees}</span></div>
              <div class="m-price-total"><span>Total amount</span><span>₹${order.total}</span></div>
            </div>
            <button class="m-buy-again-btn" onclick="event.stopPropagation(); buyAgain(${order.id})">Buy Again</button>
          </div>
        </div>
      `;
  });
}

function toggleMobileCard(id) {

  const card = document.getElementById("m-card-" + id);

  if (!card) return;

  const wasOpen = card.classList.contains("open");

  document
    .querySelectorAll(".m-order-card.open")
    .forEach(c => c.classList.remove("open"));

  if (!wasOpen) {
    card.classList.add("open");
  }

}
function setMobileFilter(filter) {
  currentMobileFilter = filter;
  document.querySelectorAll(".m-filter-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.filter === filter);
  });
  renderOrdersMobile();
}
function filterOrdersMobile() { renderOrdersMobile(); }

function buyAgain(id) {
  window.location.href = "index.html#Best-products";
  setTimeout(() => {
    const btn = document.querySelector(`[onclick="addToCart(${id})"]`);
    if (btn) btn.click();
  }, 500);
}

(async () => {

  await loadOrders();

  renderOrdersDesktop(orders);

  renderOrdersMobile();

})();