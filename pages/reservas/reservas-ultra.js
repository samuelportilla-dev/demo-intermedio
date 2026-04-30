/**
 * RESERVAS ULTRA - Oldwest RÚSTICA
 * Professional Editorial Logic
 */

(function() {
    'use strict';

    // 1. REVEAL ON SCROLL (IntersectionObserver)
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
            // Solo aplicar en Desktop
            if (window.innerWidth > 1024) {
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        }, { passive: true });
    };

    // 3. NAV SCROLL SOLIDIFY
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
        handleScroll(); // Check initial state
    };

    // 4. SHOWCASE DRAG-TO-SCROLL
    const initShowcaseDrag = () => {
        const slider = document.querySelector('.showcase-slider');
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    };

    // 5. CUSTOM SELECT LOGIC
    const initCustomSelects = () => {
        const selects = document.querySelectorAll('.custom-select');
        
        if (selects.length === 0) return;

        selects.forEach(select => {
            const trigger = select.querySelector('.select-trigger');
            const options = select.querySelectorAll('.select-option');
            const hiddenInput = select.querySelector('input[type="hidden"]');
            const label = select.querySelector('.selected-value');

            if (!trigger || !options) return;

            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = select.classList.contains('open');
                
                // Close all others first
                document.querySelectorAll('.custom-select').forEach(s => {
                    s.classList.remove('open');
                });

                if (!isOpen) {
                    select.classList.add('open');
                }
            });

            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = option.dataset.value;
                    const text = option.textContent;
                    
                    if (label) label.textContent = text;
                    if (hiddenInput) hiddenInput.value = val;
                    
                    options.forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    select.classList.remove('open');
                });
            });
        });

        // Close on outside click
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
        });
    };

    // 6. FORM WHATSAPP HANDLING
    const initFormReserva = () => {
        const form = document.getElementById('formReservaUltra');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('ultraName').value;
            const date = document.getElementById('ultraDate').value;
            const time = document.getElementById('ultraTime').value;
            const guestCount = document.getElementById('ultraGuests').value;
            const occasion = document.getElementById('ultraOccasion').value;
            const notes = document.getElementById('ultraNotes').value;

            let message = `*SOLICITUD DE RESERVA PREMIUM*\n`;
            message += `--------------------------------\n`;
            message += `*Anfitrión:* ${name}\n`;
            message += `*Fecha:* ${date}\n`;
            message += `*Hora:* ${time}\n`;
            message += `*Comensales:* ${guestCount}\n`;
            message += `*Ocasión:* ${occasion}\n`;
            if (notes) message += `*Notas:* ${notes}\n`;
            message += `--------------------------------\n`;
            message += `_Solicitado desde el portal Ultra de Oldwest Rústica_`;

            const phone = "573112518913"; // Config value
            const wpUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
            
            window.open(wpUrl, '_blank');
        });
    };

    // Initialize all modules
    document.addEventListener('DOMContentLoaded', () => {
        initReveal();
        initHeroParallax();
        initNavScroll();
        initShowcaseDrag();
        initFormReserva();
        
        // Small delay to ensure all CSS and DOM elements are fully calculated
        setTimeout(initCustomSelects, 100);
    });

})();
