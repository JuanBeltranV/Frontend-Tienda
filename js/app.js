// Punto de entrada
import { PRODUCTOS } from './data.js';
import { $, crearCard, bindCardButtons, precioCLP } from './utils.js';
import { agregarCarritoBasico, actualizarCarrito, renderCarritoPage } from './carrito.js';
import { initRegistro, initLogin, initContacto } from './validar.js';

console.log('[Chetanga] app.js (modules)');

// ===== Navegación responsive =====
function initNavbar(){
  const toggle = $('.menu-toggle');
  const nav = $('#navMenu');
  if (toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
}

// ===== Acciones de cards =====
function onAdd(id){
  const p = PRODUCTOS.find(x=>x.id===id);
  if (!p) return;
  agregarCarritoBasico(p);
}
function onVer(id){
  location.href = `detalle-producto.html?id=${id}`;
}

// ===== Index: destacados =====
function renderDestacados(){
  const grid = $('#gridDestacados');
  if (!grid) return;
  const pool = [...PRODUCTOS];
  const pick = [];
  for (let i=0; i<4 && pool.length; i++){
    const idx = Math.floor(Math.random()*pool.length);
    pick.push(pool.splice(idx,1)[0]);
  }
  grid.innerHTML = pick.map(crearCard).join('');
  bindCardButtons(grid, { onAdd, onVer });
}

// ===== Productos: catálogo =====
function renderCatalogo(){
  const grid = $('#gridProductos');
  if (!grid) return;
  const sel = $('#fCategoria');

  function paint(cat=''){
    let data = PRODUCTOS.slice();
    if (cat) data = data.filter(p => p.categoria === cat);
    grid.innerHTML = data.map(crearCard).join('');
    bindCardButtons(grid, { onAdd, onVer });
  }
  paint();
  sel?.addEventListener('change', ()=> paint(sel.value));
}

// ===== Detalle de producto =====
function renderDetalle(){
  // funciona tanto en local server como en GitHub Pages
  if (!location.pathname.endsWith('detalle-producto.html')) return;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));

  // 🚦 Guard 1: si no hay ?id=, vuelve a productos
  if (!id) {
    console.warn('Sin ?id= en detalle-producto, redirigiendo…');
    location.href = 'productos.html';
    return;
  }

  const prod = PRODUCTOS.find(p => p.id === id);

  // 🚦 Guard 2: si el id no existe en el catálogo, vuelve a productos
  if (!prod) {
    console.warn('Producto no encontrado, redirigiendo…');
    location.href = 'productos.html';
    return;
  }

  const img = $('#detailImg'), title = $('#detailTitle');
  const meta = $('#detailMeta'), sin = $('#detailSinopsis');
  const precio = $('#detailPrecio'), btnAdd = $('#btnAdd');
  const relGrid = $('#relacionadosGrid');

  if (img){ img.src = prod.imagen; img.alt = prod.nombre; }
  if (title) title.textContent = prod.nombre;
  if (meta) meta.textContent = [
    prod.categoria || '',
    prod.autor ? `Autor: ${prod.autor}` : '',
    prod.editorial ? `Editorial: ${prod.editorial}` : '',
    prod.codigo ? `Código: ${prod.codigo}` : ''
  ].filter(Boolean).join(' · ');
  if (sin) sin.textContent = prod.sinopsis || '';
  if (precio) precio.textContent = precioCLP(prod.precio);
  if (btnAdd) btnAdd.onclick = ()=> onAdd(prod.id);

  if (relGrid){
    const otros = PRODUCTOS.filter(p => p.id !== prod.id);
    const pool = otros.length <= 3
      ? otros
      : (()=>{ const arr=[...otros], pick=[]; for(let i=0;i<3;i++){ const idx=Math.floor(Math.random()*arr.length); pick.push(arr.splice(idx,1)[0]); } return pick; })();
    relGrid.innerHTML = pool.map(crearCard).join('');
    bindCardButtons(relGrid, { onAdd, onVer });
  }
}

// ===== Boot =====
document.addEventListener('DOMContentLoaded', ()=>{
  initNavbar();

  // Páginas
  renderDestacados();   // index
  renderCatalogo();     // productos
  renderDetalle();      // detalle
  renderCarritoPage();  // carrito
  initRegistro();       // registro
  initLogin();          // login
  initContacto();       // contacto

  // contador del carrito
  actualizarCarrito();
});
