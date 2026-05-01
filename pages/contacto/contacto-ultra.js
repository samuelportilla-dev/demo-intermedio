/**
 * CONTACTO ULTRA — JS Dedicado
 * Oldwest — Interacciones Cinematográficas
 */
(function () {
    'use strict';

    /* ==================== 1. REVEAL OBSERVER ==================== */
    const revObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.ct-reveal').forEach(el => revObs.observe(el));

    /* ==================== 2. HERO PARALLAX ==================== */
    const heroBg = document.querySelector('.ct-hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            heroBg.style.transform = `scale(1.05) translateY(${y * 0.35}px)`;
        }, { passive: true });
    }

    /* ==================== 3. NAV SCROLL EFFECT ==================== */
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.global-nav');
        if (!nav) return;
        
        if (window.scrollY > 60) {
            nav.style.background = 'rgba(5, 5, 4, 0.98)';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            nav.style.borderBottomColor = 'rgba(245,240,232,0.08)';
        } else {
            nav.style.background = 'rgba(10, 9, 8, 0.6)';
            nav.style.boxShadow = 'none';
            nav.style.borderBottomColor = 'rgba(245,240,232,0.04)';
        }
    }, { passive: true });

    /* ==================== 4. FORM HANDLING ==================== */
    const contactForm = document.getElementById('contactFormUltra');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('conNombre').value;
            const email = document.getElementById('conEmail').value;
            const mensaje = document.getElementById('conMensaje').value;
            
            // Efecto visual en el botón
            const btn = this.querySelector('.ct-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            // WhatsApp Logic
            let textoWP = `*Oldwest — CONTACTO PREMIUM*\n\n`;
            textoWP += `*Nombre:* ${nombre}\n`;
            if (email) textoWP += `*Email:* ${email}\n`;
            textoWP += `*Mensaje:* ${mensaje}\n\n`;
            textoWP += `_Enviado desde el portal editorial ultra._`;
            
            const num = "573112518913"; // Hardcoded default based on context
            const link = `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(textoWP)}`;
            
            setTimeout(() => {
                window.open(link, '_blank');
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                this.reset();
            }, 800);
        });
    }

})();
