/**
 * FX TILT — 3D Perspective Tilt on Cards
<<<<<<< HEAD:js/fx-tilt.js
 * Oldwest — Fase 1 Premium
=======
 * La Nonna Rústica — Fase 1 Premium
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
 */
class TiltCard {
    constructor(el, opts = {}) {
        this.el  = el;
        this.cfg = {
            maxTilt:     opts.maxTilt     || 12,
            perspective: opts.perspective || 900,
            scale:       opts.scale       || 1.04,
            speed:       opts.speed       || 450,
            glare:       opts.glare       !== false,
            maxGlare:    opts.maxGlare    || 0.25,
        };
<<<<<<< HEAD:js/fx-tilt.js
=======
        this.glareEl = null;
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
        this._init();
    }

    _init() {
        this.el.classList.add('tilt-ready');
        this.el.style.position = 'relative';
        this.el.style.overflow = 'hidden';
<<<<<<< HEAD:js/fx-tilt.js
=======

>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
        if (this.cfg.glare) {
            this.glareEl = document.createElement('div');
            this.glareEl.className = 'tilt-glare';
            this.el.appendChild(this.glareEl);
        }
<<<<<<< HEAD:js/fx-tilt.js
=======

>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
        this.el.addEventListener('mousemove',  e => this._onMove(e));
        this.el.addEventListener('mouseleave', () => this._onLeave());
        this.el.addEventListener('mouseenter', () => this._onEnter());
    }

    _getValues(e) {
<<<<<<< HEAD:js/fx-tilt.js
        const r = this.el.getBoundingClientRect();
        const pctX = (e.clientX - r.left) / r.width;
        const pctY = (e.clientY - r.top)  / r.height;
=======
        const r    = this.el.getBoundingClientRect();
        const x    = e.clientX - r.left;
        const y    = e.clientY - r.top;
        const pctX = x / r.width;
        const pctY = y / r.height;
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
        return {
            tiltX:  (pctY - 0.5) * this.cfg.maxTilt * 2,
            tiltY: -(pctX - 0.5) * this.cfg.maxTilt * 2,
            pctX, pctY,
        };
    }

    _onMove(e) {
        const v = this._getValues(e);
        this.el.style.transition = 'transform 0.08s ease';
        this.el.style.transform  =
            `perspective(${this.cfg.perspective}px) rotateX(${v.tiltX}deg) rotateY(${v.tiltY}deg) scale(${this.cfg.scale})`;
<<<<<<< HEAD:js/fx-tilt.js
=======

>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
        if (this.glareEl) {
            this.glareEl.style.background =
                `radial-gradient(circle at ${v.pctX * 100}% ${v.pctY * 100}%, rgba(255,255,255,${this.cfg.maxGlare}), transparent 65%)`;
        }
    }

    _onLeave() {
        this.el.style.transition = `transform ${this.cfg.speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        this.el.style.transform  = `perspective(${this.cfg.perspective}px) rotateX(0) rotateY(0) scale(1)`;
        if (this.glareEl) this.glareEl.style.background = 'transparent';
    }

<<<<<<< HEAD:js/fx-tilt.js
    _onEnter() { this.el.style.transition = 'transform 0.08s ease'; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 769) return;
    document.querySelectorAll('.sticky-card, .philosophy-card, .feature-box, .promo-card').forEach(el =>
        new TiltCard(el, { maxTilt: 10, scale: 1.03 })
    );
    document.querySelectorAll('.card-producto').forEach(el =>
        new TiltCard(el, { maxTilt: 8, scale: 1.02, maxGlare: 0.15 })
    );
});

=======
    _onEnter() {
        this.el.style.transition = 'transform 0.08s ease';
    }

    destroy() {
        this.el.removeEventListener('mousemove',  this._onMove);
        this.el.removeEventListener('mouseleave', this._onLeave);
        this.el.removeEventListener('mouseenter', this._onEnter);
        if (this.glareEl) this.glareEl.remove();
    }
}

/* --- Auto-init on all card selectors --- */
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 769) return; // only desktop

    const selectors = '.sticky-card, .philosophy-card, .feature-box, .promo-card';
    document.querySelectorAll(selectors).forEach(el => new TiltCard(el, { maxTilt: 10, scale: 1.03 }));

    /* Menu cards — slightly lighter tilt since they're smaller */
    document.querySelectorAll('.card-producto').forEach(el => new TiltCard(el, { maxTilt: 8, scale: 1.02, maxGlare: 0.15 }));
});

/* Expose globally so menu.html can call it after dynamic render */
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-tilt.js
window.TiltCard = TiltCard;
