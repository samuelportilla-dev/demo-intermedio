/**
 * FX TRANSITIONS — Cinematic Page Transitions
<<<<<<< HEAD:js/fx-transitions.js
 * Oldwest — Fase 1 Premium
=======
 * La Nonna Rústica — Fase 1 Premium
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-transitions.js
 */
(function () {
    'use strict';

<<<<<<< HEAD:js/fx-transitions.js
    let initialized = false;

    function getOverlay() {
        return document.getElementById('pt-overlay');
    }

    function bindLinks() {
        document.querySelectorAll('a[href]:not(.pt-bound)').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('tel:') ||
                href.startsWith('mailto:') || href.startsWith('http') ||
                link.target === '_blank') return;
            
            link.classList.add('pt-bound');
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.FxTransitions.pageOut(href);
=======
    // --- Build overlay DOM ---
    const overlay = document.createElement('div');
    overlay.id = 'pt-overlay';
    overlay.innerHTML = `
        <div class="pt-curtain-top"></div>
        <div class="pt-curtain-bottom"></div>
        <div class="pt-logo-wrap">
            <img src="img/logo.png" alt="La Nonna">
            <span>LA NONNA RÚSTICA</span>
        </div>
    `;
    document.body.appendChild(overlay);

    /* ---- PAGE IN (current page reveals) ---- */
    function pageIn() {
        overlay.classList.add('pt-leaving');
        setTimeout(() => {
            overlay.classList.remove('pt-leaving');
        }, 900);
    }

    /* ---- PAGE OUT (navigate away) ---- */
    function pageOut(href) {
        overlay.classList.add('pt-entering');
        overlay.style.pointerEvents = 'all';
        setTimeout(() => {
            window.location.href = href;
        }, 680);
    }

    /* ---- Intercept internal links ---- */
    function bindLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');

            // Skip: external, anchor-only, tel, mailto, blank
            if (!href || href.startsWith('#') || href.startsWith('tel:') ||
                href.startsWith('mailto:') || href.startsWith('http') ||
                href.startsWith('wa.me') || link.target === '_blank') return;

            link.addEventListener('click', function (e) {
                e.preventDefault();
                pageOut(href);
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-transitions.js
            });
        });
    }

<<<<<<< HEAD:js/fx-transitions.js
    function init() {
        if (initialized) return;
        const overlay = document.getElementById('pt-overlay');
        if (!overlay) return;

        initialized = true;

        const logoWrap = overlay.querySelector('.pt-logo-wrap');
        if (logoWrap) logoWrap.style.opacity = "1";

        bindLinks();

        // Wait exactly 0.5 seconds then open
        setTimeout(() => {
            overlay.classList.add('pt-leaving');
        }, 500);
    }

    // Run as soon as possible
    init();
    
    // Also bind links when DOM is fully ready
    document.addEventListener('DOMContentLoaded', () => {
        init();
        bindLinks();
    });

    window.FxTransitions = { 
        pageIn: init, 
        pageOut: (href) => {
            const ov = document.getElementById('pt-overlay');
            if (ov) {
                ov.classList.remove('pt-leaving');
                ov.classList.add('pt-entering');
                ov.style.pointerEvents = 'all';
                setTimeout(() => { window.location.href = href; }, 600);
            } else {
                window.location.href = href;
            }
        }, 
        bindLinks 
    };
=======
    /* ---- Init on DOM ready ---- */
    document.addEventListener('DOMContentLoaded', () => {
        bindLinks();

        // Small delay so browser has painted the page
        requestAnimationFrame(() => {
            requestAnimationFrame(pageIn);
        });
    });

    // Expose for SPA-like dynamic link additions
    window.FxTransitions = { pageIn, pageOut, bindLinks };
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-transitions.js
})();
