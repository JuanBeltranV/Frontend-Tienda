// Navbar hamburguesa
const btn = document.querySelector('.menu-toggle');
const nav = document.getElementById('navMenu');

function toggleMenu() {
  const open = nav.classList.toggle('open');
  btn?.setAttribute('aria-expanded', open ? 'true' : 'false');
}
btn?.addEventListener('click', toggleMenu);
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (nav.classList.contains('open')) toggleMenu();
}));

// Datos demo: si no existe window.PRODUCTOS, creamos algunos
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
      sinopsis: "El origen oscuro del caballero de la noche.",
      autor: "Frank Miller",
      editorial: "DC Comics"
    }
  ];
}

// Render de destacados (primeros 6 productos)
const gridDest = document.getElementById('gridDestacados');
if (gridDest) {
  const destacados = window.PRODUCTOS.slice(0, 6);
  gridDest.innerHTML = destacados.map(cardHtml).join('');
  // Botones "Agregar" (por ahora solo muestran un alert)
  gridDest.querySelectorAll('.add').forEach(btn => btn.addEventListener('click', () => {
    alert('Añadido al carrito (demo)');
  }));
}

function cardHtml(p) {
  const precioFmt = `$${Number(p.precio).toLocaleString('es-CL')}`;
  return `
    <article class="card">
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="p">
        <h3>${p.nombre}</h3>
        <div class="muted">${p.categoria}${p.autor ? ` · ${p.autor}` : ''}</div>
        <div class="price">${precioFmt}</div>
        <div class="row" style="display:flex; gap:.5rem; margin-top:.5rem">
          <a class="btn" href="detalle-producto.html?id=${p.id}">Ver</a>
          <button class="add">Agregar</button>
        </div>
      </div>
    </article>
  `;
}
