// Helpers de uso general
export const $ = (sel, root = document) => root.querySelector(sel);

export function precioCLP(n){
  try { return `$${Number(n).toLocaleString('es-CL')}`; }
  catch { return `$${n}`; }
}

// Crea la tarjeta HTML de un producto
export function crearCard(p){
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

// Asocia listeners a botones de las cards
export function bindCardButtons(rootEl, { onAdd, onVer }){
  rootEl.querySelectorAll('.add').forEach(b =>
    b.addEventListener('click', (e) => onAdd(Number(e.currentTarget.dataset.id)))
  );
  rootEl.querySelectorAll('.btn-ver').forEach(b =>
    b.addEventListener('click', (e) => onVer(Number(e.currentTarget.dataset.id)))
  );
}
