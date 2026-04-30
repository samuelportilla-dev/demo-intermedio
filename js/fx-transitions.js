/**
 * FX TRANSITIONS — Cinematic Page Transitions
 * Oldwest Rústica — Fase 1 Premium
 */
(function () {
    'use strict';

    const overlay = document.createElement('div');
    overlay.id = 'pt-overlay';
    const isSubPage = window.location.pathname.includes('/pages/');
    const isLegal = window.location.pathname.includes('/legal/');
    let logoPath = "img/logo.png";
    if (isLegal) logoPath = "../../../img/logo.png";
    else if (isSubPage) logoPath = "../../img/logo.png";

    overlay.innerHTML = `
        <div class="pt-curtain-top"></div>
        <div class="pt-curtain-bottom"></div>
        <div class="pt-logo-wrap">
            <img src="${logoPath}" alt="Oldwest">
            <span>Oldwest RÚSTICA</span>
        </div>
    `;
    document.body.appendChild(overlay);

    function pageIn() {
        overlay.classList.add('pt-leaving');
        setTimeout(() => overlay.classList.remove('pt-leaving'), 1900);
    }

    function pageOut(href) {
        overlay.classList.add('pt-entering');
        overlay.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = href; }, 680);
    }

    function bindLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('tel:') ||
                href.startsWith('mailto:') || href.startsWith('http') ||
                link.target === '_blank') return;
            link.addEventListener('click', function (e) {
                e.preventDefault();
                pageOut(href);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        bindLinks();
        requestAnimationFrame(() => requestAnimationFrame(pageIn));
    });

    window.FxTransitions = { pageIn, pageOut, bindLinks };
})();
