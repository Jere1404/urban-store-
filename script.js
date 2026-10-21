// El catálogo: cambiá nombres, precios e imágenes desde esta lista.
const products = [
  { id: 'tee-black', name: 'Remera Oversize Essential', category: 'Remeras', price: 28, image: 'assets/remera-negra.svg', tag: 'BEST SELLER' },
  { id: 'hoodie', name: 'Buzo Hoodie Core', category: 'Buzos', price: 65, image: 'assets/buzo.svg', tag: 'NUEVO' },
  { id: 'cargo', name: 'Pantalón Cargo Street', category: 'Pantalones', price: 58, image: 'assets/pantalon.svg', tag: '' },
  { id: 'tee-white', name: 'Remera Boxy Studio', category: 'Remeras', price: 32, image: 'assets/remera-blanca.svg', tag: 'NUEVO' },
  { id: 'cap', name: 'Gorra Urban Signature', category: 'Accesorios', price: 22, image: 'assets/gorra.svg', tag: '' },
  { id: 'bag', name: 'Bandolera Daily', category: 'Accesorios', price: 35, image: 'assets/bandolera.svg', tag: 'ESENCIAL' }
];
const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', currencyDisplay: 'code' });
const money = value => currency.format(value);
const storageKey = 'urban-store-cart-v1';
let cart = [];
// El almacenamiento es opcional: el carrito también funciona si el navegador lo bloquea.
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) {
    cart = products.flatMap(product => {
      const item = saved.find(entry => entry && entry.id === product.id);
      return item && Number.isInteger(item.quantity) && item.quantity > 0
        ? [{ id: product.id, quantity: Math.min(item.quantity, 99) }] : [];
    });
  }
} catch { cart = []; }
const catalog = document.querySelector('#products');
const dialog = document.querySelector('#cart');
const toast = document.querySelector('#toast');
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}
function renderProducts(category = 'Todos') {
  const visible = products.filter(product => category === 'Todos' || product.category === category);
  catalog.innerHTML = visible.map(product => `
    <article class="product">
      <div class="product-image"><img src="${product.image}" alt="${product.name}" width="480" height="528" loading="lazy">${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}</div>
      <div class="product-details"><div><p class="product-category">${product.category}</p><h3>${product.name}</h3></div><span class="product-price">${money(product.price)}</span></div>
      <button class="add-button" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito">Agregar al carrito <span aria-hidden="true">+</span></button>
    </article>`).join('');
  document.querySelector('#product-count').textContent = `${String(visible.length).padStart(2, '0')} PRODUCTOS`;
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#open-cart').setAttribute('aria-label', `Abrir carrito, ${count} productos`);
  document.querySelector('#cart-items').innerHTML = cart.length ? cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return `<article class="cart-item"><img src="${product.image}" alt="${product.name}"><div><h3>${product.name}</h3><p>${money(product.price)} / unidad</p><div class="item-actions"><button class="quantity-button" data-action="decrease" data-id="${item.id}" aria-label="Quitar una unidad de ${product.name}">−</button><span aria-label="Cantidad">${item.quantity}</span><button class="quantity-button" data-action="increase" data-id="${item.id}" aria-label="Agregar una unidad de ${product.name}" ${item.quantity >= 99 ? 'disabled' : ''}>+</button><button class="remove-item" data-action="remove" data-id="${item.id}" aria-label="Eliminar ${product.name}">Eliminar</button></div></div></article>`;
  }).join('') : '<div class="cart-empty"><p>Tu próximo favorito te está esperando.</p><p>Agregá productos de la colección<br>y encontralos acá.</p></div>';
  const total = cart.reduce((sum, item) => sum + products.find(product => product.id === item.id).price * item.quantity, 0);
  document.querySelector('#cart-total').textContent = money(total);
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* Funciona en memoria si no hay almacenamiento. */ }
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  renderProducts(button.dataset.category);
}));
catalog.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const product = products.find(product => product.id === button.dataset.add);
  const existing = cart.find(item => item.id === product.id);
  if (existing && existing.quantity >= 99) return notify('Máximo de 99 unidades por producto.');
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, quantity: 1 });
  renderCart();
  notify(`${product.name} se agregó al carrito`);
});
document.querySelector('#cart-items').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const item = cart.find(item => item.id === button.dataset.id);
  if (!item) return;
  const previousIndex = cart.findIndex(entry => entry.id === item.id);
  if (button.dataset.action === 'remove') cart = cart.filter(entry => entry.id !== item.id);
  else item.quantity += button.dataset.action === 'increase' ? (item.quantity < 99 ? 1 : 0) : -1;
  cart = cart.filter(item => item.quantity > 0);
  renderCart();
  // Devolvemos el foco a un control útil después de actualizar las filas.
  const rows = document.querySelectorAll('.cart-item');
  const target = rows[Math.min(previousIndex, rows.length - 1)];
  if (target) target.querySelector(`[data-action="${button.dataset.action}"]`).focus();
  else document.querySelector('#continue-shopping').focus();
});
function closeCart() { dialog.close(); }
document.querySelector('#open-cart').addEventListener('click', () => {
  dialog.showModal();
  document.body.classList.add('cart-open');
});
document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('#continue-shopping').addEventListener('click', closeCart);
dialog.addEventListener('close', () => document.body.classList.remove('cart-open'));
dialog.addEventListener('click', event => { if (event.target === dialog) closeCart(); });
renderProducts();
renderCart();
