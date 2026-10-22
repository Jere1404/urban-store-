// El catálogo: cambiá nombres, precios e imágenes desde esta lista.
const products = [
  { id: 'tee-black', name: 'Remera Oversize Essential', category: 'Remeras', price: 28, image: 'assets/remera%20negra', tag: 'BEST SELLER' },
  { id: 'hoodie', name: 'Buzo Hoodie Core', category: 'Buzos', price: 65, image: 'assets/buzo%20verde', tag: 'NUEVO' },
  { id: 'cargo', name: 'Pantalón Cargo Street', category: 'Pantalones', price: 58, image: 'assets/pantalon%20cargo', tag: '' },
  { id: 'tee-white', name: 'Remera Boxy Studio', category: 'Remeras', price: 32, image: 'assets/remera-blanca.svg', tag: 'NUEVO' },
  { id: 'cap', name: 'Gorra Urban Signature', category: 'Accesorios', price: 22, image: 'assets/gorra.svg', tag: '' },
  { id: 'bag', name: 'Bandolera Daily', category: 'Accesorios', price: 35, image: 'assets/bandolera.svg', tag: 'ESENCIAL' }
];
const descriptions = {
  'tee-black': 'Una remera negra de silueta relajada. La base de un look urbano que podés combinar con cargos, buzos y tus accesorios favoritos.',
  hoodie: 'El hoodie verde que suma carácter a tus combinaciones de todos los días. Una pieza protagonista para llevar con básicos y siluetas amplias.',
  cargo: 'Bolsillos cargo y una silueta urbana de líneas relajadas. Un pantalón para armar tu propio uniforme con remeras y buzos.',
  'tee-white': 'Una remera blanca de silueta boxy y estética limpia. Un esencial para combinar a tu manera, solo o en capas.',
  cap: 'La gorra que completa el conjunto. Un accesorio de estética minimalista para sumar un detalle urbano a tus looks.',
  bag: 'Una bandolera de líneas simples para completar tu look. Un accesorio con identidad propia dentro de la colección Daily.'
};
// Variantes de demostración: no representan inventario ni fotografías adicionales.
const colorDefinitions = {
  black: { name: 'Negro', hex: '#171717' }, gray: { name: 'Gris', hex: '#999999' },
  green: { name: 'Verde', hex: '#154b35' }, sand: { name: 'Arena', hex: '#99866b' },
  white: { name: 'Blanco', hex: '#ffffff' }
};
const variants = {
  'tee-black': ['black', 'gray'], hoodie: ['green', 'black'], cargo: ['sand', 'black'],
  'tee-white': ['white', 'black'], cap: ['black', 'gray'], bag: ['black', 'gray']
};
const sizes = ['S', 'M', 'L', 'XL'];
const needsSize = product => product.category !== 'Accesorios';
const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', currencyDisplay: 'code' });
const money = value => currency.format(value);
const storageKey = 'urban-store-cart-v3';
const favoritesKey = 'urban-store-favorites-v1';
const productById = id => products.find(product => product.id === id);
const itemKey = item => `${item.id}|${item.size || 'one'}|${item.color}`;
function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* La sesión sigue funcionando en memoria. */ }
}
function loadCart() {
  try {
    const current = localStorage.getItem(storageKey);
    const legacy = current === null;
    const saved = JSON.parse((legacy ? localStorage.getItem('urban-store-cart-v1') : current) || '[]');
    if (!Array.isArray(saved)) return [];
    const result = [];
    for (const entry of saved) {
      if (!entry || !Number.isInteger(entry.quantity) || entry.quantity < 1) continue;
      const product = productById(entry.id);
      if (!product) continue;
      const color = legacy ? variants[product.id][0] : entry.color;
      const size = legacy ? null : entry.size;
      if (!variants[product.id].includes(color)) continue;
      if (needsSize(product) ? size !== null && !sizes.includes(size) : size !== null) continue;
      const item = { id: product.id, size, color, quantity: Math.min(entry.quantity, 99) };
      const existing = result.find(other => itemKey(other) === itemKey(item));
      if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity);
      else result.push(item);
    }
    return result;
  } catch { return []; }
}
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return new Set(Array.isArray(saved) ? saved.filter(id => productById(id)) : []);
  } catch { return new Set(); }
}
let cart = loadCart();
const favorites = loadFavorites();
const catalogState = { category: 'Todos', query: '', favoritesOnly: false };
const catalog = document.querySelector('#products');
const dialog = document.querySelector('#cart');
const quickView = document.querySelector('#quick-view');
const toast = document.querySelector('#toast');
let toastTimer;
let editingKey = null;
let quickProductId = null;
function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
function renderProducts() {
  const terms = normalize(catalogState.query).split(/\s+/).filter(Boolean);
  const visible = products.filter(product =>
    (catalogState.category === 'Todos' || product.category === catalogState.category) &&
    (!catalogState.favoritesOnly || favorites.has(product.id)) &&
    terms.every(term => normalize(`${product.name} ${product.category}`).includes(term)));
  catalog.innerHTML = visible.map(product => `
    <article class="product" aria-label="${product.name}">
      <div class="product-image">
        <span class="product-number" aria-hidden="true">${String(products.indexOf(product) + 1).padStart(2, '0')} / URBN</span>
        <img src="${product.image}" alt="${product.name}" width="480" height="528" loading="lazy" decoding="async">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
        <button class="favorite-button" data-favorite="${product.id}" aria-label="${favorites.has(product.id) ? 'Quitar' : 'Guardar'} ${product.name} ${favorites.has(product.id) ? 'de' : 'en'} favoritos" aria-pressed="${favorites.has(product.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button>
        <button class="quick-button" data-quick="${product.id}" aria-label="Vista rápida de ${product.name}" aria-haspopup="dialog" aria-controls="quick-view">Vista rápida <span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button>
      </div>
      <div class="product-details"><p class="product-category">${product.category}</p><h3>${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
      <button class="add-button" data-add="${product.id}" aria-label="${needsSize(product) ? 'Elegir talle de' : 'Agregar'} ${product.name}${needsSize(product) ? '' : ' al carrito'}">${needsSize(product) ? 'Elegir talle y color' : 'Agregar al carrito'} <span aria-hidden="true">+</span></button>
    </article>`).join('');
  document.querySelector('#product-count').textContent = `${String(visible.length).padStart(2, '0')} PRODUCTOS${catalogState.favoritesOnly ? ' FAVORITOS' : ''}`;
  document.querySelector('#favorite-count').textContent = favorites.size;
  document.querySelector('#catalog-empty').hidden = visible.length > 0;
  const noFavorites = catalogState.favoritesOnly && favorites.size === 0;
  document.querySelector('#empty-title').textContent = noFavorites ? 'Tus favoritos empiezan acá.' : 'No encontramos coincidencias.';
  document.querySelector('#empty-description').textContent = noFavorites
    ? 'Tocá el corazón de un producto para guardarlo y volver a encontrarlo.'
    : 'Probá otro nombre, categoría o filtro para encontrar tu próximo esencial.';
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#open-cart').setAttribute('aria-label', `Abrir carrito, ${count} productos`);
  document.querySelector('#cart-items').innerHTML = cart.length ? cart.map(item => {
    const product = productById(item.id);
    const key = itemKey(item);
    const pending = needsSize(product) && !item.size;
    const variant = `${needsSize(product) ? `Talle ${item.size || 'pendiente'} · ` : ''}${colorDefinitions[item.color].name}`;
    return `<article class="cart-item" data-variant="${key}"><img src="${product.image}" alt="${product.name}"><div><h3>${product.name}</h3><p class="cart-variant">${variant}</p>${pending ? `<button class="configure-item" data-configure="${key}">Elegir talle</button>` : ''}<p>${money(product.price)} / unidad</p><p class="item-subtotal">Subtotal <strong>${money(product.price * item.quantity)}</strong></p><div class="item-actions"><button class="quantity-button" data-action="decrease" data-key="${key}" aria-label="Quitar una unidad de ${product.name}, ${variant}">−</button><span aria-label="Cantidad">${item.quantity}</span><button class="quantity-button" data-action="increase" data-key="${key}" aria-label="Agregar una unidad de ${product.name}, ${variant}" ${item.quantity >= 99 ? 'disabled' : ''}>+</button><button class="remove-item" data-action="remove" data-key="${key}" aria-label="Eliminar ${product.name}, ${variant}">Eliminar</button></div></div></article>`;
  }).join('') : '<div class="cart-empty"><p>Tu próximo favorito te está esperando.</p><p>Agregá productos de la colección<br>y encontralos acá.</p></div>';
  const total = cart.reduce((sum, item) => sum + productById(item.id).price * item.quantity, 0);
  document.querySelector('#cart-total').textContent = money(total);
  saveStorage(storageKey, cart);
}
function addToCart(id, size = null, color = variants[id]?.[0]) {
  const product = productById(id);
  if (!product || !variants[id].includes(color) || (needsSize(product) && !sizes.includes(size))) return 'Elegí un talle antes de agregar la prenda.';
  const item = { id, size: needsSize(product) ? size : null, color, quantity: 1 };
  const previous = editingKey ? cart.find(entry => entry.id === id && itemKey(entry) === editingKey) : null;
  const quantity = previous ? previous.quantity : 1;
  const existing = cart.find(entry => itemKey(entry) === itemKey(item) && itemKey(entry) !== editingKey);
  if ((existing?.quantity || 0) + quantity > 99) return 'Máximo de 99 unidades por variante.';
  if (previous) cart = cart.filter(entry => itemKey(entry) !== editingKey);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...item, quantity });
  editingKey = null;
  renderCart();
  notify(`${product.name} se agregó al carrito`);
  return '';
}
function syncModalState() {
  document.body.classList.toggle('cart-open', Boolean(document.querySelector('dialog[open]')));
}
function openQuickView(id, pendingKey = null) {
  const product = productById(id);
  if (!product) return;
  quickProductId = id;
  editingKey = pendingKey;
  const image = document.querySelector('#quick-image');
  image.src = product.image;
  image.alt = product.name;
  document.querySelector('#quick-title').textContent = product.name;
  document.querySelector('#quick-category').textContent = product.category;
  document.querySelector('#quick-price').textContent = money(product.price);
  document.querySelector('#quick-description').textContent = descriptions[id];
  document.querySelector('#quick-status').textContent = '';
  const sizeField = document.querySelector('#size-options');
  sizeField.hidden = !needsSize(product);
  sizeField.querySelector('.size-choices').innerHTML = needsSize(product) ? sizes.map(size => `<label class="size-option"><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join('') : '';
  document.querySelector('.color-choices').innerHTML = variants[id].map((color, index) => `<label class="color-option"><input type="radio" name="color" value="${color}" ${index === 0 ? 'checked' : ''}><span class="color-swatch" style="--swatch:${colorDefinitions[color].hex}" aria-hidden="true"></span><span>${colorDefinitions[color].name}</span></label>`).join('');
  document.querySelector('#selected-color').textContent = colorDefinitions[variants[id][0]].name;
  document.querySelector('#variant-note').textContent = `Talles y colores de demostración, sin inventario real. Foto de referencia: ${colorDefinitions[variants[id][0]].name.toLowerCase()}; la imagen no cambia al elegir otro color.`;
  quickView.showModal();
  syncModalState();
}
function setCatalogView(favoritesOnly) {
  catalogState.favoritesOnly = favoritesOnly;
  for (const [id, active] of [['show-all', !favoritesOnly], ['show-favorites', favoritesOnly]]) {
    const button = document.querySelector(`#${id}`);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  renderProducts();
}
document.querySelector('#show-all').addEventListener('click', () => setCatalogView(false));
document.querySelector('#show-favorites').addEventListener('click', () => setCatalogView(true));
document.querySelector('#product-search').addEventListener('input', event => {
  catalogState.query = event.target.value;
  renderProducts();
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  catalogState.category = button.dataset.category;
  renderProducts();
}));
document.querySelector('#reset-catalog').addEventListener('click', () => {
  catalogState.category = 'Todos';
  catalogState.query = '';
  document.querySelector('#product-search').value = '';
  document.querySelectorAll('.filter').forEach(button => {
    button.classList.toggle('active', button.dataset.category === 'Todos');
    button.setAttribute('aria-pressed', String(button.dataset.category === 'Todos'));
  });
  setCatalogView(false);
  document.querySelector('#product-search').focus();
});
catalog.addEventListener('click', event => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const id = favorite.dataset.favorite;
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    saveStorage(favoritesKey, [...favorites]);
    renderProducts();
    const target = catalog.querySelector(`[data-favorite="${id}"]`) || document.querySelector('#show-favorites');
    target.focus({ preventScroll: true });
    return;
  }
  const quickButton = event.target.closest('[data-quick]');
  if (quickButton) return openQuickView(quickButton.dataset.quick);
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const product = productById(button.dataset.add);
  if (needsSize(product)) openQuickView(product.id);
  else {
    const error = addToCart(product.id);
    if (error) notify(error);
  }
});
document.querySelector('#color-options').addEventListener('change', event => {
  if (event.target.name === 'color') document.querySelector('#selected-color').textContent = colorDefinitions[event.target.value].name;
});
document.querySelector('#variant-form').addEventListener('submit', event => {
  event.preventDefault();
  const size = event.currentTarget.querySelector('[name="size"]:checked')?.value || null;
  const color = event.currentTarget.querySelector('[name="color"]:checked')?.value;
  const error = addToCart(quickProductId, size, color);
  document.querySelector('#quick-status').textContent = error || 'Agregado al carrito. Seguí explorando a tu manera.';
  if (error && needsSize(productById(quickProductId)) && !size) document.querySelector('[name="size"]').focus();
});
document.querySelector('#close-quick').addEventListener('click', () => quickView.close());
quickView.addEventListener('close', () => {
  if (!quickView.open) editingKey = null;
  syncModalState();
});
quickView.addEventListener('click', event => { if (event.target === quickView) quickView.close(); });
document.querySelector('#quick-cart').addEventListener('click', () => {
  quickView.close();
  dialog.showModal();
  syncModalState();
});
document.querySelector('#cart-items').addEventListener('click', event => {
  const configure = event.target.closest('[data-configure]');
  if (configure) {
    const item = cart.find(item => itemKey(item) === configure.dataset.configure);
    if (!item) return;
    dialog.close();
    openQuickView(item.id, itemKey(item));
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const item = cart.find(item => itemKey(item) === button.dataset.key);
  if (!item) return;
  const previousIndex = cart.indexOf(item);
  if (button.dataset.action === 'remove') cart = cart.filter(entry => itemKey(entry) !== button.dataset.key);
  else item.quantity += button.dataset.action === 'increase' ? (item.quantity < 99 ? 1 : 0) : -1;
  cart = cart.filter(item => item.quantity > 0);
  renderCart();
  const rows = document.querySelectorAll('.cart-item');
  const target = rows[Math.min(previousIndex, rows.length - 1)];
  if (target) target.querySelector(`[data-action="${button.dataset.action}"]`).focus();
  else document.querySelector('#continue-shopping').focus();
});
function closeCart() { dialog.close(); }
document.querySelector('#open-cart').addEventListener('click', () => {
  dialog.showModal();
  syncModalState();
});
document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('#continue-shopping').addEventListener('click', closeCart);
dialog.addEventListener('close', syncModalState);
dialog.addEventListener('click', event => { if (event.target === dialog) closeCart(); });
renderProducts();
renderCart();
