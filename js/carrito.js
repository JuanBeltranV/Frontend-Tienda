import { $ , precioCLP } from './utils.js';

const CART_KEY = 'chetanga_cart';

// Normaliza posibles estructuras antiguas
function normalizeCart(raw){
    if (!Array.isArray(raw)) return [];
    const byId = new Map();
    for (const it of raw){
    if (!it || typeof it !== 'object') continue;
    const id = Number(it.id);
    if (!id) continue;
    const cant = Math.max(1, Number(it.cant || 0) || 1);
    const precio = Number(it.precio) || 0;
    const base = byId.get(id) || {
        id, nombre: it.nombre || '', precio, imagen: it.imagen || '', cant: 0
    };
    base.cant += cant;
    byId.set(id, base);
    }
    return [...byId.values()];
}

export function loadCart(){
    try { return normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || '[]')); }
    catch { return []; }
}
export function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

export const cartCount = (cart) => cart.reduce((acc, it)=> acc + (it.cant||0), 0);
export const cartSubtotal = (cart) => cart.reduce((acc, it)=> acc + it.precio * (it.cant||0), 0);

export function agregarCarritoBasico(producto){
    const cart = loadCart();
    const i = cart.findIndex(x=>x.id === producto.id);
    if (i>=0){ cart[i].cant = (cart[i].cant||0) + 1; }
    else { cart.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, cant: 1 }); }
    saveCart(cart);
    actualizarCarrito();
}

export function quitarCarrito(id){
    const cart = loadCart().filter(x => x.id !== id);
    saveCart(cart); actualizarCarrito(); renderCarritoPage();
}

export function setCantidad(id, nueva){
    let cart = loadCart();
    const i = cart.findIndex(x=>x.id===id);
    if (i<0) return;
    cart[i].cant = Math.max(0, nueva);
    cart = cart.filter(x=>x.cant>0);
    saveCart(cart); actualizarCarrito(); renderCarritoPage();
}

export function vaciarCarrito(){
    saveCart([]); actualizarCarrito(); renderCarritoPage();
}

export function actualizarCarrito(){
    const countEl = $("#cartCount");
    if (countEl) countEl.textContent = String(cartCount(loadCart()));
}

// Render específico para carrito.html
export function renderCarritoPage(){
    const root = $('#carritoLista');
  if (!root) return; // no estamos en carrito.html

    const cart = loadCart();

    if (cart.length === 0){
    root.innerHTML = `<p class="muted">Tu carrito está vacío.</p>`;
    } else {
    root.innerHTML = `
        <div class="cart-row" style="font-weight:600">
        <div>Producto</div><div class="cart-price">Precio</div><div class="cart-qty">Cantidad</div><div class="cart-line">Total</div><div class="cart-actions">Acciones</div>
        </div>
        ${cart.map(item => `
        <div class="cart-row">
            <div class="cart-product">
            <img class="cart-thumb" src="${item.imagen}" alt="${item.nombre}">
            <div><p class="cart-name">${item.nombre}</p></div>
            </div>
            <div class="cart-price">${precioCLP(item.precio)}</div>
            <div class="cart-qty">
            <button class="qty-minus" data-id="${item.id}">−</button>
            <span>${item.cant}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
            </div>
          <div class="cart-line">${precioCLP(item.precio * item.cant)}</div>
            <div class="cart-actions"><button class="rm" data-id="${item.id}">Eliminar</button></div>
        </div>
        `).join('')}
    `;
    }

  // Totales (envío fijo demo)
    const sub = cartSubtotal(cart);
    const ship = cart.length ? 2990 : 0;
    const total = sub + ship;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = precioCLP(val).replace('$', '$'); };
    set('subTotal', sub); set('ship', ship); set('total', total);

  // Listeners
    root.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    const it = loadCart().find(x=>x.id===id);
    if (it) setCantidad(id, (it.cant||0) - 1);
    }));
    root.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    const it = loadCart().find(x=>x.id===id);
    if (it) setCantidad(id, (it.cant||0) + 1);
    }));
    root.querySelectorAll('.rm').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    quitarCarrito(id);
    }));

    document.getElementById('btnVaciar')?.addEventListener('click', vaciarCarrito);
    document.getElementById('btnPagar')?.addEventListener('click', ()=>{
    if (!loadCart().length) { alert('Tu carrito está vacío.'); return; }
    alert('✅ (Demo) Gracias por tu compra. Aquí iría el flujo de pago.');
    vaciarCarrito();
    });
}
