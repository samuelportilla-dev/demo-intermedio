/**
 * NOSOTROS ULTRA — JS Dedicado
 * Oldwest — Interacciones Cinematográficas
 *
 * Módulos:
 * 1. Timeline sticky con switch de imagen en scroll
 * 2. IntersectionObserver para ns-reveal / ns-reveal-left
 * 3. Parallax del hero
 * 4. Gallery lightbox hook (se apoya en fx-lightbox.js)
 */
(function () {
    'use strict';

    const IS_MOBILE = window.innerWidth < 1025;

    /* ==================== 1. REVEAL OBSERVER ==================== */
    const revObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.ns-reveal, .ns-reveal-left').forEach(el => revObs.observe(el));

    /* ==================== 2. TIMELINE STICKY ==================== */
    if (!IS_MOBILE) {
        const nodes  = document.querySelectorAll('.ns-tl-node');
        const frames = document.querySelectorAll('.ns-tl-img-frame');

        function activateNode(node) {
            nodes.forEach(n => n.classList.remove('focused'));
            node.classList.add('focused');

            const target = node.dataset.img;
            frames.forEach(f => {
                f.classList.remove('active');
                if (f.dataset.frame === target) f.classList.add('active');
            });
        }

        // Initialize first
        if (nodes[0])  activateNode(nodes[0]);

        const nodeObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) activateNode(e.target);
            });
        }, { threshold: 0.35, rootMargin: '-15% 0px -45% 0px' });

        nodes.forEach(n => nodeObs.observe(n));
    }

    /* ==================== 3. HERO PARALLAX ==================== */
    const heroParallax = document.querySelector('.ns-hero-bg-parallax');
    if (heroParallax) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            heroParallax.style.transform = `translateY(${y * 0.35}px)`;
        }, { passive: true });
    }

    /* ==================== 4. NAV COLOR (oscuro) ==================== */
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.global-nav');
        if (!nav) return;
        nav.style.background = window.scrollY > 60
            ? 'rgba(5,5,4,0.97)'
            : 'rgba(10,9,8,0.5)';
        nav.style.boxShadow = window.scrollY > 60
            ? '0 1px 0 rgba(245,240,232,0.05)'
            : 'none';
    }, { passive: true });

    /* ==================== 5. GALLERY — asegurar lightbox ==================== */
    // fx-lightbox.js se inicializa automáticamente en DOMContentLoaded
    // Este hook añade la clase gallery-lb-item a los items ns-gallery si el
    // selector del lightbox no los captura por defecto
    document.addEventListener('DOMContentLoaded', () => {
        // El lightbox de fx-lightbox.js busca .ns-gallery-item img
        // Si window.FxLightbox existe, registra manualmente
        const galleryImgs = document.querySelectorAll('.ns-gallery-item img');
        if (galleryImgs.length && window.FxLightbox) {
            window.FxLightbox.register(galleryImgs);
        }
    });

})();
