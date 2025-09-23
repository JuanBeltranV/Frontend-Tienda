// =======================================================
// Chetanga - app.js (simple, estilo estudiante)
// - Navbar hamburguesa
// - Home: render de Destacados
// - Productos: listado + filtro por categoría
// - Detalle (opcional): render por ?id=
//   * No usa imports ni otros archivos, listo para probar.
// =======================================================

// -------------------------
// Navbar hamburguesa
// -------------------------
const btn = document.querySelector('.menu-toggle');
const nav = document.getElementById('navMenu');

function toggleMenu() {
  const open = nav.classList.toggle('open');
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
btn?.addEventListener('click', toggleMenu);
// Cierra el menú al hacer click en un enlace (mejor UX en móvil)
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (nav.classList.contains('open')) toggleMenu();
}));

// -------------------------
// Datos demo (si no existe window.PRODUCTOS)
// -------------------------
if (!window.PRODUCTOS) {
  window.PRODUCTOS = [
    {
      id: 1,
      codigo: "MNG-OP-001",
      nombre: "One Piece #1",
      categoria: "Manga",
      precio: 6990,
      stock: 12,
      imagen: "https://via.placeholder.com/600x800?text=One+Piece+%231",
      sinopsis: "Inicio de la aventura pirata.",
      autor: "Eiichiro Oda",
      editorial: "Shueisha"
    },
    {
      id: 2,
      codigo: "MNG-NRT-001",
      nombre: "Naruto #1",
      categoria: "Manga",
      precio: 7490,
      stock: 10,
      imagen: "https://via.placeholder.com/600x800?text=Naruto+%231",
      sinopsis: "Comienza la historia del ninja Naruto.",
      autor: "Masashi Kishimoto",
      editorial: "Shueisha"
    },
    {
      id: 3,
      codigo: "COM-SM-001",
      nombre: "Spider-Man #1",
      categoria: "Cómic",
      precio: 8990,
      stock: 8,
      imagen: "https://via.placeholder.com/600x800?text=Spider-Man+%231",
      sinopsis: "El trepamuros en acción.",
      autor: "Stan Lee",
      editorial: "Marvel"
    },
    {
      id: 4,
      codigo: "COM-BM-001",
      nombre: "Batman Año Uno",
      categoria: "Cómic",
      precio: 10990,
      stock: 6,
      imagen: "https://via.placeholder.com/600x800?text=Batman+A%C3%B1o+Uno",
      sinopsis: "El origen del caballero de la noche.",
      autor: "Frank Miller",
      editorial: "DC Comics"
    }
  ];
}

// -------------------------
// Utilidades
// -------------------------
function precioCLP(n) {
  return `$${Number(n).toLocaleString('es-CL')}`;
}

function cardHtml(p) {
  return `
    <article class="card">
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="p">
        <h3>${p.nombre}</h3>
        <div class="muted">${p.categoria}${p.autor ? ` · ${p.autor}` : ''}</div>
        <div class="price">${precioCLP(p.precio)}</div>
        <div class="row">
          <a class="btn" href="detalle-producto.html?id=${p.id}">Ver</a>
          <button class="add" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

// -------------------------
// Home: Destacados
// -------------------------
const gridDest = document.getElementById('gridDestacados');
if (gridDest) {
  const destacados = window.PRODUCTOS.slice(0, 6);
  gridDest.innerHTML = destacados.map(cardHtml).join('');
  gridDest.querySelectorAll('.add').forEach(b =>
    b.addEventListener('click', () => alert('Añadido al carrito (demo)'))
  );
}

// -------------------------
// Productos: listado + filtro
// -------------------------
const gridProds = document.getElementById('gridProductos');
if (gridProds) {
  const sel = document.getElementById('fCategoria');

  function render(cat = '') {
    const data = cat ? window.PRODUCTOS.filter(p => p.categoria === cat) : window.PRODUCTOS;
    gridProds.innerHTML = data.map(cardHtml).join('');
    gridProds.querySelectorAll('.add').forEach(b =>
      b.addEventListener('click', () => alert('Añadido al carrito (demo)'))
    );
  }

  render(); // inicial
  sel?.addEventListener('change', () => render(sel.value));
}

// -------------------------
// Detalle (opcional): si existe un ?id= y la página tiene contenedores
// -------------------------
const params = new URLSearchParams(location.search);
const detId = Number(params.get('id'));
const elImg = document.getElementById('detImg');
const elNombre = document.getElementById('detNombre');
const elAutor = document.getElementById('detAutor');
const elSinopsis = document.getElementById('detSinopsis');
const elPrecio = document.getElementById('detPrecio');
const btnAdd = document.getElementById('btnAdd');

if (detId && elImg && elNombre && elPrecio) {
  const p = window.PRODUCTOS.find(x => x.id === detId);
  if (p) {
    elImg.src = p.imagen;
    elImg.alt = p.nombre;
    elNombre.textContent = p.nombre;
    if (elAutor) elAutor.textContent = [p.autor, p.editorial].filter(Boolean).join(' · ');
    if (elSinopsis) elSinopsis.textContent = p.sinopsis || '';
    elPrecio.textContent = precioCLP(p.precio);
    btnAdd?.addEventListener('click', () => alert('Añadido al carrito (demo)'));
  } else {
    // Si no existe el producto, muestra algo simple
    if (elNombre) elNombre.textContent = 'Producto no encontrado';
  }
}
