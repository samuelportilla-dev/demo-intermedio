/**
 * FX CURSOR — LIQUID AURA (PREMIUM UPGRADE)
 * Oldwest Rústica — Digital Architecture
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
})();
