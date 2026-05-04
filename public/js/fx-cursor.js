/**
<<<<<<< HEAD:js/fx-cursor.js
 * FX CURSOR — LIQUID AURA (PREMIUM UPGRADE)
 * Oldwest — Digital Architecture
 */

(function () {
    'use strict';

    // Disable on mobile/touch
    if ('ontouchstart' in window || window.innerWidth < 769) return;

    class LiquidCursor {
        constructor() {
            this.dot = document.createElement('div');
            this.aura = document.createElement('div');
            
            this.dot.className = 'cursor-dot';
            this.aura.className = 'cursor-aura';
            
            document.body.appendChild(this.dot);
            document.body.appendChild(this.aura);

            this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.dotPos = { x: this.pos.x, y: this.pos.y };
            this.auraPos = { x: this.pos.x, y: this.pos.y };
            
            // Animation config
            this.lerpAmount = 0.18; // Smoothness factor
            
            this.init();
        }

        init() {
            // Mouse Tracking
            window.addEventListener('mousemove', (e) => {
                this.pos.x = e.clientX;
                this.pos.y = e.clientY;
            });

            // Click States
            window.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
            window.addEventListener('mouseup', () => document.body.classList.remove('cursor-clicking'));

            // Interaction Delegation
            const hoverSelectors = 'a, button, [role="button"], .interactive, .card-producto, .showcase-card, .btn-ultra-primary, .btn-ultra-ghost, .nav-cart-wrapper';
            const textSelectors = 'p, h1, h2, h3, h4, h5, h6, .num-value, blockquote';

            document.addEventListener('mouseover', (e) => {
                const target = e.target.closest(hoverSelectors);
                const textTarget = e.target.closest(textSelectors);

                if (target) {
                    document.body.classList.add('cursor-active');
                    document.body.classList.remove('cursor-is-text');
                    
                    // Check for custom labels
                    const label = target.getAttribute('data-cursor-label');
                    if (label) {
                        this.aura.setAttribute('data-label', label);
                        document.body.classList.add('has-cursor-label');
                    }
                } else if (textTarget) {
                    document.body.classList.add('cursor-is-text');
                    document.body.classList.remove('cursor-active', 'has-cursor-label');
                } else {
                    this.clearStates();
                }
            });

            document.addEventListener('mouseout', (e) => {
                const target = e.target.closest(hoverSelectors);
                if (target) this.clearStates();
            });

            this.animate();
        }

        clearStates() {
            document.body.classList.remove('cursor-active', 'cursor-is-text', 'has-cursor-label');
            this.aura.removeAttribute('data-label');
        }

        // Linear Interpolation
        lerp(start, end, amount) {
            return (1 - amount) * start + amount * end;
        }

        animate() {
            // Precision dot follows instantly (or with very high lerp)
            this.dotPos.x = this.pos.x;
            this.dotPos.y = this.pos.y;
            
            // Aura follows with liquid lag
            this.auraPos.x = this.lerp(this.auraPos.x, this.pos.x, this.lerpAmount);
            this.auraPos.y = this.lerp(this.auraPos.y, this.pos.y, this.lerpAmount);

            // Apply smooth transforms
            this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0) translate(-50%, -50%)`;
            this.aura.style.transform = `translate3d(${this.auraPos.x}px, ${this.auraPos.y}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(() => this.animate());
        }
    }

    // Launch when ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        new LiquidCursor();
    } else {
        document.addEventListener('DOMContentLoaded', () => new LiquidCursor());
    }
=======
 * FX CURSOR — Fire Trail
 * La Nonna Rústica — Fase 1 Premium
 */
(function () {
    'use strict';
    if ('ontouchstart' in window || window.innerWidth < 769) return;

    // --- DOM Elements ---
    const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    const canvas = document.createElement('canvas'); canvas.id = 'fire-cursor-canvas';
    document.body.append(dot, ring, canvas);
    document.body.style.cursor = 'none';

    const ctx = canvas.getContext('2d');
    let mouse = { x: -200, y: -200 };
    let ringPos = { x: -200, y: -200 };
    let particles = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    // --- Track mouse ---
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.left = mouse.x + 'px';
        dot.style.top  = mouse.y + 'px';
        for (let i = 0; i < 3; i++) particles.push(mkParticle(mouse.x, mouse.y));
    });

    // --- Hover detection ---
    const hoverSelectors = 'a, button, [role="button"], .card-producto, .sticky-card, input, select, label';
    document.querySelectorAll(hoverSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // --- Particle factory ---
    function mkParticle(x, y) {
        return {
            x: x + (Math.random() - 0.5) * 10,
            y,
            size: Math.random() * 9 + 3,
            life: 1,
            decay: Math.random() * 0.04 + 0.022,
            vx: (Math.random() - 0.5) * 1.8,
            vy: -(Math.random() * 2.8 + 0.8),
            hue: Math.random() < 0.4 ? 15 : 35,
        };
    }

    function drawParticle(p) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0,   `hsla(55,  100%, 90%, ${p.life})`);
        g.addColorStop(0.35,`hsla(${p.hue + 20}, 100%, 65%, ${p.life * 0.75})`);
        g.addColorStop(0.75,`hsla(${p.hue},      100%, 50%, ${p.life * 0.3})`);
        g.addColorStop(1,   `hsla(${p.hue - 10}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
    }

    // --- Ring lerp ---
    function lerpRing() {
        ringPos.x += (mouse.x - ringPos.x) * 0.11;
        ringPos.y += (mouse.y - ringPos.y) * 0.11;
        ring.style.left = ringPos.x + 'px';
        ring.style.top  = ringPos.y + 'px';
    }

    // --- Main loop ---
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0 && p.size > 0.4);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.97; p.vy *= 0.98;
            p.size *= 0.94; p.life -= p.decay;
            drawParticle(p);
        });
        lerpRing();
        requestAnimationFrame(loop);
    }
    loop();
>>>>>>> e178297 (🚀 Premium Migration: Restore legacy base styles, fix character encoding, and refine modal UI spacing):public/js/fx-cursor.js
})();
