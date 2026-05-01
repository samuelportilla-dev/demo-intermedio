/**
 * FX TRANSITIONS — Cinematic Page Transitions
 * Oldwest — Fase 1 Premium
 */
(function () {
    'use strict';

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
            });
        });
    }

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
})();
