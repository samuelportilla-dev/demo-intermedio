/**
 * Aplicación Principal - SmartMenu Orders
 * Renderiza dinámicamente la UI basándose en RESTAURANT_CONFIG y maneja el carrito.
 */

let carrito = {}; 
let categoriaActual = "Todos"; 

function transformarLinkImagen(url) {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=view&id=${match[1]}`;
        }
    }
    return url;
}

function formatoDinero(valor) {
    return RESTAURANT_CONFIG.moneda + parseFloat(valor).toLocaleString('es-CO');
}

document.addEventListener("DOMContentLoaded", async () => {
    const progress = document.querySelector(".preloader-progress");
    if (progress) progress.style.width = "40%";

    inicializarTema();
    renderizarHeader();
    mostrarSkeletons(); 
    
    await cargarDatosDesdeSheet(); 
    if (progress) progress.style.width = "80%";

    renderizarPromociones();
    renderizarCategorias();
    renderizarProductos();
    inicializarScrollProgresivo(); 
    actualizarEstadoRestaurante(); 
    renderizarMiniMenuCats(); 
    inicializarObserverLiquid(); 

    if (progress) progress.style.width = "100%";

    // Delay de gracia para que se note la animación premium
    setTimeout(() => {
        const preloader = document.getElementById("ui-preloader");
        if (preloader) preloader.classList.add("preloader-hidden");
    }, 1500);
});

function inicializarObserverLiquid() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revelado");
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Se activa un poco antes de estar totalmente visible
    });

    const cards = document.querySelectorAll(".card-producto");
    cards.forEach(card => observer.observe(card));
}

function toggleMiniMenuCategorias(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById("mini-menu-categorias");
    menu.classList.toggle("visible");
}

function renderizarMiniMenuCats() {
    const contenedor = document.getElementById("mini-menu-categorias");
    if (!contenedor) return;

    let html = `<button class="btn-mini-cat" onclick="seleccionarCategoriaMini('Todos')">✨ Todos</button>`;
    RESTAURANT_CONFIG.categorias.forEach(cat => {
        html += `<button class="btn-mini-cat" onclick="seleccionarCategoriaMini('${cat}')">${cat}</button>`;
    });
    contenedor.innerHTML = html;

    // Cerrar al hacer clic fuera (con un pequeño delay para evitar conflictos de eventos)
    setTimeout(() => {
        document.addEventListener("click", (e) => {
            if (!contenedor.contains(e.target)) {
                contenedor.classList.remove("visible");
            }
        });
    }, 100);
}

function seleccionarCategoriaMini(cat) {
    categoriaActual = cat;
    
    // Resaltar en el mini menú si fuera necesario, pero lo más importante es renderizar
    renderizarProductos();
    inicializarObserverLiquid(); // Re-observar nuevos elementos
    
    document.getElementById("mini-menu-categorias").classList.remove("visible");
    
    // Scroll suave hasta el catálogo
    const catálogo = document.getElementById("ui-contenedor-menu");
    if (catálogo) {
        const rect = catálogo.getBoundingClientRect();
        const pos = rect.top + window.scrollY - 100;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    }
}

function actualizarEstadoRestaurante() {
    const contenedor = document.getElementById("ui-estado-restaurante");
    if (!contenedor) return;

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minActual = ahora.getMinutes();
    
    const [hApertura, mApertura] = (RESTAURANT_CONFIG.horarios?.apertura || "11:00").split(':').map(Number);
    const [hCierre, mCierre] = (RESTAURANT_CONFIG.horarios?.cierre || "22:00").split(':').map(Number);

    const minutosActuales = horaActual * 60 + minActual;
    const minutosApertura = hApertura * 60 + mApertura;
    const minutosCierre = hCierre * 60 + mCierre;

    const estaAbierto = minutosActuales >= minutosApertura && minutosActuales < minutosCierre;

    if (estaAbierto) {
        contenedor.className = "estado-pill estado-abierto";
        contenedor.innerHTML = `<span class="punto-luz"></span> Abierto Ahora`;
    } else {
        contenedor.className = "estado-pill estado-cerrado";
        contenedor.innerHTML = `<span class="punto-luz"></span> Cerrado (Abre ${RESTAURANT_CONFIG.horarios?.apertura || "11:00"} PM)`;
    }
}

function mostrarSkeletons() {
    const contenedor = document.getElementById("ui-contenedor-menu");
    contenedor.innerHTML = `
        <div class="grilla-productos">
            <div class="card-producto skeleton"></div>
            <div class="card-producto skeleton"></div>
            <div class="card-producto skeleton"></div>
            <div class="card-producto skeleton"></div>
        </div>
    `;
}

function inicializarTema() {
    const root = document.documentElement;
    if(RESTAURANT_CONFIG.colores) {
        if(RESTAURANT_CONFIG.colores.principal) root.style.setProperty('--color-principal', RESTAURANT_CONFIG.colores.principal);
        if(RESTAURANT_CONFIG.colores.secundario) root.style.setProperty('--color-secundario', RESTAURANT_CONFIG.colores.secundario);
        if(RESTAURANT_CONFIG.colores.fondo) root.style.setProperty('--color-fondo', RESTAURANT_CONFIG.colores.fondo);
    }
}

function renderizarHeader() {
    const contenedorHeader = document.getElementById("ui-nombre-restaurante");
    if (RESTAURANT_CONFIG.logo && RESTAURANT_CONFIG.logo !== "") {
        contenedorHeader.innerHTML = `<img src="${RESTAURANT_CONFIG.logo}" alt="${RESTAURANT_CONFIG.nombre}" class="logo-hero">`;
    } else {
        contenedorHeader.innerHTML = `<h1>${RESTAURANT_CONFIG.nombre}</h1>`;
    }
    
    // Renderizado del Slogan
    const contenedorSlogan = document.getElementById("ui-slogan");
    if (contenedorSlogan) {
        contenedorSlogan.textContent = RESTAURANT_CONFIG.slogan || "";
    }
}

function renderizarPromociones() {
    const contenedor = document.getElementById("ui-promociones");
    if (!contenedor || !RESTAURANT_CONFIG.promociones || RESTAURANT_CONFIG.promociones.length === 0) return;

    contenedor.innerHTML = "";
    RESTAURANT_CONFIG.promociones.forEach(promo => {
        const card = document.createElement("div");
        card.className = "promo-card";
        // Si el fondo parece ser una URL de imagen, lo pone con overlay
        if (promo.fondo.startsWith('http')) {
            card.style.backgroundImage = `url('${promo.fondo}')`;
            card.style.backgroundSize = "cover";
            card.style.backgroundPosition = "center";
        } else {
            card.style.background = promo.fondo;
        }
        card.innerHTML = `
            <div class="overlay-promo"></div>
            <div class="promo-content">
                <h4>${promo.titulo}</h4>
                <p>${promo.descripcion}</p>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function renderizarCategorias() {
    const contenedor = document.getElementById("ui-nav-categorias");
    contenedor.innerHTML = "";
    
    const btnTodos = document.createElement("button");
    btnTodos.className = "btn-categoria activa";
    btnTodos.textContent = "Todos";
    btnTodos.onclick = () => filtrarPorCategoria("Todos", btnTodos);
    contenedor.appendChild(btnTodos);

    RESTAURANT_CONFIG.categorias.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "btn-categoria";
        btn.textContent = cat;
        btn.onclick = () => filtrarPorCategoria(cat, btn);
        contenedor.appendChild(btn);
    });
}

function filtrarPorCategoria(categoria, botonHtml) {
    categoriaActual = categoria;
    const botones = document.querySelectorAll(".btn-categoria");
    botones.forEach(btn => btn.classList.remove("activa"));
    botonHtml.classList.add("activa");
    renderizarProductos();
}

let terminoBusqueda = "";

function filtrarProductos() {
    terminoBusqueda = document.getElementById("input-busqueda").value.toLowerCase().trim();
    renderizarProductos();
}

function renderizarProductos() {
    const contenedor = document.getElementById("ui-contenedor-menu");
    contenedor.innerHTML = "";

    const categoriasAMostrar = categoriaActual === "Todos" 
        ? RESTAURANT_CONFIG.categorias 
        : [categoriaActual];

    categoriasAMostrar.forEach(cat => {
        // Filtrar por categoría y disponibilidad
        let productosCat = RESTAURANT_CONFIG.productos.filter(p => p.categoria === cat && p.disponible !== false);
        
        // Aplicar filtro de búsqueda si existe
        if (terminoBusqueda) {
            productosCat = productosCat.filter(p => {
                const nombreNorm = p.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const descNorm = (p.descripcion || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const termNorm = terminoBusqueda.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return nombreNorm.includes(termNorm) || descNorm.includes(termNorm);
            });
        }

        if (productosCat.length === 0) return; 

        const seccion = document.createElement("section");
        seccion.className = "seccion-categoria";
        seccion.id = `cat-${cat.replace(/\s+/g, '')}`; // ID para el scroll progresivo
        
        // Mostrar título siempre que haya productos
        const h3 = document.createElement("h3");
        h3.className = "titulo-categoria";
        h3.innerHTML = `<span style="color: var(--color-principal)">●</span> ${cat}`;
        seccion.appendChild(h3);

        const grilla = document.createElement("div");
        grilla.className = "grilla-productos";

        productosCat.forEach(prod => {
            const imgSegura = transformarLinkImagen(prod.imagen);
            const tieneDescuento = prod.precioOriginal && prod.precioOriginal > prod.precio;
            const descuentoPct = tieneDescuento ? Math.round(((prod.precioOriginal - prod.precio) / prod.precioOriginal) * 100) : 0;
            
            // Lógica de Badges Automáticos
            let badgeHtml = "";
            const nombreLower = prod.nombre.toLowerCase();
            const descLower = (prod.descripcion || "").toLowerCase();

            if (nombreLower.includes("especial") || descLower.includes("casa") || descLower.includes("recomendado")) {
                badgeHtml = `<div class="badge-tag tag-favorito">⭐ Favorito</div>`;
            } else if (nombreLower.includes("veggie") || descLower.includes("vegan") || descLower.includes("vegetariana")) {
                badgeHtml = `<div class="badge-tag tag-veggie">🌱 Veggie</div>`;
            } else if (prod.precioOriginal > 50000 || descLower.includes("pedido")) {
                badgeHtml = `<div class="badge-tag tag-hot">🔥 Más Pedido</div>`;
            }

            const card = document.createElement("article");
            card.className = "card-producto";
            card.onclick = () => abrirModalProducto(prod.id);
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${imgSegura}" alt="${prod.nombre}" loading="lazy" class="imagen-producto">
                    ${tieneDescuento ? `<div class="badge-descuento">-${descuentoPct}%</div>` : ""}
                    ${badgeHtml}
                    <div class="precio-tag">
                        ${tieneDescuento ? `<span class="precio-old">${formatoDinero(prod.precioOriginal)}</span>` : ""}
                        <span class="precio-actual">${formatoDinero(prod.precio)}</span>
                    </div>
                </div>
                <div class="info-producto">
                    <h4 class="nombre-producto">${prod.nombre}</h4>
                    <p class="descripcion-producto">${prod.descripcion}</p>
                    <button class="btn-agregar" onclick="event.stopPropagation(); agregarDesdeGrilla('${prod.id}', event)">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Añadir 
                    </button>
                </div>
            `;
            grilla.appendChild(card);
        });

        seccion.appendChild(grilla);
        contenedor.appendChild(seccion);
    });
    
    // Si no hay resultados de búsqueda en ninguna categoría
    if (terminoBusqueda && contenedor.innerHTML === "") {
        contenedor.innerHTML = `
            <div class="busqueda-vacia" style="text-align: center; padding: 4rem 2rem; opacity: 0.6;">
                <p style="font-size: 3rem;">🔍</p>
                <h3 style="margin-top: 1rem;">No encontramos nada que coincida con "${terminoBusqueda}"</h3>
                <p>Prueba con otros términos o categorias</p>
            </div>
        `;
    }
}

function agregarDesdeGrilla(id, event) {
    const prod = obtenerProducto(id);
    if (!prod) return;
    
    // Si tiene modificadores, forzamos abrir el modal en vez de agregar directo
    if (prod.modificadores && prod.modificadores.length > 0) {
        abrirModalProducto(id);
        return;
    }
    
    agregarAlCarrito(id, [], event.currentTarget);
}

function agregarAlCarrito(id, modsSeleccionados = [], elementoOrigen = null) {
    const hash = id + (modsSeleccionados.length > 0 ? '|' + modsSeleccionados.map(m => m.nombre).join('|') : '');
    
    if (carrito[hash]) {
        carrito[hash].cantidad++;
    } else {
        carrito[hash] = {
            id: id,
            cantidad: 1,
            modificadores: modsSeleccionados
        };
    }
    
    if (elementoOrigen) {
        animarVueloAlCarrito(elementoOrigen);
    }
    
    const flotante = document.getElementById("btn-flotante-carrito");
    flotante.classList.add("pop-carrito");
    setTimeout(() => { flotante.classList.remove("pop-carrito"); }, 300);

    actualizarUiCarrito();
}

function calcularPrecioItem(item) {
    const prod = obtenerProducto(item.id);
    let precio = parseFloat(prod.precio) || 0;
    
    if (item.modificadores && item.modificadores.length > 0) {
        item.modificadores.forEach(m => {
            precio += (parseFloat(m.precio) || 0);
        });
    }
    return precio;
}

function cambiarCantidad(hash, delta) {
    if (!carrito[hash]) return;
    carrito[hash].cantidad += delta;
    if (carrito[hash].cantidad <= 0) delete carrito[hash];
    actualizarUiCarrito();
}

function obtenerProducto(id) {
    if (!id) return { precio: 0, nombre: "Cargando..." };
    
    // Buscamos con limpieza exhaustiva de IDs
    const buscado = id.toString().trim().toLowerCase();
    const encontrado = RESTAURANT_CONFIG.productos.find(p => {
        if (!p.id) return false;
        return p.id.toString().trim().toLowerCase() === buscado;
    });

    return encontrado || { precio: 0, nombre: "No encontrado", id: id };
}

function actualizarUiCarrito() {
    let cantidadTotal = 0;
    let precioTotal = 0;
    
    for (const hash in carrito) {
        const item = carrito[hash];
        cantidadTotal += item.cantidad;
        precioTotal += (calcularPrecioItem(item) * item.cantidad);
    }

    const flotante = document.getElementById("btn-flotante-carrito");
    const labelCant = document.getElementById("ui-cantidad-flotante");
    const labelTotal = document.getElementById("ui-total-flotante");
    const labelTotalInterior = document.getElementById("ui-total-carrito");
    
    labelCant.textContent = cantidadTotal;
    labelTotal.textContent = formatoDinero(precioTotal);
    labelTotalInterior.textContent = formatoDinero(precioTotal);

    if (cantidadTotal > 0) flotante.classList.remove("oculto");
    else {
        flotante.classList.add("oculto");
        cerrarCarrito(); 
    }

    renderizarItemsCarrito();
    renderizarSugerenciasCarrito();
}

function renderizarItemsCarrito() {
    const contenedor = document.getElementById("ui-carrito-body");
    
    if (Object.keys(carrito).length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <div class="carrito-vacio-icono">🛒</div>
                <p>Tu pedido está vacío</p>
                <p style="font-size: 0.9rem; margin-top: 5px; opacity: 0.7;">Agrega algunas exquisiteces</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";
    
    for (const hash in carrito) {
        const itemObj = carrito[hash];
        const prod = obtenerProducto(itemObj.id);
        const precioUnitario = calcularPrecioItem(itemObj);
        
        let htmlMods = "";
        if (itemObj.modificadores.length > 0) {
            htmlMods = `<div class="item-mods-cart" style="font-size: 0.75rem; color: var(--color-texto-claro); margin-top:2px;">`;
            itemObj.modificadores.forEach(m => {
                htmlMods += `+ ${m.nombre} <br>`;
            });
            htmlMods += `</div>`;
        }

        const item = document.createElement("div");
        item.className = "item-carrito";
        item.innerHTML = `
            <img src="${transformarLinkImagen(prod.imagen)}" class="item-img-cart" alt="${prod.nombre}">
            <div class="item-info-cart">
                <div class="item-nombre-cart">${prod.nombre}</div>
                ${htmlMods}
                <div class="item-precio-cart">${formatoDinero(precioUnitario)} x ${itemObj.cantidad}</div>
            </div>
            <div class="control-cantidad">
                <button class="btn-cant" onclick="cambiarCantidad('${hash}', -1)">-</button>
                <span>${itemObj.cantidad}</span>
                <button class="btn-cant" onclick="cambiarCantidad('${hash}', 1)">+</button>
            </div>
        `;
        contenedor.appendChild(item);
    }
}

// Algoritmo de Venta Cruzada (Sugerencias Inteligentes)
function renderizarSugerenciasCarrito() {
    const contenedor = document.getElementById("ui-sugerencias-carrito");
    if (!contenedor) return;

    if (Object.keys(carrito).length === 0) {
        contenedor.innerHTML = "";
        return;
    }

    let tieneComida = false;
    let tieneBebida = false;
    let tienePostre = false;

    // Analizamos el carrito actual
    for (const hash in carrito) {
        const prod = obtenerProducto(carrito[hash].id);
        if (!prod) continue;
        if (prod.categoria === "Bebidas") tieneBebida = true;
        else if (prod.categoria === "Postres") tienePostre = true;
        else tieneComida = true;
    }

    let catSugerida = "";
    let tituloMsg = "";

    // Lógicas de sugerencias ("Si compró X pero no Y, sugerir Y")
    if (tieneComida && !tieneBebida) {
        catSugerida = "Bebidas";
        tituloMsg = "🥤 ¿No olvides tu bebida?";
    } else if (tieneComida && !tienePostre) {
        catSugerida = "Postres";
        tituloMsg = "🍰 ¿Un postrecito para el final?";
    } else if (tieneBebida && !tieneComida) {
        catSugerida = "Entradas";
        tituloMsg = "🍕 ¿Acompañamos con algo para picar?";
    } else if (tienePostre && !tieneComida) {
        catSugerida = "Bebidas";
        tituloMsg = "☕ ¿Un acompañante para tu postre?";
    }

    if (!catSugerida) {
        contenedor.innerHTML = ""; // No hay sugerencia, carrito "perfecto"
        return;
    }

    // Buscar todos los productos disponibles de la categoría sugerida
    const productosSugeribles = RESTAURANT_CONFIG.productos.filter(p => p.categoria === catSugerida && p.disponible);
    if (productosSugeribles.length === 0) {
        contenedor.innerHTML = "";
        return;
    }

    // Tomar uno ALEATORIO de la categoría sugerida
    const sugerencia = productosSugeribles[Math.floor(Math.random() * productosSugeribles.length)];

    // Renderizar
    contenedor.innerHTML = `
        <div class="sugerencia-titulo">${tituloMsg}</div>
        <div class="sugerencia-item" onclick="agregarAlCarrito('${sugerencia.id}', [], this)">
            <img src="${transformarLinkImagen(sugerencia.imagen)}" class="sugerencia-img" alt="${sugerencia.nombre}">
            <div class="sugerencia-info">
                <div class="sugerencia-nombre">${sugerencia.nombre}</div>
                <div class="sugerencia-precio">+ ${formatoDinero(sugerencia.precio)}</div>
            </div>
            <button class="btn-sugerencia-add" onclick="event.stopPropagation(); agregarAlCarrito('${sugerencia.id}', [], this)">
                 +
            </button>
        </div>
    `;
}

function abrirCarrito() {
    if(Object.values(carrito).reduce((a, b) => a + b, 0) === 0) return; 
    document.getElementById("overlay-carrito").classList.add("activo");
    document.getElementById("panel-carrito").classList.add("activo");
    document.body.style.overflow = "hidden"; 
}

function cerrarCarrito() {
    document.getElementById("overlay-carrito").classList.remove("activo");
    document.getElementById("panel-carrito").classList.remove("activo");
    document.body.style.overflow = ""; 
}

function enviarPedidoWP() {
    let textoPedido = RESTAURANT_CONFIG.mensajeWP || "Hola! Quiero hacer el siguiente pedido:\n";
    textoPedido += "------------------------\n";
    
    let totalPrecio = 0;
    for (const hash in carrito) {
        const itemObj = carrito[hash];
        const prod = obtenerProducto(itemObj.id);
        const precioUnitario = calcularPrecioItem(itemObj);
        const subtotal = precioUnitario * itemObj.cantidad;
        totalPrecio += subtotal;
        
        textoPedido += `▪ ${itemObj.cantidad}x ${prod.nombre} - ${formatoDinero(subtotal)}\n`;
        if (itemObj.modificadores.length > 0) {
            itemObj.modificadores.forEach(m => {
                textoPedido += `   + ${m.nombre}\n`;
            });
        }
    }
    
    textoPedido += "------------------------\n";
    textoPedido += `*TOTAL:* ${formatoDinero(totalPrecio)}\n`;
    
    const nota = document.getElementById("ui-nota-pedido").value.trim();
    if (nota !== "") textoPedido += `\n*Nota:* ${nota}`;

    const link = `https://wa.me/${RESTAURANT_CONFIG.telefonoWP}?text=${encodeURIComponent(textoPedido)}`;
    window.open(link, '_blank');
}

// ==========================================
// CARGA DINÁMICA DESDE GOOGLE SHEETS
// ==========================================
async function cargarDatosDesdeSheet() {
    if (!RESTAURANT_CONFIG.googleSheetUrl || RESTAURANT_CONFIG.googleSheetUrl === "") {
        console.log("No se detectó URL de Google Sheets. Usando datos locales.");
        return;
    }

    try {
        const urlFinal = RESTAURANT_CONFIG.googleSheetUrl + "&t=" + Date.now();
        const response = await fetch(urlFinal);
        const csvText = await response.text();
        
        const filas = csvText.split(/\r?\n/).filter(f => f.trim() !== "");
        if (filas.length <= 1) return;

        const cabeceraRaw = filas.shift();
        const cabecera = cabeceraRaw.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
        
        const colIndices = {
            id: cabecera.indexOf("id"),
            restId: cabecera.findIndex(h => h.includes("restaurante")),
            categoria: cabecera.findIndex(h => h.includes("categoria")),
            nombre: cabecera.findIndex(h => h.includes("nombre")),
            descripcion: cabecera.findIndex(h => h.includes("descripcion")),
            precio: cabecera.findIndex(h => h.includes("precio") && !h.includes("original")),
            precioOriginal: cabecera.findIndex(h => h.includes("original") || h.includes("viejo") || h.includes("antes")),
            imagen: cabecera.findIndex(h => h.includes("imagen")),
            disponible: cabecera.findIndex(h => h.includes("disponible")),
            mods: cabecera.findIndex(h => h.includes("modificadores"))
        };

        const RESTAURANT_ID = (window.RESTAURANT_CONFIG && RESTAURANT_CONFIG.id) ? RESTAURANT_CONFIG.id : "lanonna"; 
        const RID_BUSCADO = RESTAURANT_ID.toString().toLowerCase().trim();

        const limpiarPrecio = (val) => {
            if (!val) return 0;
            // Quitar $, puntos, comas y espacios para quedarnos solo con el número
            const limpio = val.toString().replace(/[$. ]/g, "").replace(",", ".");
            return parseFloat(limpio) || 0;
        };

        const productosNuevos = [];

        filas.forEach((fila, idx) => {
            const rowStr = (fila || "").trim();
            if (!rowStr) return;

            const columnas = rowStr.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
            
            if (colIndices.restId === -1 || colIndices.restId >= columnas.length) return;

            const ridCelda = (columnas[colIndices.restId] || "").toString().toLowerCase().trim();
            if (ridCelda !== RID_BUSCADO) return;

            if (colIndices.nombre === -1 || !columnas[colIndices.nombre]) return;

            const modificadores = [];
            const indexMods = colIndices.mods;
            if (indexMods !== -1 && columnas[indexMods]) {
                columnas[indexMods].split(';').forEach(par => {
                    const [n, p] = par.split(':');
                    if (n && p) modificadores.push({ nombre: n.trim(), precio: parseFloat(p.trim()) });
                });
            }

            productosNuevos.push({
                id: colIndices.id !== -1 ? columnas[colIndices.id] : Date.now() + idx,
                categoria: colIndices.categoria !== -1 ? columnas[colIndices.categoria] : "General",
                nombre: columnas[colIndices.nombre],
                descripcion: colIndices.descripcion !== -1 ? columnas[colIndices.descripcion] : "",
                precio: colIndices.precio !== -1 ? limpiarPrecio(columnas[colIndices.precio]) : 0,
                precioOriginal: colIndices.precioOriginal !== -1 ? limpiarPrecio(columnas[colIndices.precioOriginal]) : 0,
                imagen: colIndices.imagen !== -1 ? columnas[colIndices.imagen] : "",
                disponible: colIndices.disponible !== -1 ? (columnas[colIndices.disponible].toUpperCase() === "TRUE") : true,
                modificadores: modificadores
            });
        });

        if (productosNuevos.length > 0) {
            RESTAURANT_CONFIG.productos = productosNuevos;
            const cats = [...new Set(productosNuevos.map(p => p.categoria))];
            if (cats.length > 0) RESTAURANT_CONFIG.categorias = cats;
            renderizarCategorias();
            renderizarProductos();
        }

    } catch (error) {
        console.error("Error al cargar datos desde Sheets:", error);
    }
}

// ==========================================
// MODAL DE PRODUCTO
// ==========================================
function abrirModalProducto(id) {
    const prod = obtenerProducto(id);
    if (!prod) return;

    const imgSegura = transformarLinkImagen(prod.imagen);
    const modal = document.getElementById("modal-producto");
    const tieneDescuento = prod.precioOriginal && prod.precioOriginal > prod.precio;
    
    let htmlChecks = "";
    if (prod.modificadores && prod.modificadores.length > 0) {
        htmlChecks = `<div class="modificadores-container">
            <div class="mod-grupo">
                <h4>Adiciones</h4>`;
        prod.modificadores.forEach((mod, index) => {
            htmlChecks += `
            <input type="checkbox" id="mod-${index}" class="mod-checkbox" value="${index}" data-nombre="${mod.nombre}" data-precio="${mod.precio}" onchange="recalcularPrecioModal(${prod.precio})">
            <label for="mod-${index}" class="mod-label">
                <div class="mod-check-circle"></div>
                <div class="mod-info">
                    <span class="mod-nombre">${mod.nombre}</span>
                    <span class="mod-precio">${mod.precio > 0 ? '+'+formatoDinero(mod.precio) : 'Gratis'}</span>
                </div>
            </label>`;
        });
        htmlChecks += `</div></div>`;
    }
    
    modal.innerHTML = `
        <button class="btn-cerrar-modal-producto" onclick="cerrarModalProducto(event)">✕</button>
        <div class="modal-producto-img-container">
            <img src="${imgSegura}" alt="${prod.nombre}" id="img-modal-target" class="modal-producto-img">
            ${tieneDescuento ? `<div class="modal-badge-descuento">OFERTA</div>` : ''}
        </div>
        <div class="modal-producto-content-wrapper">
            <div class="modal-producto-body">
                <h3 class="modal-producto-titulo">${prod.nombre}</h3>
                <p class="modal-producto-desc">${prod.descripcion}</p>
                ${htmlChecks}
            </div>
            <div class="modal-producto-footer">
                <div class="contenedor-precio-modal">
                    ${tieneDescuento ? `<span class="modal-precio-old">${formatoDinero(prod.precioOriginal)}</span>` : ''}
                    <div class="modal-precio" id="ui-modal-precio-dinamico">${formatoDinero(prod.precio)}</div>
                </div>
                <button class="btn-agregar-modal" id="btn-modal-add" onclick="agregarDesdeModal('${prod.id}', event)">
                    Añadir al pedido
                </button>
            </div>
        </div>
    `;

    document.getElementById("overlay-producto").classList.add("activo");
    document.body.style.overflow = "hidden"; 
}

function recalcularPrecioModal(precioBase) {
    const checks = document.querySelectorAll('.mod-checkbox:checked');
    let totalCálculo = precioBase;
    checks.forEach(c => totalCálculo += parseFloat(c.dataset.precio));
    document.getElementById("ui-modal-precio-dinamico").textContent = formatoDinero(totalCálculo);
}

function agregarDesdeModal(id, event) {
    const checks = document.querySelectorAll('.mod-checkbox:checked');
    let modificadores = [];
    checks.forEach(c => {
        modificadores.push({
            nombre: c.dataset.nombre,
            precio: parseFloat(c.dataset.precio)
        });
    });
    
    const boton = document.getElementById("btn-modal-add");
    agregarAlCarrito(id, modificadores, boton);
    cerrarModalProducto(event);
}

// ==========================================
// ANIMACIÓN: VUELO AL CARRITO
// ==========================================
function animarVueloAlCarrito(elementoOrigen) {
    if (!elementoOrigen) return;

    // Buscar una imagen cercana para animar (si no hay, usamos la original si se pasa)
    let imgElement;
    if (elementoOrigen.id === "btn-modal-add") {
        imgElement = document.getElementById("img-modal-target");
    } else {
        // Buscar la imagen en el padre
        const card = elementoOrigen.closest('.card-producto') || elementoOrigen.closest('.sugerencia-item');
        if (card) imgElement = card.querySelector('img');
    }

    if (!imgElement) return;

    const btnCart = document.getElementById("btn-flotante-carrito");
    if (!btnCart) return;

    const rectImg = imgElement.getBoundingClientRect();
    const rectCart = btnCart.getBoundingClientRect();

    const imgClon = imgElement.cloneNode(true);
    imgClon.className = "img-vuelo-animacion";
    imgClon.style.top = rectImg.top + "px";
    imgClon.style.left = rectImg.left + "px";
    imgClon.style.width = rectImg.width + "px";
    imgClon.style.height = rectImg.height + "px";
    
    document.body.appendChild(imgClon);

    // Forzar reflow
    void imgClon.offsetWidth;

    // Calculamos destino (centro del botón flotante)
    const destX = rectCart.left + (rectCart.width / 2) - (rectImg.width / 2);
    const destY = rectCart.top + (rectCart.height / 2) - (rectImg.height / 2);

    imgClon.style.transform = `translate(${destX - rectImg.left}px, ${destY - rectImg.top}px) scale(0.1)`;
    imgClon.style.opacity = "0";

    // Si el navegador permite vibración táctil
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    setTimeout(() => {
        imgClon.remove();
    }, 600); // Duración de la transición
}

function cerrarModalProducto(event) {
    if (event) event.stopPropagation();
    document.getElementById("overlay-producto").classList.remove("activo");
    if (!document.getElementById("overlay-carrito").classList.contains("activo")) {
        document.body.style.overflow = "";
    }
}

// ==========================================
// SCROLL PROGRESIVO: RESALTADO SIDEBAR
// ==========================================
function inicializarScrollProgresivo() {
    if (window.innerWidth < 1024) return; // Solo Desktop

    const sections = document.querySelectorAll('.seccion-categoria');
    const navLinks = document.querySelectorAll('.btn-categoria');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Detecta cuando la sección está en el tercio superior
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('scrolled-active');
                    // Comparamos el texto del botón con el ID de la sección (o similar lógica)
                    // En tu caso el ID es "cat-N", pero el texto es el nombre de la categoría
                    if (link.getAttribute('onclick').includes(id.split('-')[1])) {
                        link.classList.add('scrolled-active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}
