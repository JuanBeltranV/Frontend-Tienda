import { $, precioCLP } from './utils.js';

const CART_KEY = 'chetanga_cart';

// --- helpers de storage ---
function loadCartRaw(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
}
function saveCartRaw(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Normaliza a [{id, nombre, precio, imagen, cant}]
function normalize(cart){
    if (!Array.isArray(cart)) return [];
    const map = new Map();
    for (const it of cart){
    if (!it || typeof it!=='object') continue;
    const id = Number(it.id);
    if (!id) continue;
    const cant = Math.max(1, Number(it.cant || 0) || 1);
    const precio = Number(it.precio) || 0;
    const item = map.get(id) || { id, nombre: it.nombre||'', precio, imagen: it.imagen||'', cant: 0 };
    item.cant += cant;
    map.set(id, item);
    }
    return [...map.values()];
}

export function loadCart(){ return normalize(loadCartRaw()); }
export function saveCart(cart){ saveCartRaw(normalize(cart)); }

export const cartCount   = (cart) => cart.reduce((a, it)=> a + (it.cant||0), 0);
export const cartSubtotal= (cart) => cart.reduce((a, it)=> a + (Number(it.precio)||0) * (it.cant||0), 0);

// --- API pública ---
export function agregarCarritoBasico(producto){
    const cart = loadCart();
    const i = cart.findIndex(x=>x.id === producto.id);
    if (i >= 0) cart[i].cant += 1;
    else cart.push({ id: producto.id, nombre: producto.nombre, precio: Number(producto.precio)||0, imagen: producto.imagen, cant: 1 });
    saveCart(cart);
  actualizarCarrito();       // <-- actualiza burbuja inmediatamente
}

export function quitarCarrito(id){
    const cart = loadCart().filter(x=>x.id !== id);
    saveCart(cart);
    actualizarCarrito();
    renderCarritoPage();
}

export function setCantidad(id, nuevaCant){
    let cart = loadCart();
    const i = cart.findIndex(x=>x.id===id);
    if (i<0) return;
    cart[i].cant = Math.max(0, Number(nuevaCant)||0);
    cart = cart.filter(x=>x.cant>0);
    saveCart(cart);
    actualizarCarrito();
    renderCarritoPage();
}

export function vaciarCarrito(){
    saveCart([]);
    actualizarCarrito();
    renderCarritoPage();
}

export function actualizarCarrito(){
  // Lee SIEMPRE desde localStorage para que sea consistente entre páginas
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    const cart = loadCart();
    countEl.textContent = String(cartCount(cart));
}

// Render de la página del carrito (solo si existen los nodos)
export function renderCarritoPage(){
    const root = $('#carritoLista');
    const totalEl = $('#carritoTotal');
    if (!root || !totalEl) return;

    const cart = loadCart();
    if (!cart.length){
    root.innerHTML = `<p>Tu carrito está vacío.</p>`;
    totalEl.textContent = precioCLP(0);
    return;
    }

    root.innerHTML = cart.map(p => `
    <article class="card">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <div class="p">
        <h3>${p.nombre}</h3>
        <div class="row" style="gap:.5rem; align-items:center">
            <button class="qty-minus" data-id="${p.id}">−</button>
            <span>${p.cant}</span>
            <button class="qty-plus" data-id="${p.id}">+</button>
            <button class="rm" data-id="${p.id}">Quitar</button>
        </div>
        <div class="price" style="margin-top:.25rem">${precioCLP(p.precio * p.cant)}</div>
        </div>
    </article>
    `).join('');

    totalEl.textContent = precioCLP(cartSubtotal(cart));

  // Bind botones cantidad / quitar
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
    alert('✅ (Demo) Gracias por tu compra.');
    vaciarCarrito();
    });
}
