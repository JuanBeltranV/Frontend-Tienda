// carrito.js
import { $, precioCLP } from './utils.js';

const CART_KEY = 'chetanga_cart';

// --- Helpers de storage ---
function getCart(){
    try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
    return [];
    }
}
function setCart(arr){
    localStorage.setItem(CART_KEY, JSON.stringify(arr));
    updateHeaderCount(arr);
}
function updateHeaderCount(arr){
    const el = $('#cartCount');
    const cart = Array.isArray(arr) ? arr : getCart();
    const qty = cart.reduce((sum, it) => sum + (it.cant || 1), 0);
    if (el) el.textContent = qty;
}

// --- API pública ---
export function actualizarCarrito(){
    updateHeaderCount();
}

/**
 * Agrega un producto (objeto completo) con cantidad 1 o suma si ya existe
 * @param {{id:number, nombre:string, precio:number, imagen:string}} prod
 */
export function agregarCarritoBasico(prod){
    let cart = getCart();
    const idx = cart.findIndex(it => it.id === prod.id);
    if (idx >= 0){
    cart[idx].cant = (cart[idx].cant || 1) + 1;
    } else {
    cart.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        imagen: prod.imagen,
        cant: 1
    });
    }
    setCart(cart);
}

/**
 * Renderiza la página del carrito (si estamos en carrito.html)
 */
export function renderCarritoPage(){
    const cont = $('#carritoLista');
  if (!cont) return; // no estamos en carrito

    let cart = getCart();

    if (!cart.length){
    cont.innerHTML = `<p class="muted">Tu carrito está vacío.</p>`;
    } else {
    cont.innerHTML = cart.map(it => `
        <div class="cart-row" data-id="${it.id}">
        <img class="cart-thumb" src="${it.imagen}" alt="${it.nombre}">
        <h3 class="cart-name">${it.nombre}</h3>

        <div class="cart-price">${precioCLP(it.precio)}</div>

        <div class="cart-qty">
            <button class="qty-dec" aria-label="Disminuir">-</button>
            <span class="qty">${it.cant || 1}</span>
            <button class="qty-inc" aria-label="Aumentar">+</button>
        </div>

        <div class="cart-line">${precioCLP(it.precio * (it.cant || 1))}</div>

        <div class="cart-actions">
            <button class="rm">Quitar</button>
        </div>
        </div>
    `).join('');
    }

  // Totales
    paintTotals(cart);

  // Listeners fila a fila
    cont.querySelectorAll('.qty-inc').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.cart-row');
        const id = Number(row?.dataset.id);
        cart = getCart();
        const item = cart.find(x => x.id === id);
        if (!item) return;
        item.cant = (item.cant || 1) + 1;
        setCart(cart);
      // re-render
        renderCarritoPage();
    });
    });

    cont.querySelectorAll('.qty-dec').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.cart-row');
        const id = Number(row?.dataset.id);
        cart = getCart();
        const item = cart.find(x => x.id === id);
        if (!item) return;
        item.cant = Math.max(1, (item.cant || 1) - 1);
        setCart(cart);
        renderCarritoPage();
    });
    });

    cont.querySelectorAll('.rm').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.cart-row');
        const id = Number(row?.dataset.id);
        cart = getCart().filter(x => x.id !== id);
        setCart(cart);
        renderCarritoPage();
    });
    });

  // Botones inferiores
    $('#btnVaciar')?.addEventListener('click', () => {
    setCart([]);
    renderCarritoPage();
    });

    $('#btnPagar')?.addEventListener('click', () => {
    const c = getCart();
    if (!c.length){ alert('Tu carrito está vacío.'); return; }
    alert('Compra realizada (demo). ¡Gracias!');
    setCart([]);
    renderCarritoPage();
    });
}

// --- Totales ---
function calcTotals(cart){
  const subtotal = cart.reduce((sum, it) => sum + it.precio * (it.cant || 1), 0);
  const envio = cart.length ? 0 : 0; // puedes cambiar la lógica si quieres
    const total = subtotal + envio;
    return { subtotal, envio, total };
}
function paintTotals(cart){
    const { subtotal, envio, total } = calcTotals(cart);
    const subEl = $('#cartSubtotal');
    const envEl = $('#cartEnvio');
    const totEl = $('#carritoTotal');
    if (subEl) subEl.textContent = precioCLP(subtotal);
    if (envEl) envEl.textContent = precioCLP(envio);
    if (totEl) totEl.textContent = precioCLP(total);
}
