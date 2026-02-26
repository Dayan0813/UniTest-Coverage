const products = [
  {
    id: 1,
    name: "Alimento Premium",
    price: 50000,
    img: "pack-comida-cachorro-aislado-sobre-fondo-blanco.png",
  },
  {
    id: 2,
    name: "Juguete Hueso",
    price: 20000,
    img: "pngwing.com.png",
  },
  {
    id: 3,
    name: "Collar Ajustable",
    price: 15000,
    img: "pngwing.comm.png",
  },
  {
    id: 4,
    name: "Cama Mascota",
    price: 80000,
    img: "151150676_10504855.png",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const modalParent = document.getElementById("modal-parent");
const cartBtn = document.getElementById("cartBtn");
const closeBtn = document.querySelector(".close-modal");

function getImgPath(img) {
  return `Assets/${img}`;
}

function renderProducts() {
  productList.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
<img src="${getImgPath(p.img)}">
<h3>${p.name}</h3>
<strong>$${p.price.toLocaleString()}</strong>
<button class="add-btn">Agregar</button>
`;
    card.querySelector("button").addEventListener("click", () => addToCart(p));
    productList.appendChild(card);
  });
}

function addToCart(product) {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  item.quantity += delta;
  if (item.quantity <= 0) {
    // Solo eliminar el ítem, no cerrar el modal
    cart = cart.filter((i) => i.id !== id);
    updateCart();
  } else {
    updateCart();
  }
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCart();
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Restaurar carrito desde localStorage y asegurar que cada ítem tenga la imagen correcta
function loadCart() {
  const stored = localStorage.getItem("cart");
  cart = stored ? JSON.parse(stored) : [];
  // Asegurar que cada ítem tenga la propiedad img correcta
  cart.forEach((item) => {
    const prod = products.find((p) => p.id === item.id);
    if (prod) item.img = prod.img;
  });
}

// Llama a loadCart al inicio
loadCart();

// Modifica updateCart para guardar siempre
function updateCart() {
  saveCart();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;
  let totalCount = 0;

  cart.forEach((item) => {
    const totalItem = item.price * item.quantity;
    subtotal += totalItem;
    totalCount += item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-item-row">
        <img src="${getImgPath(item.img)}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-content">
          <strong>${item.name}:</strong>
          <div class="cart-item-info">
            <span>Precio: $${item.price.toLocaleString()}</span>
            <span>Cantidad: ${item.quantity}</span>
            <span>Total: $${totalItem.toLocaleString()}</span>
          </div>
          <div class="qty-controls">
            <button onclick="changeQty(${item.id},-1)">−</button>
            <button onclick="changeQty(${item.id},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${item.id})">Eliminar</button>
        </div>
      </div>
    `;
    cartItems.appendChild(div);
  });

  subtotalEl.textContent = "Subtotal: $" + subtotal.toLocaleString();
  cartCount.textContent = totalCount;
}

function toggleCart() {
  const isOpen = modalParent.style.display === "none";
  if (isOpen) {
    modalParent.style.display = "block";
    setTimeout(() => {
      modalParent.style.opacity = 1;
    }, 10);
  } else {
    modalParent.style.opacity = 0;
    setTimeout(() => {
      modalParent.style.display = "none";
    }, 200);
  }
}

// Asignar el evento al botón
if (cartBtn) {
  cartBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleCart(e);
  });
}
// Cerrar modal solo con fondo o botón X
if (modalParent) {
  modalParent.querySelector(".modal-bg").onclick = toggleCart;
}
if (closeBtn) {
  closeBtn.onclick = toggleCart;
}

renderProducts();
renderCart();
