// ===== Debug básico =====
console.log("[Chetanga] app.js cargado");

// ===== Catálogo de productos =====
window.PRODUCTOS = [
  { id: 1, codigo: "CB-ABS-BAT-001", nombre: "Absolute Batman", categoria: "Cómic", precio: 18990, stock: 5, imagen: "assets/productos/absolutebatman-1.jpg", sinopsis: "La historia definitiva de Batman en su versión Absolute.", autor: "Bob Kane / Bill Finger", editorial: "DC Comics" },
  { id: 2, codigo: "CB-AVG-HERO-001", nombre: "Avengers: La Edad Heroica", categoria: "Cómic", precio: 14990, stock: 7, imagen: "assets/productos/avengerslaedadheroica-1.jpg", sinopsis: "Los Vengadores se reúnen en una nueva era de héroes.", autor: "Brian Michael Bendis", editorial: "Marvel Comics" },
  { id: 3, codigo: "MG-BC-001", nombre: "Black Clover #1", categoria: "Manga", precio: 8990, stock: 10, imagen: "assets/productos/blackclover-1.jpg", sinopsis: "Asta sueña con convertirse en el Rey Mago.", autor: "Yūki Tabata", editorial: "Shueisha" },
  { id: 4, codigo: "MG-BLE-001", nombre: "Bleach #1", categoria: "Manga", precio: 8990, stock: 12, imagen: "assets/productos/bleach-1.jpg", sinopsis: "Ichigo obtiene poderes de Shinigami.", autor: "Tite Kubo", editorial: "Shueisha" },
  { id: 5, codigo: "MG-DND-001", nombre: "Dandadan #1", categoria: "Manga", precio: 8990, stock: 8, imagen: "assets/productos/dandadan-1.jpg", sinopsis: "Paranormal + acción trepidante.", autor: "Yukinobu Tatsu", editorial: "Shueisha" },
  { id: 6, codigo: "MG-HXH-001", nombre: "Hunter x Hunter #1", categoria: "Manga", precio: 8990, stock: 9, imagen: "assets/productos/hunterxhunter-1.jpg", sinopsis: "Gon inicia su aventura para ser Cazador.", autor: "Yoshihiro Togashi", editorial: "Shueisha" },
  { id: 7, codigo: "MG-NAR-001", nombre: "Naruto #1", categoria: "Manga", precio: 8990, stock: 15, imagen: "assets/productos/naruto-1.jpg", sinopsis: "El inicio de Naruto Uzumaki.", autor: "Masashi Kishimoto", editorial: "Shueisha" },
  { id: 8, codigo: "MG-OP-001", nombre: "One Piece #1", categoria: "Manga", precio: 8990, stock: 20, imagen: "assets/productos/onepiece-1.jpg", sinopsis: "Luffy busca ser Rey de los Piratas.", autor: "Eiichirō Oda", editorial: "Shueisha" },
  { id: 9, codigo: "CB-SSM-001", nombre: "Superior Spider-Man #1", categoria: "Cómic", precio: 13990, stock: 6, imagen: "assets/productos/superiorspiderman-1.jpg", sinopsis: "Otto Octavius como un Spider-Man ‘superior’.", autor: "Dan Slott", editorial: "Marvel" }
];

// ===== Helpers =====
function precioCLP(n){ try { return `$${Number(n).toLocaleString('es-CL')}`; } catch { return `$${n}`; } }

function crearCard(p){
  return `
    <article class="card">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      <div class="p">
        <h3>${p.nombre}</h3>
        <div class="muted">${p.categoria}${p.autor ? ` · ${p.autor}` : ''}</div>
        <div class="price">${precioCLP(p.precio)}</div>
        <div class="row">
          <button class="btn-ver" data-id="${p.id}">Ver</button>
          <button class="add" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

function bindCardButtons(rootEl){
  rootEl.querySelectorAll('.add').forEach(b =>
    b.addEventListener('click', (e) => agregarCarrito(Number(e.currentTarget.dataset.id)))
  );
  rootEl.querySelectorAll('.btn-ver').forEach(b =>
    b.addEventListener('click', (e) => verProducto(Number(e.currentTarget.dataset.id)))
  );
}

// ===== Destacados (index.html) =====
function mostrarDestacados(){
  const grid = document.getElementById("gridDestacados");
  if (!grid) return;
  const copia = [...window.PRODUCTOS];
  const seleccion = [];
  for (let i = 0; i < 4 && copia.length > 0; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccion.push(copia.splice(idx, 1)[0]);
  }
  grid.innerHTML = seleccion.map(crearCard).join("");
  bindCardButtons(grid);
}

// ===== Catálogo (productos.html) =====
function mostrarCatalogo(){
  const grid = document.getElementById("gridProductos");
  if (!grid) return;

  const sel = document.getElementById('fCategoria');
  function render(cat=''){
    let data = window.PRODUCTOS.slice();
    if (cat) data = data.filter(p => p.categoria === cat);
    grid.innerHTML = data.map(crearCard).join("");
    bindCardButtons(grid);
  }
  render();
  sel?.addEventListener('change', () => render(sel.value));
}

// ====== Carrito con persistencia (localStorage) ======
const CART_KEY = 'chetanga_cart';

function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function cartCount(cart){ return cart.reduce((acc, it)=> acc + (it.cant||0), 0); }
function cartSubtotal(cart){ return cart.reduce((acc, it)=> acc + it.precio * (it.cant||0), 0); }

window.CARRITO = loadCart();

function agregarCarrito(id){
  const prod = window.PRODUCTOS.find(p => p.id === id);
  if (!prod) return;
  const cart = loadCart();
  const i = cart.findIndex(x=>x.id===id);
  if (i>=0){ cart[i].cant = (cart[i].cant||0) + 1; }
  else { cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, imagen: prod.imagen, cant: 1 }); }
  saveCart(cart);
  window.CARRITO = cart;
  actualizarCarrito();
}

function quitarCarrito(id){
  const cart = loadCart().filter(x => x.id !== id);
  saveCart(cart); window.CARRITO = cart; actualizarCarrito(); renderCarritoPage();
}

function setCantidad(id, nueva){
  let cart = loadCart();
  const i = cart.findIndex(x=>x.id===id);
  if (i<0) return;
  cart[i].cant = Math.max(0, nueva);
  cart = cart.filter(x=>x.cant>0);
  saveCart(cart); window.CARRITO = cart; actualizarCarrito(); renderCarritoPage();
}

function vaciarCarrito(){
  saveCart([]); window.CARRITO = []; actualizarCarrito(); renderCarritoPage();
}

function actualizarCarrito(){
  const count = document.getElementById("cartCount");
  if (count) count.textContent = String(cartCount(loadCart()));
}

// ====== Render de carrito.html ======
function renderCarritoPage(){
  const root = document.getElementById('carritoLista');
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
            <div>
              <p class="cart-name">${item.nombre}</p>
            </div>
          </div>
          <div class="cart-price">$${Number(item.precio).toLocaleString('es-CL')}</div>
          <div class="cart-qty">
            <button class="qty-minus" data-id="${item.id}">−</button>
            <span>${item.cant}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
          </div>
          <div class="cart-line">$${Number(item.precio * item.cant).toLocaleString('es-CL')}</div>
          <div class="cart-actions">
            <button class="rm" data-id="${item.id}">Eliminar</button>
          </div>
        </div>
      `).join('')}
    `;
  }

  // Totales
  const sub = cartSubtotal(cart);
  const ship = cart.length ? 2990 : 0; // demo
  const total = sub + ship;
  const $ = id => document.getElementById(id);
  if ($('subTotal')) $('subTotal').textContent = `$${sub.toLocaleString('es-CL')}`;
  if ($('ship')) $('ship').textContent = `$${ship.toLocaleString('es-CL')}`;
  if ($('total')) $('total').textContent = `$${total.toLocaleString('es-CL')}`;

  // Listeners de cantidad / eliminar
  root.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    const cart = loadCart();
    const it = cart.find(x=>x.id===id);
    if (!it) return;
    setCantidad(id, (it.cant||0) - 1);
  }));
  root.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    const cart = loadCart();
    const it = cart.find(x=>x.id===id);
    if (!it) return;
    setCantidad(id, (it.cant||0) + 1);
  }));
  root.querySelectorAll('.rm').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    quitarCarrito(id);
  }));

  // Botones del resumen
  document.getElementById('btnVaciar')?.addEventListener('click', vaciarCarrito);
  document.getElementById('btnPagar')?.addEventListener('click', ()=>{
    if (!loadCart().length) { alert('Tu carrito está vacío.'); return; }
    alert('✅ (Demo) Gracias por tu compra. Aquí iría el flujo de pago.');
    vaciarCarrito();
  });
}

// ===== Navegar al detalle =====
function verProducto(id){
  location.href = `detalle-producto.html?id=${id}`;
}
window.agregarCarrito = agregarCarrito;
window.verProducto = verProducto;

// ===== Registro =====
(function(){
  const form = document.getElementById('formRegistro');
  if (!form) return;

  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const email = document.getElementById('email');
  const pass = document.getElementById('pass');
  const pass2 = document.getElementById('pass2');
  const tyc = document.getElementById('tyc');
  const errTyc = document.getElementById('errTyc');
  const msgOk = document.getElementById('msgOk');

  function setErr(input, msg){
    const small = input.parentElement.querySelector('.error');
    if (small) small.textContent = msg || '';
  }
  function validar(){
    let ok = true;
    if (!nombre.value.trim()){ setErr(nombre,'Ingresa tu nombre'); ok=false; } else setErr(nombre,'');
    if (!apellido.value.trim()){ setErr(apellido,'Ingresa tu apellido'); ok=false; } else setErr(apellido,'');
    const correo = (email.value||'').trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(correo)){ setErr(email,'Correo inválido'); ok=false; } else setErr(email,'');
    if (pass.value.length<6){ setErr(pass,'Mínimo 6 caracteres'); ok=false; } else setErr(pass,'');
    if (pass2.value!==pass.value){ setErr(pass2,'No coinciden'); ok=false; } else setErr(pass2,'');
    if (!tyc.checked){ errTyc.textContent='Debes aceptar'; ok=false; } else errTyc.textContent='';
    return ok;
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    if (!validar()) return;
    const users=JSON.parse(localStorage.getItem('chetanga_users')||'[]');
    if (users.some(u=>u.email.toLowerCase()===email.value.trim().toLowerCase())){
      setErr(email,'Correo ya registrado'); return;
    }
    users.push({nombre:nombre.value.trim(),apellido:apellido.value.trim(),email:email.value.trim(),pass:pass.value});
    localStorage.setItem('chetanga_users',JSON.stringify(users));
    form.reset(); msgOk.hidden=false;
  });
})();

// ===== Login + Sesión =====
(function(){
  const form=document.getElementById('formLogin');
  if (!form) return;
  const email=document.getElementById('loginEmail');
  const pass=document.getElementById('loginPass');
  const err=document.getElementById('errLogin');
  const msgOk=document.getElementById('msgLoginOk');

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const users=JSON.parse(localStorage.getItem('chetanga_users')||'[]');
    const user=users.find(u=>u.email.toLowerCase()===email.value.trim().toLowerCase() && u.pass===pass.value);
    if (!user){ err.textContent="Credenciales inválidas"; return; }
    err.textContent=""; msgOk.hidden=false;
    localStorage.setItem('chetanga_session',JSON.stringify(user));
    setTimeout(()=>location.href='index.html',1000);
  });
})();

// ===== Contacto =====
(function(){
  const form=document.getElementById('formContacto');
  if (!form) return;
  const msg=document.getElementById('msgContacto') || document.getElementById('msgContactoOk');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    form.reset();
    if (msg){ msg.hidden=false; setTimeout(()=>{ msg.hidden=true; }, 2500); }
  });
})();

// ===== Navbar & Boot =====
document.addEventListener("DOMContentLoaded",()=>{
  mostrarDestacados();
  mostrarCatalogo();
  actualizarCarrito();
  renderCarritoPage(); // si estamos en carrito.html, pinta la página

  const toggle=document.querySelector(".menu-toggle");
  const nav=document.getElementById("navMenu");
  if(toggle&&nav){
    toggle.addEventListener("click",()=>{
      const open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",open?"true":"false");
    });
  }
});
