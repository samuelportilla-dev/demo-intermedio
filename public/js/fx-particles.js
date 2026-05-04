/**
 * FX PARTICLES — Ember Brasas en el Hero
<<<<<<< HEAD:js/fx-particles.js
 * Oldwest — Fase 1 Premium
=======
 * La Nonna Rústica — Fase 1 Premium
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-particles.js
 */
class EmberParticles {
    constructor(container) {
        this.el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.el) return;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ember-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.el.appendChild(this.canvas);
        this.particles = [];
        this.maxP = window.innerWidth < 768 ? 40 : 80;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.populate();
        this.loop();
    }

    resize() {
        this.canvas.width  = this.el.offsetWidth;
        this.canvas.height = this.el.offsetHeight;
    }

    mkEmber() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            size:    Math.random() * 2.5 + 0.8,
            speedY: -(Math.random() * 1.4 + 0.4),
            speedX:  (Math.random() - 0.5) * 0.7,
<<<<<<< HEAD:js/fx-particles.js
            life: 0, maxLife: Math.random() * 220 + 80,
            wobble: Math.random() * Math.PI * 2,
=======
            life: 0,
            maxLife: Math.random() * 220 + 80,
            wobble:      Math.random() * Math.PI * 2,
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-particles.js
            wobbleSpeed: (Math.random() - 0.5) * 0.04,
            hue: [15, 30, 45, 50][Math.floor(Math.random() * 4)],
            glow: Math.random() > 0.65,
        };
    }

    populate() {
        for (let i = 0; i < this.maxP; i++) {
            const e = this.mkEmber();
            e.life = Math.random() * e.maxLife;
            e.y   -= e.speedY * e.life;
            this.particles.push(e);
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
<<<<<<< HEAD:js/fx-particles.js
        this.particles.forEach(p => {
            p.life++; p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * 0.4;
            p.y += p.speedY;
            const t = p.life / p.maxLife;
            const alpha = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1;

=======

        this.particles.forEach(p => {
            // Update
            p.life++; p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * 0.4;
            p.y += p.speedY;

            const t = p.life / p.maxLife;
            const alpha = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1;

            // Draw glow halo
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-particles.js
            if (p.glow) {
                const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                g.addColorStop(0,   `hsla(55, 100%, 90%, ${alpha * 0.9})`);
                g.addColorStop(0.4, `hsla(${p.hue}, 100%, 65%, ${alpha * 0.4})`);
                g.addColorStop(1,   `hsla(${p.hue}, 100%, 50%, 0)`);
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
<<<<<<< HEAD:js/fx-particles.js
                this.ctx.fillStyle = g; this.ctx.fill();
            }

=======
                this.ctx.fillStyle = g;
                this.ctx.fill();
            }

            // Draw core dot
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-particles.js
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size + Math.sin(p.life * 0.05) * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue + 20}, 100%, 82%, ${alpha})`;
            this.ctx.fill();

            if (p.life >= p.maxLife || p.y < -20) Object.assign(p, this.mkEmber());
        });
<<<<<<< HEAD:js/fx-particles.js
=======

>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-particles.js
        requestAnimationFrame(() => this.loop());
    }
}

<<<<<<< HEAD:js/fx-particles.js
=======
// Auto-init
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-particles.js
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero-10k');
    if (hero) new EmberParticles(hero);
});
