// === Catálogo de productos ===
window.PRODUCTOS = [
  {
    id: 1,
    codigo: "CB-ABS-BAT-001",
    nombre: "Absolute Batman",
    categoria: "Cómic",
    precio: 18990,
    stock: 5,
    imagen: "assets/productos/absolutebatman-1.jpg",
    sinopsis: "La historia definitiva de Batman en su versión Absolute.",
    autor: "Bob Kane / Bill Finger",
    editorial: "DC Comics"
  },
  {
    id: 2,
    codigo: "CB-AVG-HERO-001",
    nombre: "Avengers: La Edad Heroica",
    categoria: "Cómic",
    precio: 14990,
    stock: 7,
    imagen: "assets/productos/avengerslaedadheroica-1.jpg",
    sinopsis: "Los Vengadores se reúnen en una nueva era de héroes.",
    autor: "Brian Michael Bendis",
    editorial: "Marvel Comics"
  },
  {
    id: 3,
    codigo: "MG-BC-001",
    nombre: "Black Clover #1",
    categoria: "Manga",
    precio: 8990,
    stock: 10,
    imagen: "assets/productos/blackclover-1.jpg",
    sinopsis: "Asta sueña con convertirse en el Rey Mago, aunque no tenga magia.",
    autor: "Yūki Tabata",
    editorial: "Shueisha"
  },
  {
    id: 4,
    codigo: "MG-BLE-001",
    nombre: "Bleach #1",
    categoria: "Manga",
    precio: 8990,
    stock: 12,
    imagen: "assets/productos/bleach-1.jpg",
    sinopsis: "Ichigo Kurosaki obtiene poderes de Shinigami y protege a los vivos de los Hollows.",
    autor: "Tite Kubo",
    editorial: "Shueisha"
  },
  {
    id: 5,
    codigo: "MG-DND-001",
    nombre: "Dandadan #1",
    categoria: "Manga",
    precio: 8990,
    stock: 8,
    imagen: "assets/productos/dandadan-1.jpg",
    sinopsis: "Una mezcla única de lo paranormal con acción trepidante.",
    autor: "Yukinobu Tatsu",
    editorial: "Shueisha"
  },
  {
    id: 6,
    codigo: "MG-HXH-001",
    nombre: "Hunter x Hunter #1",
    categoria: "Manga",
    precio: 8990,
    stock: 9,
    imagen: "assets/productos/hunterxhunter-1.jpg",
    sinopsis: "Gon Freecss inicia su aventura para convertirse en Cazador.",
    autor: "Yoshihiro Togashi",
    editorial: "Shueisha"
  },
  {
    id: 7,
    codigo: "MG-NAR-001",
    nombre: "Naruto #1",
    categoria: "Manga",
    precio: 8990,
    stock: 15,
    imagen: "assets/productos/naruto-1.jpg",
    sinopsis: "El inicio de la historia de Naruto Uzumaki, el ninja que sueña con ser Hokage.",
    autor: "Masashi Kishimoto",
    editorial: "Shueisha"
  },
  {
    id: 8,
    codigo: "MG-OP-001",
    nombre: "One Piece #1",
    categoria: "Manga",
    precio: 8990,
    stock: 20,
    imagen: "assets/productos/onepiece-1.jpg",
    sinopsis: "Monkey D. Luffy inicia su viaje para convertirse en el Rey de los Piratas.",
    autor: "Eiichirō Oda",
    editorial: "Shueisha"
  },
  {
    id: 9,
    codigo: "CB-SSM-001",
    nombre: "Superior Spider-Man #1",
    categoria: "Cómic",
    precio: 13990,
    stock: 6,
    imagen: "assets/productos/superiorspiderman-1.jpg",
    sinopsis: "Otto Octavius toma el lugar de Spider-Man, buscando ser un héroe superior.",
    autor: "Dan Slott",
    editorial: "Marvel Comics"
  }
];

// === Utilidad para crear tarjetas ===
function crearCard(prod) {
  return `
    <div class="card">
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
      <div class="p">
        <h3>${prod.nombre}</h3>
        <p class="muted">${prod.categoria}${prod.autor ? ` · ${prod.autor}` : ''}</p>
        <p class="price">$${prod.precio.toLocaleString("es-CL")}</p>
        <div class="row">
          <button class="btn-ver" data-id="${prod.id}">Ver</button>
          <button class="add" data-id="${prod.id}">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

// === Mostrar destacados (solo en index) ===
function mostrarDestacados() {
  const grid = document.getElementById("gridDestacados");
  if (!grid) return;

  // 4 productos aleatorios
  const copia = [...window.PRODUCTOS];
  const seleccion = [];
  for (let i = 0; i < 4 && copia.length > 0; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccion.push(copia.splice(idx, 1)[0]);
  }

  grid.innerHTML = seleccion.map(crearCard).join("");

  // listeners de botones dentro de las cards
  grid.querySelectorAll('.add').forEach(b =>
    b.addEventListener('click', (e) => agregarCarrito(Number(e.currentTarget.dataset.id)))
  );
  grid.querySelectorAll('.btn-ver').forEach(b =>
    b.addEventListener('click', (e) => verProducto(Number(e.currentTarget.dataset.id)))
  );
}

// === Mostrar catálogo completo (solo en productos.html) ===
function mostrarCatalogo() {
  // 👇 OJO: aquí estaba el bug. Debe coincidir con tu HTML.
  const grid = document.getElementById("gridProductos");
  if (!grid) return;

  grid.innerHTML = window.PRODUCTOS.map(crearCard).join("");

  grid.querySelectorAll('.add').forEach(b =>
    b.addEventListener('click', (e) => agregarCarrito(Number(e.currentTarget.dataset.id)))
  );
  grid.querySelectorAll('.btn-ver').forEach(b =>
    b.addEventListener('click', (e) => verProducto(Number(e.currentTarget.dataset.id)))
  );

  // Filtro categoría
  const sel = document.getElementById('fCategoria');
  sel?.addEventListener('change', () => {
    const cat = sel.value;
    const data = cat ? window.PRODUCTOS.filter(p => p.categoria === cat) : window.PRODUCTOS;
    grid.innerHTML = data.map(crearCard).join("");

    grid.querySelectorAll('.add').forEach(b =>
      b.addEventListener('click', (e) => agregarCarrito(Number(e.currentTarget.dataset.id)))
    );
    grid.querySelectorAll('.btn-ver').forEach(b =>
      b.addEventListener('click', (e) => verProducto(Number(e.currentTarget.dataset.id)))
    );
  });
}

// === Carrito (mínimo) ===
window.CARRITO = [];

function agregarCarrito(id) {
  const prod = window.PRODUCTOS.find(p => p.id === id);
  if (!prod) return;
  window.CARRITO.push(prod);
  actualizarCarrito();
}

function actualizarCarrito() {
  const count = document.getElementById("cartCount");
  if (count) count.textContent = window.CARRITO.length;
}

function verProducto(id) {
  // Por ahora, demo:
  alert("Ver detalle del producto ID: " + id);
}

// 👇 expone funciones si llegas a usarlas en otros módulos/inline
window.agregarCarrito = agregarCarrito;
window.verProducto = verProducto;

// === Navbar responsive + init ===
document.addEventListener("DOMContentLoaded", () => {
  mostrarDestacados();
  mostrarCatalogo();
  actualizarCarrito();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("navMenu");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
});
