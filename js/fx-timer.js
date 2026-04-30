/**
 * FX TIMER — Countdown de Oferta del Día (Versión Ultra)
 * Oldwest Rústica — Módulo Premium
 * Inyecta un banner de cuenta regresiva al inicio de la página.
 */
(function () {
    'use strict';

    function buildBanner() {
        const banner = document.createElement('div');
        banner.className = 'offer-timer-banner';
        banner.id = 'offer-timer-banner';
        banner.innerHTML = `
            <div class="timer-label">🔥 <span>Oferta del Día</span> — Hasta medianoche</div>
            <div class="timer-digits">
                <div class="timer-unit">
                    <div class="timer-num" id="t-hours">00</div>
                    <span class="timer-lbl">h</span>
                </div>
                <span class="timer-sep">:</span>
                <div class="timer-unit">
                    <div class="timer-num" id="t-mins">00</div>
                    <span class="timer-lbl">m</span>
                </div>
                <span class="timer-sep">:</span>
                <div class="timer-unit">
                    <div class="timer-num" id="t-secs">00</div>
                    <span class="timer-lbl">s</span>
                </div>
            </div>
            <a href="pages/menu/" class="timer-cta">Aprovechar</a>
        `;
        return banner;
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function getSecondsUntilMidnight() {
        const now  = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return Math.floor((midnight - now) / 1000);
    }

    function tick(elH, elM, elS) {
        let total = getSecondsUntilMidnight();
        if (total <= 0) total = 86400;

        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;

        if (elH) elH.textContent = pad(h);
        if (elM) elM.textContent = pad(m);
        if (elS) elS.textContent = pad(s);
    }

    function init() {
        if (document.getElementById('offer-timer-banner')) return;

        const banner = buildBanner();
        document.body.prepend(banner);

        const nav = document.querySelector('.global-nav');
        
        function updateNavPosition() {
            if (!nav) return;
            const bannerHeight = banner.offsetHeight;
            const scrollY = window.scrollY;
            
            if (scrollY < bannerHeight) {
                nav.style.top = (bannerHeight - scrollY) + 'px';
            } else {
                nav.style.top = '0px';
            }
        }

        window.addEventListener('scroll', updateNavPosition, { passive: true });
        window.addEventListener('resize', updateNavPosition);
        
        // Ejecución inicial después de un pequeño delay para asegurar renderizado
        setTimeout(updateNavPosition, 100);

        const elH = document.getElementById('t-hours');
        const elM = document.getElementById('t-mins');
        const elS = document.getElementById('t-secs');

        tick(elH, elM, elS);
        setInterval(() => tick(elH, elM, elS), 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
