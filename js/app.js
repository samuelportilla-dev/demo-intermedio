/**
 * Aplicación Principal - SmartMenu Orders
 * Renderiza dinámicamente la UI basándose en RESTAURANT_CONFIG y maneja el carrito.
 */

let carrito = {}; 
let categoriaActual = "Todos"; 
let ultimoIdAgregado = null; // Para animaciones de impacto
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
    inicializarTema();
    
    // Feature 08: Recuperador de Carrito
    recuperarCarrito();
    
    // Only run menu-specific rendering if the menu container exists
    const menuContainer = document.getElementById("menu-container") || document.getElementById("ui-contenedor-menu") || document.getElementById("mn-main");
    if (menuContainer) {
        renderizarHeader();
        mostrarSkeletons(); 
        
        // await cargarDatosDesdeSheet(); 
        
        renderizarPromociones();
        renderizarCategorias();
        renderizarEspecialDia(); // Feature 17
        renderizarProductos(); 
        inicializarObserverLiquid(); 
        inicializarScrollProgresivo(); 
        actualizarEstadoRestaurante(); 
        renderizarMiniMenuCats(); 
        inicializarObserverLiquid(); 
    } else {
        // If it's not the menu page, we just load sheet data silently for the cart logic mostly
        // or just apply basic theming
        // await cargarDatosDesdeSheet();
    }

    // Common global initializations
    actualizarUiCarrito(); // Ensure dynamic cart badge works globally
});

// Feature 08: Recuperador de Carrito Logic
function recuperarCarrito() {
    const saved = localStorage.getItem("oldwest_cart_v2");
    if (!saved) return;

    try {
        const { data, timestamp } = JSON.parse(saved);
        const ahora = Date.now();
        const dosHoras = 2 * 60 * 60 * 1000;

        if (ahora - timestamp < dosHoras) {
            carrito = data;
            console.log("🛒 Carrito recuperado de la sesión anterior.");
            // Opcional: Podríamos mostrar un toast discreto aquí
        } else {
            localStorage.removeItem("oldwest_cart_v2");
        }
    } catch (e) {
        console.error("Error recuperando carrito:", e);
    }
}

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

    const isSubPage = window.location.pathname.includes('/pages/');
    const isLegal = window.location.pathname.includes('/legal/');
    let imgPrefix = "";
    if (isLegal) imgPrefix = "../../../";
    else if (isSubPage) imgPrefix = "../../";

    const metadataCategorias = {
        "Todos": { desc: "Explora la experiencia completa de nuestro grill.", icon: imgPrefix + "img/banner.webp" },
        "Hamburguesas (Oferta Exclusiva)": { desc: "El mejor blend de carne con pan artesanal.", icon: imgPrefix + "img/SMASH BURGER.webp" },
        "Cortes Premium": { desc: "Los cortes de res y cerdo más jugosos.", icon: imgPrefix + "img/TOMAHAWK ANGUS BEEF.webp" },
        "Aves y BBQ": { desc: "Pollo y alitas marinadas al estilo Texas.", icon: imgPrefix + "img/TEXAS CHICKEN.webp" },
        "Para Compartir": { desc: "Combos generosos para disfrutar en grupo.", icon: imgPrefix + "img/Picada Wild West.png" },
        "Bebidas": { desc: "Selección refrescante para acompañar.", icon: imgPrefix + "img/Bebidas/LIMONADA NATURAL.avif" }
    };

    let html = `
        <div class="bottom-sheet-handle"></div>
        <div class="bottom-sheet-header">
            <h3>Categorías</h3>
            <p>Selecciona una sección para navegar</p>
        </div>
        <div class="bottom-sheet-grid">
            <button class="btn-mini-cat" onclick="seleccionarCategoriaMini('Todos')">
                <div class="cat-icon"><img src="${metadataCategorias['Todos'].icon}" alt="Icon"></div>
                <div class="cat-info">
                    <span class="cat-name">Todo el Menú</span>
                    <span class="cat-desc">${metadataCategorias['Todos'].desc}</span>
                </div>
            </button>
    `;

    RESTAURANT_CONFIG.categorias.forEach(cat => {
        const meta = metadataCategorias[cat] || { desc: "Nuestros mejores platillos.", icon: imgPrefix + "img/logo.png" };
        html += `
            <button class="btn-mini-cat" onclick="seleccionarCategoriaMini('${cat}')">
                <div class="cat-icon"><img src="${meta.icon}" alt="${cat}"></div>
                <div class="cat-info">
                    <span class="cat-name">${cat}</span>
                    <span class="cat-desc">${meta.desc}</span>
                </div>
            </button>
        `;
    });
    
    html += `</div>`;
    contenedor.innerHTML = html;

    // Cerrar al hacer clic fuera (con un pequeño delay para evitar conflictos de eventos)
    setTimeout(() => {
        document.addEventListener("click", (e) => {
            if (!contenedor.contains(e.target) && !e.target.closest('#cat-filter-btn')) {
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
    const catálogo = document.getElementById("mn-grid-dinamico") || document.getElementById("menu-container") || document.getElementById("ui-contenedor-menu") || document.getElementById("mn-main");
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
    const contenedor = document.getElementById("mn-grid-dinamico") || document.getElementById("menu-container") || document.getElementById("ui-contenedor-menu") || document.getElementById("mn-main");
    if (!contenedor) return;
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
    if (!contenedorHeader) return;
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
    if (!contenedor) return;
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
    const input = document.getElementById("menu-search-input") || document.getElementById("input-busqueda");
    terminoBusqueda = input ? input.value.toLowerCase().trim() : "";
    renderizarProductos();
}

function ejecutarBusqueda(query) {
    filtrarProductos();
}

function renderizarProductos() {
    const contenedor = document.getElementById("mn-grid-dinamico") || document.getElementById("menu-container") || document.getElementById("ui-contenedor-menu") || document.getElementById("mn-main");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    // Si hay búsqueda, ignoramos la categoría seleccionada para buscar en todo el menú
    const categoriasAMostrar = (categoriaActual === "Todos" || (terminoBusqueda && terminoBusqueda.length > 0))
        ? RESTAURANT_CONFIG.categorias 
        : [categoriaActual];

    let algunResultado = false;

    categoriasAMostrar.forEach(cat => {
        // Filtrar por categoría y disponibilidad
        let productosCat = RESTAURANT_CONFIG.productos.filter(p => p.categoria === cat && p.disponible !== false);
        
        // Aplicar filtro de búsqueda si existe
        if (terminoBusqueda) {
            const termNorm = terminoBusqueda.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            productosCat = productosCat.filter(p => {
                const nombreNorm = p.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const descNorm = (p.descripcion || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                return nombreNorm.includes(termNorm) || descNorm.includes(termNorm);
            });
        }

        if (productosCat.length === 0) return; 
        algunResultado = true;

        const seccion = document.createElement("section");
        seccion.className = "seccion-categoria revelado"; // Forzamos revelado ya que se inyecta dinámicamente
        const realIndex = RESTAURANT_CONFIG.categorias.indexOf(cat);
        seccion.id = `cat-${realIndex > -1 ? realIndex : cat.replace(/\s+/g, '')}`; 
        
        // Mostrar título siempre que haya productos
        const h3 = document.createElement("h3");
        h3.className = "menu-categoria-title";
        h3.innerHTML = `${cat}`;
        seccion.appendChild(h3);

        const grilla = document.createElement("div");
        grilla.className = "menu-grid";

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
            card.className = "card-producto producto-card";
            card.onclick = () => abrirModalProducto(prod.id);
            card.innerHTML = `
                <div class="card-img-wrapper producto-img-container">
                    <img src="${imgSegura}" alt="${prod.nombre}" loading="lazy" class="imagen-producto producto-img">
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
                <p>Prueba con otros términos o categorías</p>
            </div>
        `;
    }
    
    // IMPORTANTE: Reinicializar el observer para los nuevos elementos inyectados
    if (window.inicializarObserverLiquid) inicializarObserverLiquid();
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
    
    // Feedback visual en iconos de carrito (Desktop & Mobile)
    const btnDesktop = document.getElementById("open-drawer-btn");
    const btnMobile = document.getElementById("mobile-open-drawer");
    
    [btnDesktop, btnMobile].forEach(btn => {
        if (btn) {
            btn.classList.add("pop-carrito");
            setTimeout(() => btn.classList.remove("pop-carrito"), 300);
        }
    });

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
    
    // --- LÓGICA DE PRECIO Y DESCUENTOS (2x1) ---
    let itemsPara2x1 = [];
    let otrosPrecios = 0;

    for (const hash in carrito) {
        const item = carrito[hash];
        const prod = obtenerProducto(item.id);
        cantidadTotal += item.cantidad;
        
        const precioUnitario = calcularPrecioItem(item);

        // Si es Hamburguesa, entra en la bolsa del 2x1
        if (prod.categoria && prod.categoria.includes("Hamburguesas")) {
            for (let i = 0; i < item.cantidad; i++) {
                itemsPara2x1.push(precioUnitario);
            }
        } else {
            otrosPrecios += (precioUnitario * item.cantidad);
        }
    }

    // Calcular 2x1: Ordenamos de mayor a menor para cobrar las caras y regalar las baratas
    itemsPara2x1.sort((a, b) => b - a);
    let total2x1 = 0;
    let ahorro2x1 = 0;
    itemsPara2x1.forEach((precio, index) => {
        if (index % 2 === 0) total2x1 += precio; 
        else ahorro2x1 += precio; // Este es el ahorro
    });

    precioTotal = otrosPrecios + total2x1;
    window.ultimoAhorro = ahorro2x1; // Guardar para UI

    // Feature 08: Guardar en LocalStorage
    localStorage.setItem("oldwest_cart_v2", JSON.stringify({
        data: carrito,
        timestamp: Date.now()
    }));

    const flotante = document.getElementById("btn-flotante-carrito");
    const labelCant = document.getElementById("ui-cantidad-flotante");
    const labelTotal = document.getElementById("ui-total-flotante");
    const labelTotalInterior = document.getElementById("ui-total-carrito");
    
    // Mega Drawer Updates
    const drawerCount = document.getElementById("drawer-count");
    const drawerTotal = document.getElementById("drawer-total");
    const mobileBadge = document.getElementById("mobile-cart-badge");

    if (drawerCount) drawerCount.textContent = `(${cantidadTotal})`;
    if (drawerTotal) drawerTotal.textContent = formatoDinero(precioTotal);
    
    // Inyectar ahorro en el drawer si existe
    const savingsContainer = document.getElementById("drawer-savings-badge");
    if (savingsContainer) {
        if (ahorro2x1 > 0) {
            savingsContainer.innerHTML = `<i class="fas fa-gift"></i> ¡Ahorraste ${formatoDinero(ahorro2x1)} con el 2x1!`;
            savingsContainer.style.display = "block";
        } else {
            savingsContainer.style.display = "none";
        }
    }

    if (mobileBadge) {
         mobileBadge.textContent = cantidadTotal;
         mobileBadge.style.display = cantidadTotal > 0 ? "flex" : "none";
    }
    
    if(labelCant) labelCant.textContent = cantidadTotal;
    if(labelTotal) labelTotal.textContent = formatoDinero(precioTotal);
    if(labelTotalInterior) labelTotalInterior.textContent = formatoDinero(precioTotal);

    if (flotante) {
        if (cantidadTotal > 0) flotante.classList.remove("oculto");
        else {
            flotante.classList.add("oculto");
            cerrarCarrito(); 
        }
    }

    // Soporte para Menu Ultra (mn-floating-cart)
    const mnFloat = document.getElementById("mn-floating-cart");
    if (mnFloat) {
        if (cantidadTotal > 0) {
            mnFloat.classList.add("visible");
            mnFloat.style.display = "flex"; 
            
            const fCount = document.getElementById("f-cart-count");
            const fTotal = document.getElementById("f-cart-total");
            if (fCount) fCount.textContent = cantidadTotal;
            if (fTotal) fTotal.textContent = formatoDinero(precioTotal);
        } else {
            mnFloat.classList.remove("visible");
            mnFloat.style.display = "none"; 
        }
    }
    
    renderizarItemsCarrito();
    renderizarSugerenciasCarrito();
}

function renderizarItemsCarrito() {
    // Apoyamos tanto el carrito clásico como el mega drawer
    const contenedorClasico = document.getElementById("ui-carrito-body");
    const contenedorDrawer = document.getElementById("drawer-cart-items");
    
    let htmlContent = "";

    if (Object.keys(carrito).length === 0) {
        htmlContent = `
            <div class="empty-drawer">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <p>Tu pedido está vacío</p>
                <p style="font-size: 0.9rem; margin-top: 5px; opacity: 0.7;">Agrega algunas exquisiteces</p>
            </div>
        `;
    } else {
        for (const hash in carrito) {
            const itemObj = carrito[hash];
            const prod = obtenerProducto(itemObj.id);
            const precioUnitario = calcularPrecioItem(itemObj);
            
            let htmlMods = "";
            if (itemObj.modificadores.length > 0) {
                htmlMods = `<div style="font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top:2px;">`;
                itemObj.modificadores.forEach(m => {
                    htmlMods += `+ ${m.nombre} <br>`;
                });
                htmlMods += `</div>`;
            }

            const isNew = ultimoIdAgregado === hash;
            if (isNew) {
                // Resetear después de usarlo para que no se anime siempre
                setTimeout(() => { ultimoIdAgregado = null; }, 1000);
            }

            htmlContent += `
                <div class="drawer-item-row ${isNew ? 'new-added' : ''}">
                    <img src="${transformarLinkImagen(prod.imagen)}" class="drawer-item-img" alt="${prod.nombre}">
                    <div class="drawer-item-details">
                        <h4 style="margin-bottom: 5px;">${prod.nombre}</h4>
                        ${htmlMods}
                        <div class="drawer-item-price">${formatoDinero(precioUnitario)} x ${itemObj.cantidad}</div>
                    </div>
                    <div class="control-cantidad" style="background: rgba(255,255,255,0.1); border-radius: 10px; height: fit-content; align-self: center;">
                        <button class="btn-cant" onclick="cambiarCantidad('${hash}', -1)" style="color: white; border-right: 1px solid rgba(255,255,255,0.1)">-</button>
                        <span style="color: white; min-width: 25px; text-align: center; display: inline-block;">${itemObj.cantidad}</span>
                        <button class="btn-cant" onclick="cambiarCantidad('${hash}', 1)" style="color: white; border-left: 1px solid rgba(255,255,255,0.1)">+</button>
                    </div>
                </div>
            `;
        }
    }

    if (contenedorClasico) contenedorClasico.innerHTML = htmlContent;
    if (contenedorDrawer) contenedorDrawer.innerHTML = htmlContent;
}

// Algoritmo de Venta Cruzada (Sugerencias Inteligentes)
function renderizarSugerenciasCarrito() {
    const contenedor = document.getElementById("cross-sell-zone");
    if (!contenedor) return;

    if (Object.keys(carrito).length === 0) {
        contenedor.style.setProperty('display', 'none', 'important');
        return;
    }

    let tieneComida = false, tieneBebida = false, tieneCompartir = false;

    for (const hash in carrito) {
        const prod = obtenerProducto(carrito[hash].id);
        if (!prod) continue;
        const cat = prod.categoria;
        if (cat === "Bebidas") tieneBebida = true;
        else if (cat === "Para Compartir") tieneCompartir = true;
        else tieneComida = true;
    }

    let catSugerida = "", tituloMsg = "";

    if (tieneComida && !tieneBebida) {
        catSugerida = "Bebidas";
        tituloMsg = "🥤 ¿Acompañamos con una bebida?";
    } else if (tieneComida && !tieneCompartir) {
        catSugerida = "Para Compartir";
        tituloMsg = "🍟 ¿Algo para picar mientras tanto?";
    } else if (tieneCompartir && !tieneComida) {
        catSugerida = "Hamburguesas (Oferta Exclusiva)";
        tituloMsg = "🍔 ¿Cuál será tu plato fuerte?";
    } else if (tieneBebida && !tieneComida) {
        catSugerida = "Hamburguesas (Oferta Exclusiva)";
        tituloMsg = "🍔 ¿Acompañamos con una buena hamburguesa?";
    } else {
        if (!tieneBebida) {
            catSugerida = "Bebidas";
            tituloMsg = "🥤 ¡No olvides la hidratación!";
        }
    }

    if (!catSugerida) {
        contenedor.style.display = "none";
        return;
    }

    const productosSugeribles = RESTAURANT_CONFIG.productos.filter(p => p.categoria === catSugerida && p.disponible);
    if (productosSugeribles.length === 0) {
        contenedor.style.display = "none";
        return;
    }

    const sugerencia = productosSugeribles[Math.floor(Math.random() * productosSugeribles.length)];

    contenedor.style.display = "block";
    contenedor.style.opacity = "1";
    contenedor.style.visibility = "visible";


    contenedor.innerHTML = `
        <div class="cs-header">
            <i class="fas fa-magic"></i> <span>${tituloMsg.replace(/[^\w\s¿?]/g, '').trim().toUpperCase()}</span>
        </div>
        <div class="cross-sell-item" onclick="ejecutarSugerencia('${sugerencia.id}', this)">
            <img src="${transformarLinkImagen(sugerencia.imagen)}" class="cs-img" alt="${sugerencia.nombre}">
            <div class="cs-details">
                <div class="cs-name">${sugerencia.nombre}</div>
                <div class="cs-price">Añadir por +${formatoDinero(sugerencia.precio)}</div>
            </div>
            <button class="cs-add-btn" onclick="event.stopPropagation(); ejecutarSugerencia('${sugerencia.id}', this.parentElement)">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `;
}

function ejecutarSugerencia(id, elemento) {
    const zone = document.getElementById("cross-sell-zone");
    const btn = elemento.querySelector('.cs-add-btn') || elemento.closest('.cross-sell-item')?.querySelector('.cs-add-btn');
    const itemsList = document.getElementById("drawer-cart-items");
    
    if (zone) zone.classList.add("added");
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#2ecc71';
        btn.style.animation = 'none';
    }
    
    // 1. Esperar a que la tarjeta termine de encogerse (0.6s en CSS) para lanzar el punto
    setTimeout(() => {
        const rectCard = elemento.getBoundingClientRect();
        const particle = document.createElement("div");
        particle.className = "impact-particle";
        // El punto sale de donde estaba el centro de la tarjeta
        particle.style.top = (rectCard.top + rectCard.height / 2) + "px";
        particle.style.left = (rectCard.left + rectCard.width / 2) + "px";
        document.body.appendChild(particle);

        // 2. Animar el punto hacia la ubicación del último producto
        setTimeout(() => {
            const lastItem = itemsList.querySelector('.drawer-item-row:last-child');
            let destX, destY;

            if (lastItem) {
                const rectLast = lastItem.getBoundingClientRect();
                destX = rectLast.left + rectLast.width / 2;
                destY = rectLast.bottom + (rectLast.height / 3.5); 
            } else {
                const rectList = itemsList.getBoundingClientRect();
                destX = rectList.left + rectList.width / 2;
                destY = rectList.top + 20;
            }
            
            particle.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            particle.style.transform = `translate(${destX - (rectCard.left + rectCard.width / 2)}px, ${destY - (rectCard.top + rectCard.height / 2)}px) scale(0.3)`;
            particle.style.opacity = "0.2";

            // 3. Impacto e inserción
            setTimeout(() => {
                particle.remove();
                if (itemsList) itemsList.classList.add("impacted");
                
                ultimoIdAgregado = id; 
                agregarAlCarrito(id, [], null);

                setTimeout(() => {
                    if (itemsList) itemsList.classList.remove("impacted");
                    if (zone) {
                        zone.classList.remove("added");
                        renderizarSugerenciasCarrito(); 
                    }
                }, 400);
            }, 640);
        }, 50); // Pequeño delay para que el navegador procese el render de la partícula
    }, 480); // 480ms (20% más rápido que 600ms)
}

function abrirCarrito() {
    if(Object.values(carrito).reduce((a, b) => a + b, 0) === 0) return; 
    
    // Mega Drawer Premium Support
    const megaDrawer = document.getElementById("mega-drawer");
    const overlayDrawer = document.getElementById("drawer-overlay");
    if(megaDrawer && overlayDrawer) {
        megaDrawer.classList.add("open");
        overlayDrawer.classList.add("visible");
        document.body.style.overflow = "hidden";
        return;
    }

    // Classic Support fallback
    const overlay = document.getElementById("overlay-carrito");
    if(!overlay) {
        const isSubPage = window.location.pathname.includes('/pages/');
        const isLegal = window.location.pathname.includes('/legal/');
        let target = "pages/menu/";
        if (isLegal) target = "../../menu/";
        else if (isSubPage) target = "../menu/";
        window.location.href = target;
        return;
    }
    
    overlay.classList.add("activo");
    document.getElementById("panel-carrito").classList.add("activo");
    document.body.style.overflow = "hidden"; 
}

function cerrarCarrito() {
    // Mega Drawer Premium
    const megaDrawer = document.getElementById("mega-drawer");
    const overlayDrawer = document.getElementById("drawer-overlay");
    if(megaDrawer && overlayDrawer) {
        megaDrawer.classList.remove("open");
        overlayDrawer.classList.remove("visible");
        document.body.style.overflow = "auto";
    }

    // Classic
    const clOverlay = document.getElementById("overlay-carrito");
    if(clOverlay) clOverlay.classList.remove("activo");
    const clPanel = document.getElementById("panel-carrito");
    if(clPanel) clPanel.classList.remove("activo");
    document.body.style.overflow = ""; 
}

function selectPaymentMethod(method, element) {
    const hiddenInput = document.getElementById("metodo-pago");
    if (!hiddenInput) return;

    hiddenInput.value = method;

    // Resetear cards
    document.querySelectorAll(".payment-method-card").forEach(card => {
        card.classList.remove("active");
    });

    // Activar el seleccionado
    element.classList.add("active");

    // Mostrar/Ocultar detalles de tarjeta
    const cardForm = document.getElementById("card-details-form");
    if (cardForm) {
        cardForm.style.display = method === 'card' ? 'flex' : 'none';
    }
}

// Formateo dinámico de inputs de tarjeta
document.addEventListener('input', (e) => {
    if (e.target.id === 'card-number') {
        let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = v.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        for (let i=0, len=match.length; i<len; i+=4) {
            parts.push(match.substring(i, i+4));
        }
        if (parts.length) {
            e.target.value = parts.join(' ');
        } else {
            e.target.value = v;
        }
    }
    if (e.target.id === 'card-expiry') {
        let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length > 2) {
            e.target.value = v.substring(0, 2) + '/' + v.substring(2, 4);
        } else {
            e.target.value = v;
        }
    }
});

function enviarPedidoWP(event) {
    if (event) event.preventDefault();

    const metodoPago = document.getElementById("metodo-pago")?.value || "card";
    
    // Validaciones básicas de tarjeta (Demo)
    if (metodoPago === 'card') {
        const cn = document.getElementById("card-number");
        const ce = document.getElementById("card-expiry");
        const cv = document.getElementById("card-cvv");
        let error = false;

        [cn, ce, cv].forEach(el => el.classList.remove('error'));

        if (cn.value.replace(/\s/g, '').length < 13) { cn.classList.add('error'); error = true; }
        if (!ce.value.includes('/')) { ce.classList.add('error'); error = true; }
        if (cv.value.length < 3) { cv.classList.add('error'); error = true; }

        if (error) {
            alert("Por favor completa los datos de la tarjeta correctamente (Modo Demostración)");
            return;
        }
    }

    // Capturar datos del formulario si existen
    const nombre = document.getElementById("nombre-cliente")?.value.trim() || "";
    const direccion = document.getElementById("direccion-cliente")?.value.trim() || "";
    const nota = (document.getElementById("notas-pedido") || document.getElementById("ui-nota-pedido"))?.value.trim() || "";

    let textoPedido = RESTAURANT_CONFIG.mensajeWP || "¡Hola! Quiero hacer el siguiente pedido:\n";
    
    if (nombre) textoPedido += `\n👤 *Cliente:* ${nombre}`;
    if (direccion) textoPedido += `\n📍 *Ubicación/Mesa:* ${direccion}`;
    
    textoPedido += "\n\n------------------------\n";
    
    let totalPrecio = 0;
    for (const hash in carrito) {
        const itemObj = carrito[hash];
        const prod = obtenerProducto(itemObj.id);
        const precioUnitario = calcularPrecioItem(itemObj);
        const subtotal = precioUnitario * itemObj.cantidad;
        totalPrecio += subtotal;
        
        textoPedido += `▪ ${itemObj.cantidad}x *${prod.nombre}* - ${formatoDinero(subtotal)}\n`;
        if (itemObj.modificadores && itemObj.modificadores.length > 0) {
            itemObj.modificadores.forEach(m => {
                textoPedido += `   + ${m.nombre}\n`;
            });
        }
    }
    
    textoPedido += "------------------------\n";
    
    // Feature 09: Propina Digital
    const pctPropina = parseInt(document.getElementById("propina-seleccionada")?.value || "0");
    let montoPropina = 0;
    if (pctPropina > 0) {
        montoPropina = totalPrecio * (pctPropina / 100);
        textoPedido += `\n✨ *Propina sugerida (${pctPropina}%):* ${formatoDinero(montoPropina)}`;
    }

    const totalFinal = totalPrecio + montoPropina;
    textoPedido += `\n💰 *TOTAL FINAL:* *${formatoDinero(totalFinal)}*`;
    textoPedido += `\n💳 *Método de Pago:* ${metodoPago === 'card' ? 'Tarjeta (Demo)' : 'En Persona (Efectivo)'}\n`;
    
    if (nota !== "") textoPedido += `\n📝 *Nota:* ${nota}`;

    // branching logic based on payment method
    if (metodoPago === 'card') {
        simularPagoCard();
    } else {
        // WhatsApp Redirect
        const telefono = RESTAURANT_CONFIG.telefonoWP || "573112518913";
        const link = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(textoPedido)}`;
        window.open(link, '_blank');
    }
}

function simularPagoCard() {
    cerrarModalOrden();
    const modalStatus = document.getElementById("modal-status");
    const stepLoading = document.getElementById("status-loading");
    const stepSuccess = document.getElementById("status-success");

    if (!modalStatus) return;

    modalStatus.classList.add("activo");
    stepLoading.style.display = "flex";
    stepSuccess.style.display = "none";
    document.body.style.overflow = "hidden";

    // Simular tiempo de procesamiento (2.5s)
    setTimeout(() => {
        stepLoading.style.display = "none";
        stepSuccess.style.display = "flex";
        
        // Efecto visual extra: confeti o vibración
        if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
    }, 2500);
}

function finalizarTodo() {
    // Limpiar carrito
    carrito = {};
    actualizarUiCarrito();
    localStorage.removeItem("oldwest_cart_v2");

    // Cerrar modales
    const modalStatus = document.getElementById("modal-status");
    if (modalStatus) modalStatus.classList.remove("activo");
    document.body.style.overflow = "";

    // Opcional: Feedback visual de que se limpió
    console.log("✅ Pedido finalizado y carrito limpio.");
}

async function descargarComprobante() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const nombre = document.getElementById("nombre-cliente")?.value || "Cliente";
    const direccion = document.getElementById("direccion-cliente")?.value || "No especificada";
    const fecha = new Date().toLocaleString();
    
    // Intentar cargar el logo
    try {
        const logoUrl = "../../" + (RESTAURANT_CONFIG.logo || "img/logo.png");
        const logoImg = new Image();
        logoImg.src = logoUrl;
        
        await new Promise((resolve) => {
            logoImg.onload = resolve;
            logoImg.onerror = resolve; // Continuar aunque falle el logo
        });

        if (logoImg.complete && logoImg.naturalWidth > 0) {
            // Añadir logo (centrado, aprox 30x30)
            doc.addImage(logoImg, 'PNG', 90, 10, 30, 30);
        }
    } catch (e) {
        console.warn("No se pudo cargar el logo para el PDF", e);
    }

    // Estilo básico
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Oldwest RÚSTICA", 105, 50, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("COMPROBANTE DE PAGO ELECTRÓNICO", 105, 60, { align: "center" });
    
    doc.line(20, 65, 190, 65); // Separador
    
    // Datos Cliente
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(fecha, 50, 75);
    
    doc.setFont("helvetica", "bold");
    doc.text("Cliente:", 20, 82);
    doc.setFont("helvetica", "normal");
    doc.text(nombre, 50, 82);
    
    doc.setFont("helvetica", "bold");
    doc.text("Dirección:", 20, 89);
    doc.setFont("helvetica", "normal");
    doc.text(direccion, 50, 89);
    
    doc.setFont("helvetica", "bold");
    doc.text("Estado:", 20, 96);
    doc.setFont("helvetica", "normal");
    doc.text("PAGO COMPROBADO (TARJETA)", 50, 96);
    
    doc.line(20, 102, 190, 102);
    
    // Tabla de Productos
    doc.setFont("helvetica", "bold");
    doc.text("Producto", 20, 110);
    doc.text("Cant.", 140, 110);
    doc.text("Subtotal", 170, 110);
    doc.setFont("helvetica", "normal");
    
    let y = 118;
    let total = 0;
    
    for (const hash in carrito) {
        const item = carrito[hash];
        const prod = obtenerProducto(item.id);
        const pUnit = calcularPrecioItem(item);
        const sub = pUnit * item.cantidad;
        total += sub;
        
        doc.text(prod.nombre.substring(0, 30), 20, y);
        doc.text(item.cantidad.toString(), 145, y);
        doc.text(formatoDinero(sub), 170, y);
        y += 8;
        
        if (y > 270) { doc.addPage(); y = 20; }
    }
    
    doc.line(20, y + 2, 190, y + 2);
    y += 12;
    
    const propinaPct = parseInt(document.getElementById("propina-seleccionada")?.value || "0");
    const montoPropina = total * (propinaPct / 100);
    const totalFinal = total + montoPropina;
    
    doc.setFont("helvetica", "bold");
    doc.text("SUBTOTAL:", 130, y);
    doc.setFont("helvetica", "normal");
    doc.text(formatoDinero(total), 170, y);
    y += 8;
    
    doc.setFont("helvetica", "bold");
    doc.text(`PROPINA (${propinaPct}%):`, 130, y);
    doc.setFont("helvetica", "normal");
    doc.text(formatoDinero(montoPropina), 170, y);
    y += 8;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL FINAL:", 130, y);
    doc.text(formatoDinero(totalFinal), 170, y);
    
    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Este es un comprobante de simulación para la demostración del sistema de pagos.", 105, y, { align: "center" });
    doc.text("¡Gracias por preferir la experiencia artesanal de Oldwest!", 105, y + 5, { align: "center" });

    doc.save(`Comprobante_Oldwest_${Date.now()}.pdf`);
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

        const RESTAURANT_ID = (window.RESTAURANT_CONFIG && RESTAURANT_CONFIG.id) ? RESTAURANT_CONFIG.id : "oldwest"; 
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
    const modalContainer = document.getElementById("modal-producto");
    const modalBody = document.getElementById("modal-body");
    const tieneDescuento = prod.precioOriginal && prod.precioOriginal > prod.precio;
    
    let htmlChecks = "";
    if (prod.modificadores && prod.modificadores.length > 0) {
        htmlChecks = `<div class="modificadores-container">
            <div class="mod-grupo">
                <h4 style="color: var(--color-dorado); margin-bottom: 0.5rem;">Personaliza tu plato</h4>`;
        prod.modificadores.forEach((mod, index) => {
            htmlChecks += `
            <div class="mod-item-row" onclick="const ck = this.querySelector('input'); ck.checked = !ck.checked; ck.dispatchEvent(new Event('change'));">
                <input type="checkbox" id="mod-${index}" class="mod-checkbox-input" value="${index}" data-nombre="${mod.nombre}" data-precio="${mod.precio}" onchange="this.parentElement.classList.toggle('selected', this.checked); recalcularPrecioModal(${prod.precio}); event.stopPropagation();">
                <div class="mod-selector-circle">
                    <i class="fas fa-check"></i>
                </div>
                <div class="mod-info-premium">
                    <span class="mod-name-text">${mod.nombre}</span>
                    <span class="mod-price-tag">${mod.precio > 0 ? '+'+formatoDinero(mod.precio) : 'Gratis'}</span>
                </div>
            </div>`;
        });
        htmlChecks += `</div></div>`;
    }
    
    if(modalBody) {
        modalBody.innerHTML = `
            <div class="modal-producto-img-container">
                <img src="${imgSegura}" alt="${prod.nombre}" id="img-modal-target">
                ${tieneDescuento ? `<div class="modal-badge-descuento">OFERTA</div>` : ''}
                <button class="btn-cerrar-modal-premium" onclick="cerrarModalProducto(event)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-producto-scroll-area">
                <div class="modal-producto-body">
                    <h3 class="modal-producto-titulo">${prod.nombre}</h3>
                    <p class="modal-producto-desc">${prod.descripcion}</p>
                    ${htmlChecks}
                </div>
            </div>
            <div class="modal-producto-footer-premium">
                <div class="modal-total-section">
                    <span class="total-label">Total a pagar</span>
                    <div class="modal-price-display">
                        ${tieneDescuento ? `<span class="price-strikethrough">${formatoDinero(prod.precioOriginal)}</span>` : ''}
                        <span id="ui-modal-precio-dinamico" class="price-final">${formatoDinero(prod.precio)}</span>
                    </div>
                </div>
                <button class="btn-confirmar-pedido" id="btn-modal-add" onclick="agregarDesdeModal('${prod.id}', event)">
                    <span class="btn-text">¡Lo quiero!</span>
                    <i class="fas fa-shopping-basket"></i>
                </button>
            </div>
        `;
    }

    if(modalContainer) modalContainer.classList.add("activo");
    document.body.style.overflow = "hidden"; 
}

function recalcularPrecioModal(precioBase) {
    const checks = document.querySelectorAll('.mod-checkbox-input:checked');
    let totalCálculo = precioBase;
    checks.forEach(c => totalCálculo += parseFloat(c.dataset.precio));
    document.getElementById("ui-modal-precio-dinamico").textContent = formatoDinero(totalCálculo);
}

function agregarDesdeModal(id, event) {
    if (event) event.preventDefault();
    const checks = document.querySelectorAll('.mod-checkbox-input:checked');
    let modificadores = [];
    checks.forEach(c => {
        modificadores.push({
            nombre: c.dataset.nombre,
            precio: parseFloat(c.dataset.precio)
        });
    });
    
    // Al pasar true, nos aseguramos de que el sistema reconozca que viene del modal
    agregarAlCarrito(id, modificadores, document.getElementById("btn-modal-add"));
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

    // En el nuevo layout, el destino puede ser el botón de la navbar o el de mobile
    let btnCart = document.getElementById("open-drawer-btn");
    
    // Si estamos en mobile, el destino es el item del medio del bottom nav
    if (window.innerWidth < 1024) {
        btnCart = document.getElementById("mobile-open-drawer");
    }

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
    const modalContainer = document.getElementById("modal-producto");
    if(modalContainer) modalContainer.classList.remove("activo");

    const overlayDrawer = document.getElementById("drawer-overlay");
    if (!overlayDrawer || !overlayDrawer.classList.contains("visible")) {
        document.body.style.overflow = "";
    }
}

function abrirModalOrden() {
    const modal = document.getElementById("modal-orden");
    if(modal) {
        modal.classList.add("activo");
        document.body.style.overflow = "hidden";
    }
}

function cerrarModalOrden() {
    const modal = document.getElementById("modal-orden");
    if(modal) modal.classList.remove("activo");
    
    // Solo restaurar si no hay otros modales abiertos
    const modProducto = document.getElementById("modal-producto");
    const drawer = document.getElementById("mega-drawer");
    if ((!modProducto || !modProducto.classList.contains("activo")) && 
        (!drawer || !drawer.classList.contains("open"))) {
        document.body.style.overflow = "";
    }
}

// Add global listener to close modals
document.addEventListener("DOMContentLoaded", () => {
    const closeButtons = document.querySelectorAll('.cerrar-modal, .premium-close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mod1 = document.getElementById("modal-producto");
            const mod2 = document.getElementById("modal-orden");
            if (mod1) mod1.classList.remove("activo");
            if (mod2) mod2.classList.remove("activo");
            document.body.style.overflow = "";
        });
    });
    closeButtons.forEach(btn => {
        btn.onclick = () => {
            const modal = btn.closest('.modal');
            if(modal) modal.classList.remove('activo');
            document.body.style.overflow = "";
        };
    });
});


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

// Ensure the drawer checkout button and form are wired correctly
document.addEventListener('DOMContentLoaded', () => {
    // 1. Botón del Mega Drawer que abre el modal de datos
    const drawerBtnOrdenar = document.getElementById('drawer-btn-ordenar');
    if (drawerBtnOrdenar) {
        drawerBtnOrdenar.addEventListener('click', () => {
            if(Object.keys(carrito).length > 0){
                cerrarCarrito();
                abrirModalOrden();
            } else {
                alert("Agrega algunos productos deliciosos al carrito primero.");
            }
        });
    }

    // 2. Manejo del envío del formulario final
    const formPedido = document.getElementById('form-pedido');
    if (formPedido) {
        formPedido.addEventListener('submit', enviarPedidoWP);
    }
});
// Feature 09: Helper Propina
function seleccionarPropina(valor, btn) {
    const hiddenInput = document.getElementById("propina-seleccionada");
    if (!hiddenInput) return;

    hiddenInput.value = valor;

    // Resetear chips (Soporta ambos estilos)
    document.querySelectorAll(".propina-chip, .propina-premium-chip").forEach(chip => {
        chip.classList.remove("activa");
    });

    // Activar el seleccionado
    btn.classList.add("activa");
}

// Feature 17: Especial del Día
function renderizarEspecialDia() {
    const contenedor = document.getElementById("ui-especial-dia-container");
    if (!contenedor) return;

    // Lógica por día de la semana (0=Dom, 1=Lun...)
    const dia = new Date().getDay();
    const especiales = [
        401, // Domingo: Picada Wild West
        201, // Lunes: Tomahawk Angus Beef
        101, // Martes: Smash Burger
        102, // Miércoles: Dallas Burger
        301, // Jueves: Texas Chicken
        302, // Viernes: Grilled Chicken
        202  // Sábado: New York Steak Beef
    ];

    // Intentamos buscar un producto que tenga "Especial" en la categoría o usar el mapa
    const idBuscado = especiales[dia];
    const prod = obtenerProducto(idBuscado);
    
    if (!prod || prod.nombre === "No encontrado") {
        // Fallback si los IDs no coinciden: buscar la primera hamburguesa
        const fallback = RESTAURANT_CONFIG.productos.find(p => p.categoria.includes("Hamburguesas"));
        if (!fallback) return;
        mostrarEspecialHtml(fallback, contenedor);
    } else {
        mostrarEspecialHtml(prod, contenedor);
    }
}

function mostrarEspecialHtml(prod, contenedor) {
    contenedor.innerHTML = `
        <div class="chef-special-card ultra-reveal" 
             style="cursor: pointer;"
             onclick="const p = obtenerProducto('${prod.id}'); if(window.openProductSheet) { window.openProductSheet(p); } else { abrirModalProducto('${prod.id}'); }">
            <div class="special-badge">CREACIÓN DEL DÍA</div>
            <div class="special-content-split">
                <div class="special-img-side">
                    <img src="${transformarLinkImagen(prod.imagen)}" alt="${prod.nombre}">
                </div>
                <div class="special-text-side">
                    <p class="special-overline">Recomendación del Chef</p>
                    <h2 class="special-title">${prod.nombre}</h2>
                    <p class="special-desc">${prod.descripcion}</p>
                    <div class="special-price-row">
                        <span class="special-price">${formatoDinero(prod.precio)}</span>
                        <button class="btn-special-add">
                            ¡Lo quiero! <i class="fas fa-magic"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos inyectados para el especial (Premium Editorial)
    if (!document.getElementById('special-styles')) {
        const style = document.createElement('style');
        style.id = 'special-styles';
        style.textContent = `
            .chef-special-card {
                background: #131110;
                border: 1px solid rgba(255,255,255,0.06);
                border-radius: 16px;
                margin-bottom: 1.5rem; 
                width: 100%;
                overflow: hidden;
                position: relative;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                transition: all 0.4s ease;
            }
            .chef-special-card:hover {
                border-color: var(--c-brand);
                transform: translateY(-3px);
            }
            .special-badge {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--c-brand);
                color: white;
                padding: 3px 10px;
                font-family: 'Outfit', sans-serif;
                font-size: 0.55rem;
                font-weight: 800;
                letter-spacing: 1.5px;
                border-radius: 4px;
                z-index: 5;
            }
            .special-content-split {
                display: flex;
                flex-direction: column;
                width: 100%;
            }
            .special-img-side {
                width: 100%; 
                height: 120px; /* Altura muy reducida */
                overflow: hidden;
            }
            .special-img-side img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s ease;
            }
            .chef-special-card:hover .special-img-side img {
                transform: scale(1.1);
            }
            .special-text-side {
                width: 100%;
                padding: 1rem; /* Padding más ajustado */
            }
            .special-overline {
                color: var(--c-brand);
                font-family: 'Outfit', sans-serif;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-size: 0.6rem;
                margin-bottom: 0.4rem;
                font-weight: 700;
            }
            .special-title {
                font-family: var(--f-title);
                font-size: 1.1rem; /* Tamaño más compacto */
                margin-bottom: 0.4rem;
                line-height: 1.2;
                color: white;
            }
            .special-desc {
                color: rgba(255,255,255,0.4);
                font-family: var(--f-italic);
                font-style: italic;
                font-size: 0.8rem;
                margin-bottom: 1rem;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* Limitar a 2 líneas para ahorrar espacio Y */
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .special-price-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .special-price {
                font-family: var(--f-body);
                font-size: 1.1rem;
                font-weight: 700;
                color: white;
            }
            .btn-special-add {
                background: var(--c-brand);
                color: white;
                border: none;
                padding: 0.6rem 1rem;
                border-radius: 8px;
                font-family: 'Outfit', sans-serif;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.75rem;
            }
            .btn-special-add:hover {
                background: #e61929;
                transform: scale(1.05);
            }

            @media (max-width: 768px) {
                .special-img-side { height: 160px; }
                .special-price-row { flex-direction: row; }
                .btn-special-add { width: auto; }
            }
        `;
        document.head.appendChild(style);
    }
}
