/**
 * FX WHATSAPP — Chat Flotante Premium con Bubble Animation
 * Oldwest Rústica — Módulo Premium
 */
(function () {
    'use strict';

    function getPhone() {
        if (typeof RESTAURANT_CONFIG !== 'undefined' && RESTAURANT_CONFIG.telefonoWP) {
            return RESTAURANT_CONFIG.telefonoWP;
        }
        return '573112518913';
    }

    function buildWidget() {
        const widget = document.createElement('div');
        widget.id = 'wa-chat-widget';
        widget.innerHTML = `
            <div class="wa-tooltip" id="wa-tooltip">
                <button class="wa-close-tooltip" id="wa-close-tip" aria-label="Cerrar">×</button>
                <div class="wa-tooltip-header">
                    <div class="wa-avatar">
                        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>
                    </div>
                    <div>
                        <div class="wa-name">Oldwest Rústica</div>
                        <div class="wa-status">En línea ahora</div>
                    </div>
                </div>
                <p class="wa-msg">¡Hola! 👋 ¿Quieres hacer una reserva o consultar nuestro menú? Te respondemos en segundos.</p>
                <a class="wa-cta-link" id="wa-cta-link" href="#" target="_blank" rel="noopener">
                    💬 Enviar Mensaje
                </a>
            </div>
            <button class="wa-bubble-btn" id="wa-btn" aria-label="Chat de WhatsApp">
                <div class="wa-ring"></div>
                <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>
            </button>
        `;
        document.body.appendChild(widget);

        const btn     = widget.querySelector('#wa-btn');
        const tooltip = widget.querySelector('#wa-tooltip');
        const closeEl = widget.querySelector('#wa-close-tip');
        const ctaLink = widget.querySelector('#wa-cta-link');
        let   open    = false;
        let   dismissed = false;

        function setLink() {
            const msg = encodeURIComponent('¡Hola Oldwest Rústica! 👋 Vengo desde su página web y me gustaría...');
            ctaLink.href = `https://api.whatsapp.com/send?phone=${getPhone()}&text=${msg}`;
        }
        setLink();

        function showTooltip() {
            open = true;
            tooltip.classList.add('visible');
        }
        function hideTooltip() {
            open = false;
            tooltip.classList.remove('visible');
        }

        btn.addEventListener('click', () => { open ? hideTooltip() : showTooltip(); });
        closeEl.addEventListener('click', e => { e.stopPropagation(); hideTooltip(); dismissed = true; });

        // Auto-show after 4 seconds if not dismissed
        setTimeout(() => { if (!dismissed) showTooltip(); }, 4000);
        // Auto-hide after 12s
        setTimeout(() => { if (open && !dismissed) hideTooltip(); }, 12000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
