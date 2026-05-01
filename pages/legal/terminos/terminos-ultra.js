/**
 * TERMINOS ULTRA - Oldwest
 * Professional Editorial Logic
 */

(function() {
    'use strict';

    // 1. REVEAL ON SCROLL
    const initReveal = () => {
        const reveals = document.querySelectorAll('.page-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    };

    // 2. HERO PARALLAX
    const initHeroParallax = () => {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (window.innerWidth > 1024) {
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        }, { passive: true });
    };

    // 3. NAV SCROLL
    const initNavScroll = () => {
        const nav = document.querySelector('.global-nav');
        if (!nav) return;

        const handleScroll = () => {
            if (window.scrollY > 60) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    // 4. SMOOTH SCROLL FOR TOC
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('.toc-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        initReveal();
        initHeroParallax();
        initNavScroll();
        initSmoothScroll();
    });

})();
