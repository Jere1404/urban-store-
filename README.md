# URBAN STORE 2.0

Tienda ficticia de ropa urbana creada con HTML, CSS y JavaScript puro, sin dependencias de ejecución ni pasos de compilación. Proyecto educativo: no realiza pedidos ni procesa pagos.

## Cómo verla

Abrí `index.html` con un navegador moderno (Chrome, Firefox, Edge o Safari).

También podés usar la extensión Live Server de Visual Studio Code, o ejecutar desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Con el servidor ejecutándose en tu computadora, ingresá a `http://localhost:8000`. Para detenerlo, presioná Ctrl+C en la terminal. En un entorno remoto, utilizá la opción de puertos o vista previa de tu editor si está disponible.

## Archivos

- `index.html`: estructura, navegación, presentación, categorías, información de la tienda, pie y panel del carrito.
- `styles.css`: colores, tipografía, espacios, animaciones y reglas adaptables para celulares y computadoras.
- `script.js`: datos de los seis productos, filtros, avisos y carrito con cantidades y total.
- `assets/`: siete ilustraciones SVG originales (portada y productos) y el ícono de la pestaña. No requieren servicios externos.

## Cómo modificarla

1. **Textos y enlaces:** editá `index.html`. Las redes dirigen a las páginas generales de Instagram y TikTok; no representan cuentas de la tienda. El correo usa el dominio reservado `.example` y no es un contacto real.
2. **Diseño:** editá `styles.css`. Al comienzo, `:root` define los colores principales. Las reglas `@media` adaptan el diseño según el ancho de pantalla. La tipografía usa fuentes del sistema y no necesita descargas.
3. **Productos y precios:** editá la lista `products` al comienzo de `script.js`. Cada producto tiene un `id` único, `name`, `category`, `price` numérico en USD, `image` y `tag`. Mantené las categorías actuales para que funcionen los filtros.
4. **Imágenes:** agregá tus archivos a `assets/` y actualizá las rutas en `script.js`; la portada se cambia en `index.html`. Usá imágenes propias o con licencia adecuada.

El carrito guarda únicamente identificadores y cantidades en `localStorage` del navegador, sin datos personales. Si el almacenamiento está bloqueado, sigue funcionando en memoria. Las cantidades van de 1 a 99; restar la última unidad elimina el producto. Para vaciarlo, eliminá sus productos desde el panel. El almacenamiento puede variar al abrir archivos directamente; usar un servidor local ofrece un origen estable.

## Comprobaciones

Validado en Chromium: seis productos e imágenes locales, filtros, agregar unidades, reducir cantidades, eliminar productos, cálculo del total, estado vacío, persistencia al recargar, cierre con Escape y recuperación ante datos guardados corruptos. Sin errores JavaScript ni respuestas HTTP fallidas durante esas pruebas. Se comprobó la ausencia de desbordamiento horizontal en anchos de 360, 390, 768 y 1440 píxeles.

No incluye backend, inventario, usuarios, envíos ni pagos. Los precios, productos e información comercial son ficticios.

## Si la vista previa muestra la página sin estilos

`index.html` necesita los archivos vecinos `styles.css`, `script.js` y la carpeta `assets/`. Las rutas son relativas: el navegador los busca junto al HTML. No muevas ni descargues solamente `index.html`.

Una vista previa de un archivo dentro del chat puede mostrar únicamente ese archivo o restringir recursos y JavaScript. Eso puede dejar los enlaces con el estilo predeterminado, las imágenes rotas y el catálogo vacío. Esta limitación no se puede confirmar sin inspeccionar esa vista previa concreta.

Para ver el sitio completo:

1. Descargá o cloná el repositorio completo conservando su estructura.
2. Abrí su carpeta en Visual Studio Code.
3. Con la extensión Live Server instalada, hacé clic derecho sobre `index.html` y elegí **Open with Live Server**.
4. Como alternativa, abrí `index.html` directamente desde tu computadora, o usá el servidor Python indicado arriba.

Si lo abrís desde el servidor y todavía ves una versión antigua, probá una recarga forzada con Ctrl+Shift+R (Cmd+Shift+R en Mac). En las herramientas de desarrollador del navegador, la pestaña Red / Network permite comprobar si `styles.css`, `script.js` y las imágenes se cargan correctamente.

Se verificó la carga de CSS, la ejecución de JavaScript y las siete imágenes de la página en Chromium mediante un servidor HTTP. La apertura directa con file:// no pudo comprobarse porque la política del navegador del entorno la bloquea (ERR_BLOCKED_BY_ADMINISTRATOR). Esta comprobación no incluye la vista previa interna de Codex.


## Rediseño 2.0

Se conserva la aplicación original y sus seis productos, categorías, precios e identificadores del carrito. El catálogo incorpora imágenes más grandes, numeración editorial, botones de al menos 44 px de alto, filtros redondeados, mayor espacio y tipografía más clara. La paleta es blanca, negra y gris; las ilustraciones originales se muestran en escala de grises mediante CSS. No se agregaron pagos ni envíos, dependencias ni fuentes externas.

**Fotografías incorporadas desde `main`:** se utilizan los archivos aportados al repositorio `assets/remera negra` (Remera Oversize Essential), `assets/buzo verde` (Buzo Hoodie Core) y `assets/pantalon cargo` (Pantalón Cargo Street). Son archivos JPEG aunque sus nombres no tienen extensión; se conservan sus nombres originales y las rutas codifican los espacios como `%20`. Las fotos mantienen sus colores y se muestran completas con `object-fit: contain`, tanto en el catálogo como en el carrito. La remera blanca, la gorra y la bandolera conservan sus ilustraciones porque no se aportaron fotografías para esos productos. No se eliminó ni modificó ningún archivo de `assets` y no se cambiaron nombres ni precios de productos.

Para revisar el diseño, abrí la carpeta completa en VS Code y ejecutá **Open with Live Server** sobre `index.html`, o utilizá el servidor Python indicado arriba. Revisá la sección Colección tanto en escritorio como en modo celular y probá los filtros y el carrito. Si ves una versión anterior, realizá una recarga forzada.

Validación de 2.0 en Chromium: seis productos, todos los filtros, agregar, aumentar, reducir y eliminar unidades, totales, persistencia al recargar, carrito vacío, cierre con Escape y recuperación de almacenamiento corrupto. Se verificaron todos los recursos sin errores HTTP ni JavaScript y ausencia de desbordamiento horizontal en 320, 360, 390, 768, 1024 y 1440 px. Se respeta la preferencia de movimiento reducido.
