/**
 * MENU ULTRA V3 — Mobile-First Logic
 * Oldwest Rústica — Digital Menu Interface
 */
(function () {
    'use strict';

    /* ==================== 1. DATA & STATE ==================== */
    let cartTotal = 0;
    let cartCount = 0;
    let lastScrollPos = 0; // Memoria del scroll exacto
    let categoryBeforeSearch = 0; // Memoria para restaurar después de buscar

    /* ==================== 2. INITIALIZATION ==================== */
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof RESTAURANT_CONFIG !== 'undefined') {
            renderPillNav();
            renderPromoSlider();
            renderAllSections();
            
            // Feature 17: Especial del Día
            if (typeof renderizarEspecialDia === 'function') {
                renderizarEspecialDia();
            }
        }
        setupCartFeedback();
        setupSearch();
        renderMiniMenuCats();
        setupBottomSheet();
    });

    /* ==================== 2.5 CINEMA PROMO HERO ==================== */
    function renderPromoSlider() {
        const container = document.getElementById('mn-promo-container');
        if (!container || !RESTAURANT_CONFIG.promociones) return;

        const promos = RESTAURANT_CONFIG.promociones;
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const todayName = days[new Date().getDay()];

        container.innerHTML = `
            <div class="mn-promo-slider">
                ${promos.map((promo, idx) => {
                    let finalTitle = promo.titulo;
                    if (promo.titulo.includes("Hoy")) {
                        finalTitle = `¡Especial de ${todayName}!`;
                    }
                    
                    return `
                    <div class="mn-promo-card ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                        <div class="mn-promo-overlay"></div>
                        <img src="${promo.fondo}" alt="${finalTitle}">
                        <div class="mn-promo-info">
                            <div class="mn-promo-badge">Oferta Limitada</div>
                            <h3 class="mn-promo-title">${finalTitle}</h3>
                            <p class="mn-promo-desc">${promo.descripcion}</p>
                            
                            <div class="mn-promo-timer">
                                <div class="mn-timer-item"><span class="mn-timer-val" id="t-hours-${idx}">00</span><span class="mn-timer-lab">Horas</span></div>
                                <div class="mn-timer-item"><span class="mn-timer-val" id="t-min-${idx}">00</span><span class="mn-timer-lab">Min</span></div>
                                <div class="mn-timer-item"><span class="mn-timer-val" id="t-sec-${idx}">00</span><span class="mn-timer-lab">Seg</span></div>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
                
                <div class="mn-promo-nav">
                    ${promos.map((_, idx) => `
                        <div class="mn-nav-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
                    `).join('')}
                </div>
            </div>
        `;

        initCinemaSlider();
        startGlobalTimer();
    }

    function startGlobalTimer() {
        const hCierre = RESTAURANT_CONFIG.horarios.cierre.split(':');
        const numPromos = RESTAURANT_CONFIG.promociones.length;
        
        setInterval(() => {
            const now = new Date();
            const end = new Date();
            end.setHours(hCierre[0], hCierre[1], 0);

            let diff = end - now;
            if (diff < 0) diff = 0; 

            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

            for (let i = 0; i < numPromos; i++) {
                const elH = document.getElementById(`t-hours-${i}`);
                const elM = document.getElementById(`t-min-${i}`);
                const elS = document.getElementById(`t-sec-${i}`);

                if (elH) elH.textContent = h;
                if (elM) elM.textContent = m;
                if (elS) elS.textContent = s;
            }
        }, 1000);
    }

    function initCinemaSlider() {
        let current = 0;
        const cards = document.querySelectorAll('.mn-promo-card');
        const dots = document.querySelectorAll('.mn-nav-dot');
        if (cards.length <= 1) return;

        function showPromo(index) {
            cards.forEach(c => c.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            cards[index].classList.add('active');
            dots[index].classList.add('active');
            current = index;
        }

        // Auto-rotation
        let interval = setInterval(() => {
            let next = (current + 1) % cards.length;
            showPromo(next);
        }, 5000);

        // Click on dots
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                clearInterval(interval);
                showPromo(idx);
            });
        });
    }

    /* ==================== 3. CATEGORY PILLS ==================== */
    function renderPillNav() {
        const nav = document.getElementById('mn-nav-scroll');
        if (!nav) return;

        nav.innerHTML = '';
        
        // Add "Todos" at the beginning
        const categories = ["Todos", ...RESTAURANT_CONFIG.categorias];

        categories.forEach((cat, idx) => {
            const pill = document.createElement('div');
            pill.className = `mn-cat-pill ${idx === 0 ? 'active' : ''}`;
            pill.textContent = cat;
            pill.dataset.target = `sec-${idx}`;
            
            pill.addEventListener('click', () => {
                showCategory(idx);
            });
            nav.appendChild(pill);
        });

        // Initialize first category (Todos) sin scroll automático al cargar
        setTimeout(() => showCategory(0, false), 100);
        initScrollObserver(); // Iniciar observer después de renderizar
    }

    function createProductCard(p, pIdx = 0, catIdx = 0) {
        const card = document.createElement('div');
        card.className = `mn-card mn-reveal`;
        
        if (pIdx === 0 && catIdx % 2 === 0) card.classList.add('featured');
        
        // Badge de descuento si existe
        const hasDiscount = p.precioOriginal && p.precioOriginal > p.precio;
        
        card.innerHTML = `
            <div class="mn-card-img-box">
                <img src="${p.imagen}" alt="${p.nombre}" class="mn-card-img" loading="lazy">
            </div>
            <div class="mn-card-content">
                <div class="mn-card-top" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem; width:100%;">
                        <h3 class="mn-card-title">${p.nombre}</h3>
                        ${hasDiscount ? `<span class="mn-card-badge-promo" style="position:relative; inset:auto; border-radius:4px; padding:0.2rem 0.4rem; font-size:0.55rem; animation:none;">-${Math.round((1 - p.precio/p.precioOriginal)*100)}% OFF</span>` : ''}
                    </div>
                    <div class="mn-card-price-box">
                        ${hasDiscount ? `
                            <span class="mn-card-price-old">$${(p.precioOriginal/1000).toFixed(0)}k</span>
                            <span class="mn-card-price">$${(p.precio/1000).toFixed(0)}k</span>
                        ` : `
                            <span class="mn-card-price">$${(p.precio/1000).toFixed(0)}k</span>
                        `}
                    </div>
                </div>
                
                <div class="mn-card-pop" style="position:relative; margin: 0.5rem 0; inset:auto; width:fit-content;">
                    ${p.popularidad || Math.floor(Math.random()*20 + 10)} pidiendo
                </div>

                <p class="mn-card-desc">${p.descripcion}</p>
                
                <div class="mn-item-tags">
                    ${p.prepTime ? `<span class="mn-tag">⏱ ${p.prepTime}</span>` : ''}
                    ${p.porciones ? `<span class="mn-tag">👥 ${p.porciones}</span>` : ''}
                    ${(p.etiquetas || []).map(t => {
                        let tagText = t;
                        if (tagText.toLowerCase().includes("2x1")) {
                            const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                            const today = days[new Date().getDay()];
                            tagText = tagText.replace(/Martes|Miércoles|Lunes|Jueves|Viernes|Sábado|Domingo/gi, today);
                        }
                        return `<span class="mn-tag">${tagText}</span>`;
                    }).join('')}
                </div>
            </div>
        `;

        card.addEventListener('click', () => openProductSheet(p));
        return card;
    }

    function showCategory(idx, shouldScroll = true) {
        const categories = ["Todos", ...RESTAURANT_CONFIG.categorias];
        
        // Update Pills
        document.querySelectorAll('.mn-cat-pill').forEach((p, i) => {
            p.classList.toggle('active', i === idx);
        });

        // Lógica de "Todos" vs Categoría única
        const sections = document.querySelectorAll('.mn-section');
        
        if (idx === 0) {
            // MOSTRAR TODOS: Todas las secciones visibles
            sections.forEach(sec => {
                sec.style.display = 'block';
                const reveals = sec.querySelectorAll('.mn-reveal');
                reveals.forEach(el => el.classList.add('visible'));
            });
        } else {
            // MOSTRAR SOLO UNA: Ocultar el resto
            sections.forEach((sec, i) => {
                if (i === (idx - 1)) { // idx - 1 porque "Todos" es 0
                    sec.style.display = 'block';
                    const reveals = sec.querySelectorAll('.mn-reveal');
                    reveals.forEach(el => el.classList.add('visible'));
                } else {
                    sec.style.display = 'none';
                }
            });
        }

        // Scroll to top of menu or section
        const main = document.getElementById('mn-main');
        if (main && shouldScroll) {
            const offset = 130;
            let targetScroll;
            
            if (idx === 0) {
                targetScroll = main.offsetTop - offset;
            } else {
                const targetSec = document.getElementById(`sec-${idx-1}`);
                targetScroll = targetSec ? targetSec.offsetTop - offset : main.offsetTop - offset;
            }

            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        }
    }

    /* ==================== 4. RENDERING SECTIONS ==================== */
    function renderAllSections() {
        const main = document.getElementById('mn-main');
        if (!main) return;

        main.innerHTML = '';

        // Solo iteramos sobre las categorías reales (saltamos "Todos")
        const categories = RESTAURANT_CONFIG.categorias;

        categories.forEach((catName, catIdx) => {
            const section = document.createElement('section');
            section.className = 'mn-section';
            section.id = `sec-${catIdx}`;
            
            section.innerHTML = `
                <h2 class="mn-section-title mn-reveal">${catName}</h2>
                <div class="mn-grid" id="grid-${catIdx}"></div>
            `;
            main.appendChild(section);

            const grid = document.getElementById(`grid-${catIdx}`);
            
            // Filtrar productos por esta categoría
            const products = RESTAURANT_CONFIG.productos.filter(p => p.categoria === catName);

            products.forEach((p, pIdx) => {
                const card = createProductCard(p, pIdx, catIdx);
                grid.appendChild(card);
            });
        });

        // Trigger animations
        setTimeout(triggerReveals, 100);
    }

    /* ==================== 5. MODAL BOTTOM SHEET ==================== */
    function openProductSheet(p) {
        const modal = document.getElementById('mn-modal');
        const sheet = document.getElementById('mn-modal-sheet');
        if (!modal || !sheet) return;

        let total = p.precio;
        let selectedMods = [];

        // Lógica de Pantalla Completa para 2+ grupos de adiciones
        const modGroups = p.modificadores || [];
        const isGrouped = modGroups.length > 0 && modGroups[0].grupo;
        const numGroups = isGrouped ? modGroups.length : (modGroups.length > 0 ? 1 : 0);

        if (numGroups >= 2) {
            sheet.classList.add('full-screen');
        } else {
            sheet.classList.remove('full-screen');
        }

        sheet.innerHTML = `
            ${numGroups >= 2 ? `<button class="mn-modal-close-btn" onclick="closeSheet()">×</button>` : `<div class="mn-modal-grabber"></div>`}
            <img src="${p.imagen}" alt="${p.nombre}" class="mn-modal-img">
            <div class="mn-modal-body">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h2 class="mn-modal-title" style="margin:0">${p.nombre}</h2>
                    <div class="mn-item-tags">
                        ${p.prepTime ? `<span class="mn-tag" style="background:rgba(255,255,255,0.1)">⏱ ${p.prepTime}</span>` : ''}
                    </div>
                </div>
                
                <p class="mn-modal-desc">${p.descripcion}</p>
                
                <div class="mn-item-tags" style="margin-bottom:2rem">
                    ${(p.etiquetas || []).map(t => `<span class="mn-tag" style="font-size:0.7rem; border:1px solid rgba(255,255,255,0.1)">${t}</span>`).join('')}
                    ${p.porciones ? `<span class="mn-tag" style="font-size:0.7rem; border:1px solid rgba(255,255,255,0.1)">👥 ${p.porciones}</span>` : ''}
                </div>
                
                ${p.modificadores && p.modificadores.length > 0 ? renderAccordionModifiers(p.modificadores) : ''}
            </div>
            <div class="mn-modal-footer">
                <div style="flex:1">
                    <p style="margin:0; font-size:0.7rem; text-transform:uppercase; opacity:0.5; font-weight:700;">Total aproximado</p>
                    <p style="margin:0; font-family:var(--f-title); font-size:1.6rem; font-weight:800;" id="sheet-total">$${total.toLocaleString()}</p>
                </div>
                <button class="mn-modal-btn" id="sheet-add-btn">Añadir</button>
            </div>
        `;

        // Interaction for Accordion and Items
        setupAccordionLogic(sheet, p, (newTotal, newMods) => {
            total = newTotal;
            selectedMods = newMods;
            document.getElementById('sheet-total').textContent = `$${total.toLocaleString()}`;
        });

        document.getElementById('sheet-add-btn').addEventListener('click', () => {
            if (window.agregarAlCarrito) window.agregarAlCarrito(p.id, selectedMods);
            closeSheet();
            if (window.actualizarUiCarrito) window.actualizarUiCarrito();
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Ocultamos WhatsApp y Carrito flotante para no estorbar en el modal completo
        toggleFloatingUI(false);
    }

    function closeSheet() {
        const modal = document.getElementById('mn-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Volvemos a mostrar los botones flotantes
        toggleFloatingUI(true);
    }

    /* ==================== 5.5 ACCORDION HELPERS ==================== */
    function renderAccordionModifiers(mods) {
        // Detect if mods are grouped or flat
        const isGrouped = mods[0] && mods[0].grupo;
        
        if (!isGrouped) {
            // Fallback for flat list (backward compatibility)
            return `
                <div class="mn-accordion open">
                    <div class="mn-acc-header">
                        <span class="mn-acc-title">Personaliza tu plato</span>
                        <span class="mn-acc-icon">▼</span>
                    </div>
                    <div class="mn-acc-body">
                        ${mods.map((mod, idx) => renderModItem(mod, idx, 0)).join('')}
                    </div>
                </div>
            `;
        }

        return mods.map((group, groupIdx) => `
            <div class="mn-accordion ${groupIdx === 0 ? 'open' : ''}">
                <div class="mn-acc-header">
                    <span class="mn-acc-title">${group.grupo}</span>
                    <span class="mn-acc-icon">▼</span>
                </div>
                <div class="mn-acc-body">
                    ${group.opciones.map((mod, modIdx) => renderModItem(mod, modIdx, groupIdx, group.seleccion === 'unica')).join('')}
                </div>
            </div>
        `).join('');
    }

    function renderModItem(mod, modIdx, groupIdx, isUnique = false) {
        return `
            <div class="mn-mod-item ${isUnique ? 'mod-unique' : ''}" data-group="${groupIdx}" data-mod="${modIdx}">
                <div class="mn-mod-check" style="${isUnique ? 'border-radius: 50%;' : ''}"></div>
                <div style="flex:1">
                    <p style="margin:0; font-weight:600; font-size:0.9rem;">${mod.nombre}</p>
                </div>
                ${mod.precio > 0 ? `<span style="font-weight:700; color:var(--c-brand)">+ $${mod.precio.toLocaleString()}</span>` : ''}
            </div>
        `;
    }

    function setupAccordionLogic(sheet, p, onUpdate) {
        let total = p.precio;
        let selectedMods = [];

        // Toggle Accordions
        sheet.querySelectorAll('.mn-acc-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('open');
            });
        });

        // Toggle Modifiers
        sheet.querySelectorAll('.mn-mod-item').forEach(item => {
            item.addEventListener('click', () => {
                const groupIdx = item.dataset.group;
                const modIdx = item.dataset.mod;
                const isGrouped = p.modificadores[0] && p.modificadores[0].grupo;
                const group = isGrouped ? p.modificadores[groupIdx] : null;
                const isUnique = group && group.seleccion === 'unica';
                
                let mod = isGrouped ? group.opciones[modIdx] : p.modificadores[modIdx];

                if (item.classList.contains('active')) {
                    // Solo permitir desmarcar si NO es selección única (o permitir desmarcar si ya está activo)
                    item.classList.remove('active');
                    total -= mod.precio;
                    selectedMods = selectedMods.filter(m => m.nombre !== mod.nombre);
                } else {
                    // Si es selección única, quitar otros activos del mismo grupo
                    if (isUnique) {
                        const others = sheet.querySelectorAll(`.mn-mod-item[data-group="${groupIdx}"].active`);
                        others.forEach(other => {
                            const otherModIdx = other.dataset.mod;
                            const otherMod = group.opciones[otherModIdx];
                            other.classList.remove('active');
                            total -= otherMod.precio;
                            selectedMods = selectedMods.filter(m => m.nombre !== otherMod.nombre);
                        });
                    }

                    item.classList.add('active');
                    total += mod.precio;
                    selectedMods.push(mod);
                }
                onUpdate(total, selectedMods);
            });
        });
    }

    /* ==================== 6. SCROLL OBSERVER ==================== */
    function initScrollObserver() {
        const sections = document.querySelectorAll('.mn-section');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            // Solo activamos el scroll spy si estamos en modo "Todos"
            const activePill = document.querySelector('.mn-cat-pill.active');
            if (activePill && activePill.textContent !== "Todos") return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const catIdx = parseInt(id.split('-')[1]) + 1; // +1 por el "Todos" inicial
                    
                    document.querySelectorAll('.mn-cat-pill').forEach((pill, i) => {
                        pill.classList.toggle('active', i === catIdx);
                    });
                    
                    const newActivePill = document.querySelectorAll('.mn-cat-pill')[catIdx];
                    if (newActivePill) {
                        newActivePill.parentElement.scrollTo({
                            left: newActivePill.offsetLeft - 50,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        sections.forEach(sec => observer.observe(sec));
    }

    function triggerReveals() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.mn-reveal').forEach(el => observer.observe(el));
    }

    /* ==================== 7. CART UI ==================== */

    function setupCartFeedback() {
        const float = document.getElementById('mn-floating-cart');
        if (float) {
            float.addEventListener('click', (e) => {
                if (window.openDrawer) window.openDrawer(e);
            });
        }
    }

    /* ==================== 8. SMART SEARCH LOGIC ==================== */
    function setupSearch() {
        const searchInput = document.getElementById('mn-smart-search');
        const clearBtn = document.getElementById('mn-search-clear');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (clearBtn) clearBtn.style.display = query ? 'flex' : 'none';

            if (query.length > 0) {
                // Guardamos el scroll exacto antes de que la página cambie por la búsqueda
                if (!document.body.classList.contains('is-searching')) {
                    lastScrollPos = window.scrollY;
                    
                    // Desplazamos al inicio del menú para ver los resultados "en la cara"
                    const main = document.getElementById('mn-main');
                    if (main) {
                        const offset = 160; // Compensar header y buscador
                        window.scrollTo({
                            top: main.offsetTop - offset,
                            behavior: 'smooth'
                        });
                    }
                }

                // Modo búsqueda
                document.body.classList.add('is-searching');
                filterProducts(query);
            } else {
                // MODO RESTAURACIÓN TOTAL:
                // 1. Quitamos modo búsqueda
                document.body.classList.remove('is-searching');
                
                // 2. Volvemos a mostrar "TODOS" (vista completa) sin animaciones de scroll
                showCategory(0, false);
                
                // 3. Restauramos la posición exacta del scroll donde estaba el usuario
                window.scrollTo({
                    top: lastScrollPos,
                    behavior: 'instant'
                });
            }
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
            });
        }
    }

    function filterProducts(query) {
        const promoContainer = document.getElementById('mn-promo-container');
        const specialContainer = document.getElementById('ui-especial-dia-container');
        const sections = document.querySelectorAll('.mn-section');
        const searchInput = document.getElementById('mn-smart-search');
        
        // Ocultar elementos decorativos durante la búsqueda
        if (promoContainer) promoContainer.style.display = 'none';
        if (specialContainer) specialContainer.style.display = 'none';
        document.body.classList.add('is-searching');

        sections.forEach((section, catIdx) => {
            const catName = RESTAURANT_CONFIG.categorias[catIdx];
            const grid = section.querySelector('.mn-grid');
            if (!grid) return;

            // Calcular scores de relevancia para esta categoría
            const products = RESTAURANT_CONFIG.productos.filter(p => p.categoria === catName);
            let matches = [];
            let maxScore = 0;

            products.forEach(p => {
                const nombreLimpio = p.nombre.toLowerCase();
                const idx = nombreLimpio.indexOf(query);
                if (idx !== -1) {
                    const score = 100 - idx; // Mayor score si empieza por la letra
                    matches.push({ product: p, score });
                    if (score > maxScore) maxScore = score;
                }
            });

            if (matches.length > 0) {
                // Hay coincidencias: Mostrar y Re-organizar
                section.style.display = 'block';
                section.style.order = -maxScore; // Re-organizar secciones (las de más relevancia arriba)
                
                // Ordenar productos por relevancia interna
                matches.sort((a, b) => b.score - a.score);

                // Re-renderizar el grid interno con los resultados filtrados
                grid.innerHTML = '';
                matches.forEach((m, mIdx) => {
                    const card = createProductCard(m.product, mIdx, catIdx);
                    grid.appendChild(card);
                    // Forzar visibilidad
                    setTimeout(() => card.classList.add('visible'), 10);
                });
            } else {
                // No hay coincidencias en esta categoría
                section.style.display = 'none';
                section.style.order = 0;
            }
        });

        // Feedback si no hay absolutamente nada
        const anyVisible = Array.from(sections).some(s => s.style.display === 'block');
        renderNoResults(query, anyVisible);
    }

    function renderNoResults(query, anyVisible) {
        const main = document.getElementById('mn-main');
        let noRes = document.getElementById('search-no-results');
        
        if (!anyVisible) {
            if (!noRes) {
                noRes = document.createElement('div');
                noRes.id = 'search-no-results';
                noRes.style.cssText = 'text-align:center; padding: 4rem 2rem; color: white; font-family: var(--f-title); order: 1000;';
                main.appendChild(noRes);
            }
            noRes.style.display = 'block';
            noRes.innerHTML = `
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No encontramos nada para "${query}"</p>
                <p style="font-size: 0.8rem; opacity: 0.6;">Intenta con el nombre exacto de tu plato favorito</p>
            `;
        } else if (noRes) {
            noRes.style.display = 'none';
        }
    }

    // Extender showCategory para restaurar el menú original
    const originalShowCategory = showCategory;
    showCategory = function(idx, shouldScroll = true) {
        const promoContainer = document.getElementById('mn-promo-container');
        const specialContainer = document.getElementById('ui-especial-dia-container');
        const searchInput = document.getElementById('mn-smart-search');
        const sections = document.querySelectorAll('.mn-section');

        // Restaurar visibilidad de promos
        if (promoContainer) promoContainer.style.display = 'block';
        if (specialContainer) specialContainer.style.display = 'block';
        document.body.classList.remove('is-searching');

        if (searchInput && searchInput.value) {
            searchInput.value = '';
            if (document.getElementById('mn-search-clear')) document.getElementById('mn-search-clear').style.display = 'none';
        }

        // Restaurar orden y contenido original de secciones
        sections.forEach((section, catIdx) => {
            section.style.order = 0;
            const grid = section.querySelector('.mn-grid');
            if (grid) {
                grid.innerHTML = '';
                const catName = RESTAURANT_CONFIG.categorias[catIdx];
                const products = RESTAURANT_CONFIG.productos.filter(p => p.categoria === catName);
                products.forEach((p, pIdx) => {
                    const card = createProductCard(p, pIdx, catIdx);
                    grid.appendChild(card);
                });
            }
        });

        originalShowCategory(idx, shouldScroll);
    };

    /* ==================== 9. BOTTOM SHEET & MINI MENU ==================== */
    function setupBottomSheet() {
        const btn = document.getElementById('cat-filter-btn');
        const sheet = document.getElementById('categories-sheet');
        const overlay = document.getElementById('sheet-overlay');

        if (!btn || !sheet) return;

        btn.addEventListener('click', () => {
            sheet.classList.add('active');
            document.body.style.overflow = 'hidden';
            toggleFloatingUI(false);
        });

        overlay.addEventListener('click', () => {
            sheet.classList.remove('active');
            document.body.style.overflow = '';
            toggleFloatingUI(true);
        });
    }

    function toggleFloatingUI(show) {
        const wa = document.getElementById('wa-chat-widget');
        const cart = document.getElementById('mn-floating-cart');
        
        if (show) {
            if (wa) wa.classList.remove('mn-floating-hidden');
            if (cart) cart.classList.remove('mn-floating-hidden');
        } else {
            if (wa) wa.classList.add('mn-floating-hidden');
            if (cart) cart.classList.add('mn-floating-hidden');
        }
    }

    function renderMiniMenuCats() {
        const container = document.getElementById('mini-menu-cats');
        if (!container) return;

        const categories = ["Todos", ...RESTAURANT_CONFIG.categorias];
        const usedImages = new Set();
        
        const catDescriptions = {
            "Todos": "Explora la experiencia completa de nuestra cocina tradicional.",
            "Entradas": "Pequeños bocados llenos de sabor rústico.",
            "Pizzas Tradicionales": "Los clásicos que nunca pasan de moda.",
            "Pizzas Especiales": "Recetas únicas con el sello de Oldwest.",
            "Pizzas Premium": "Ingredientes selectos para paladares exigentes.",
            "Pastas & Lasagnas": "El alma de Italia en cada bocado artesanal.",
            "Postres": "Dulcemente inolvidables.",
            "Bebidas": "Refrescantes jugos naturales y selección premium.",
            "Vinos & Sangrías": "El maridaje perfecto para tu velada."
        };

        categories.forEach((cat, idx) => {
            let catImg = "";
            
            if (cat === "Todos") {
                // Para "Todos" buscamos un plato insignia que no sea necesariamente el primero de una categoría
                const bestSellers = RESTAURANT_CONFIG.productos.filter(p => p.popularidad > 15);
                const insignia = bestSellers.length > 0 ? bestSellers[0] : RESTAURANT_CONFIG.productos[0];
                catImg = insignia.imagen;
                usedImages.add(catImg);
            } else {
                // Buscar un producto de la categoría cuya imagen no haya sido usada
                const catProducts = RESTAURANT_CONFIG.productos.filter(p => p.categoria === cat);
                const uniqueProduct = catProducts.find(p => !usedImages.has(p.imagen)) || catProducts[0];
                
                if (uniqueProduct) {
                    catImg = uniqueProduct.imagen;
                    usedImages.add(catImg);
                } else {
                    catImg = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=200&auto=format&fit=crop";
                }
            }

            const item = document.createElement('div');
            item.className = 'mn-sheet-cat-item';
            item.innerHTML = `
                <div class="mn-sheet-cat-img-box">
                    <img src="${catImg}" class="mn-sheet-cat-img" alt="${cat}" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=200&auto=format&fit=crop'">
                </div>
                <div class="mn-sheet-cat-info">
                    <span class="mn-sheet-cat-name">${cat === "Todos" ? "Todo el Menú" : cat}</span>
                    <span class="mn-sheet-cat-desc">${catDescriptions[cat] || "Delicias del chef seleccionadas para ti."}</span>
                </div>
            `;
            
            item.addEventListener('click', () => {
                showCategory(idx);
                document.getElementById('categories-sheet').classList.remove('active');
                document.body.style.overflow = '';
                toggleFloatingUI(true);
            });
            
            container.appendChild(item);
        });
    }

    /* ==================== 10. SMART NOTIFICATIONS (ULTRA-PREMIUM) ==================== */
    function initSmartNotifications() {
        // Para pruebas permitimos que se inicie, el CSS controla la visibilidad en PC
        const suggestions = [
            { 
                img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop', 
                label: "Mesa del Chef",
                text: "Nuestra masa reposa por 48 horas bajo temperatura controlada, logrando una ligereza que desafía los sentidos." 
            },
            { 
                img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop', 
                label: "Cava Privada",
                text: "La selección de nuestra cava ha sido curada para elevar cada nota de sabor en nuestras pastas artesanales." 
            },
            { 
                img: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=400&auto=format&fit=crop', 
                label: "Experiencia Dolce",
                text: "El final perfecto no es una opción, es una experiencia. Descubre nuestra Panna Cotta con vainilla de Madagascar." 
            },
            { 
                img: 'https://images.unsplash.com/photo-1474606405306-9e44a83b8ffa?q=80&w=400&auto=format&fit=crop', 
                label: "Filosofía Rústica",
                text: "Cada ingrediente en nuestra cocina rústica proviene de agricultores locales comprometidos con la excelencia." 
            }
        ];

        // Crear contenedor
        const container = document.createElement('div');
        container.className = 'mn-notif-container';
        document.body.appendChild(container);

        let currentIdx = 0;

        function showNotification() {
            const item = suggestions[currentIdx];
            container.innerHTML = `
                <div class="mn-notif-card" id="notif-card">
                    <button class="mn-notif-close" onclick="this.parentElement.classList.remove('visible')">×</button>
                    <div class="mn-notif-img-box">
                        <img src="${item.img}" class="mn-notif-img" alt="${item.label}">
                    </div>
                    <div class="mn-notif-body">
                        <div class="mn-notif-label">${item.label}</div>
                        <p class="mn-notif-text">${item.text}</p>
                    </div>
                    <div class="mn-notif-progress">
                        <div class="mn-notif-progress-bar" id="notif-progress"></div>
                    </div>
                </div>
            `;

            setTimeout(() => {
                const card = document.getElementById('notif-card');
                const progress = document.getElementById('notif-progress');
                if (card) card.classList.add('visible');
                if (progress) progress.style.animation = 'notif-timer 6s linear forwards';
            }, 100);

            // Auto-hide after 6s (Editorial timing)
            setTimeout(() => {
                const card = document.getElementById('notif-card');
                if (card) card.classList.remove('visible');
            }, 6000);

            currentIdx = (currentIdx + 1) % suggestions.length;
        }

        // Primera notificación después de 20 segundos (Producción)
        setTimeout(showNotification, 20000);

        // Notificaciones cada 4 minutos (240,000 ms)
        setInterval(showNotification, 240000);
    }

    // Iniciar notificaciones
    initSmartNotifications();

    // Global Exposure
    window.closeSheet = closeSheet;
    window.openProductSheet = openProductSheet;

})();
