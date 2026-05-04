/**
 * FX LIGHTBOX — Galería Cinematográfica con Zoom y Swipe
 * Oldwest — Módulo Premium
 * Auto-inicializa en nosotros.html sobre todas las imágenes
 * con clase .gallery-lb-item o dentro de .mson-item / .history-img-wrapper
 */
class FxLightbox {
    constructor() {
        this.images  = [];
        this.current = 0;
        this.zoomed  = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this._buildDOM();
        this._bindKeys();
    }

    _buildDOM() {
        const el = document.createElement('div');
        el.id = 'fx-lightbox';
        el.innerHTML = `
            <button class="lb-close" aria-label="Cerrar">✕</button>
            <button class="lb-arrow prev" aria-label="Anterior">‹</button>
            <div class="lb-img-wrap">
                <img id="lb-img" src="" alt="Galería">
            </div>
            <button class="lb-arrow next" aria-label="Siguiente">›</button>
            <div class="lb-counter" id="lb-counter">1 / 1</div>
        `;
        document.body.appendChild(el);
        this.el      = el;
        this.imgWrap = el.querySelector('.lb-img-wrap');
        this.img     = el.querySelector('#lb-img');
        this.counter = el.querySelector('#lb-counter');

        el.querySelector('.lb-close').addEventListener('click', () => this.close());
        el.querySelector('.lb-arrow.prev').addEventListener('click', () => this.prev());
        el.querySelector('.lb-arrow.next').addEventListener('click', () => this.next());
        el.addEventListener('click', e => { if (e.target === el) this.close(); });

        // Zoom on click
        this.imgWrap.addEventListener('click', () => this._toggleZoom());

        // Touch / swipe
        el.addEventListener('touchstart', e => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        el.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            const dy = Math.abs(e.changedTouches[0].clientY - this.touchStartY);
            if (Math.abs(dx) > 50 && dy < 80) {
                dx < 0 ? this.next() : this.prev();
            }
        }, { passive: true });
    }

    _bindKeys() {
        document.addEventListener('keydown', e => {
            if (!this.el.classList.contains('open')) return;
            if (e.key === 'Escape')      this.close();
            if (e.key === 'ArrowRight')  this.next();
            if (e.key === 'ArrowLeft')   this.prev();
        });
    }

    _toggleZoom() {
        this.zoomed = !this.zoomed;
        this.imgWrap.classList.toggle('zoomed', this.zoomed);
        this.img.style.transform = this.zoomed ? 'scale(1.8)' : 'scale(1)';
    }

    _resetZoom() {
        this.zoomed = false;
        this.imgWrap.classList.remove('zoomed');
        this.img.style.transform = 'scale(1)';
    }

    open(images, index = 0) {
        this.images  = images;
        this.current = index;
        this._resetZoom();
        this._loadImage();
        this.el.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.el.classList.remove('open');
        document.body.style.overflow = '';
        this._resetZoom();
    }

    next() {
        this._resetZoom();
        this.current = (this.current + 1) % this.images.length;
        this._loadImage(true);
    }

    prev() {
        this._resetZoom();
        this.current = (this.current - 1 + this.images.length) % this.images.length;
        this._loadImage(false);
    }

    _loadImage(forward = true) {
        this.img.style.opacity = '0';
        this.img.style.transform = forward ? 'translateX(30px)' : 'translateX(-30px)';
        setTimeout(() => {
            this.img.src = this.images[this.current].src;
            this.img.alt = this.images[this.current].alt || '';
            this.img.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            this.img.style.opacity    = '1';
            this.img.style.transform  = 'translateX(0) scale(1)';
            this.counter.textContent  = `${this.current + 1} / ${this.images.length}`;
        }, 100);
    }

    /**
     * Registra un conjunto de imágenes para el lightbox.
     * @param {NodeList|Array} imgEls  — elementos <img>
     */
    register(imgEls) {
        const list = Array.from(imgEls);
        list.forEach((img, i) => {
            img.closest('.gallery-lb-item') || img.parentElement.classList.add('gallery-lb-item');
            const wrapper = img.closest('.gallery-lb-item') || img.parentElement;
            wrapper.style.cursor = 'zoom-in';
            wrapper.addEventListener('click', () => {
                this.open(list.map(el => ({ src: el.src, alt: el.alt })), i);
            });
        });
    }
}

// Auto-init on nosotros.html
document.addEventListener('DOMContentLoaded', () => {
    // Collect all gallery images from nosotros page
    const targets = document.querySelectorAll(
        '.mson-item img, .history-img-wrapper img, .mobile-img-container img, .masonry-grid img, .ns-gallery-item img'
    );
    if (!targets.length) return;
    const lb = new FxLightbox();
    lb.register(targets);
    window.FxLightbox = lb;
});
