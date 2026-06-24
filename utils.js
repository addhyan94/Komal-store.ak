// utils js file jo sare html me same function use ho rahe hai 

function showError(message = "Something went wrong") {

  const container = document.getElementById("errorContainer");
  if (!container) return;

  const errorBox = document.createElement("div");

  errorBox.innerHTML = `
  <div class="error-card-main-div">
    
    <div class="main-icon-containor-box">
      ❌
    </div>

    <div class="msg-text-continour-box">
      <p class="msg-txt-test">Error</p>
      <p class="msg-sub-txt-text">${message}</p>
    </div>

    <span class="main-cross-icon-sign">✖</span>
  </div>
  `;

  const box = errorBox.firstElementChild;

  container.appendChild(box);

  box.querySelector(".main-cross-icon-sign").onclick = () => {
    box.remove();
  };

  setTimeout(() => {
    box.remove();
  }, 3000);
}

function showPopup(title, sub) {
  const container = document.getElementById("popupMsg");

  const popup = document.createElement("div");
  popup.className = "card";

  popup.innerHTML = `
    <div class="icon-container">✔</div>

    <div class="message-text-container">
      <p class="message-text">${title}</p>
      <p class="sub-text">${sub}</p>
    </div>

    <div class="cross-icon">✖</div>
  `;

  container.appendChild(popup);

  //click karne per close ho jayega...
  popup.querySelector(".cross-icon").onclick = () => {
    popup.remove();
  };

  // aapne aap gayab ho jayega 2.5 sec me
  setTimeout(() => {
    popup.remove();
  }, 2500);
}
