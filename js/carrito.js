import { $, precioCLP } from './utils.js';

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

// Agrega 1 unidad de un producto
export function agregarCarritoBasico(producto){
  const cart = loadCart();
  const i = cart.findIndex(x=>x.id === producto.id);
  if (i >= 0) {
    cart[i].cant = (cart[i].cant || 0) + 1;
  } else {
    cart.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio) || 0,
      imagen: producto.imagen,
      cant: 1
    });
  }
  saveCart(cart);
  actualizarCarrito();
}

// Quita un producto entero
export function quitarCarrito(id){
  let cart = loadCart().filter(x=>x.id !== id);
  saveCart(cart); actualizarCarrito(); renderCarritoPage();
}

// Cambia cantidad
export function setCantidad(id, nueva){
  let cart = loadCart();
  const i = cart.findIndex(x=>x.id===id);
  if (i<0) return;
  cart[i].cant = Math.max(0, nueva);
  cart = cart.filter(x=>x.cant>0);
  saveCart(cart); actualizarCarrito(); renderCarritoPage();
}

// Vacía
export function vaciarCarrito(){
  saveCart([]); actualizarCarrito(); renderCarritoPage();
}

// Actualiza burbuja del header
export function actualizarCarrito(){
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  const cart = loadCart();
  countEl.textContent = String(cartCount(cart));
}

// Render de la página del carrito (si existe en el DOM)
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

  const subtotal = cartSubtotal(cart);
  totalEl.textContent = precioCLP(subtotal);

  // Bind de botones
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
