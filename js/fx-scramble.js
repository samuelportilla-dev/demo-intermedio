/**
 * FX SCRAMBLE — Text Scramble + Char Reveal
 * Oldwest Rústica — Fase 1 Premium
 */

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>—_\\/[]{}=+*^?#@abcdefghijklmnopqrstuvwxyz';
        this.frame = 0; this.queue = []; this.frameRequest = null; this.resolve = null;
    }

    setText(newText) {
        const old = this.el.innerText;
        const len = Math.max(old.length, newText.length);
        this.queue = [];
        for (let i = 0; i < len; i++) {
            this.queue.push({
                from: old[i] || '', to: newText[i] || '',
                start: Math.floor(Math.random() * 30),
                end:   Math.floor(Math.random() * 30) + Math.floor(Math.random() * 20),
                char: '',
            });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        return new Promise(res => { this.resolve = res; this._tick(); });
    }

    _tick() {
        let output = '', done = 0;
        this.queue.forEach(q => {
            if (this.frame >= q.end) {
                done++; output += q.to;
            } else if (this.frame >= q.start) {
                if (!q.char || Math.random() < 0.28) {
                    q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
                }
                output += `<span class="scramble-char">${q.char}</span>`;
            } else { output += q.from; }
        });
        this.el.innerHTML = output;
        if (done === this.queue.length) {
            this.resolve && this.resolve();
        } else {
            this.frame++;
            this.frameRequest = requestAnimationFrame(() => this._tick());
        }
    }
}

function wrapChars(el, baseDelay = 0, delayStep = 45) {
    const text = el.textContent;
    el.innerHTML = text.split('').map((ch, i) => {
        const delay = baseDelay + i * delayStep;
        const char  = ch === ' ' ? '&nbsp;' : ch;
        return `<span class="char-reveal-wrapper"><span class="char-reveal-inner" style="animation-delay:${delay}ms">${char}</span></span>`;
    }).join('');
}

function wrapWords(el, baseDelay = 0, delayStep = 80) {
    const words = el.textContent.trim().split(/\s+/);
    el.classList.add('word-reveal');
    el.innerHTML = words.map((w, i) =>
        `<span class="word"><span class="word-inner" style="transition-delay:${baseDelay + i * delayStep}ms">${w}</span></span> `
    ).join('');
}

document.addEventListener('DOMContentLoaded', () => {

    /* Hero H1: scramble on load */
    const heroH1 = document.querySelector('.hero-10k-content h1');
    if (heroH1) {
        const originalText = heroH1.textContent.trim();
        heroH1.textContent = '';
        setTimeout(() => {
            const fx = new TextScramble(heroH1);
            fx.setText(originalText);
        }, 600);
    }

    /* Section titles: char reveal on scroll */
    const titleEls = document.querySelectorAll(
        '.overlap-text h2, .sticky-left h2, .nosotros-text h2, .section-title-premium, .philosophy-title'
    );
    titleEls.forEach(el => {
        wrapChars(el, 0, 38);
        el.querySelectorAll('.char-reveal-inner').forEach(c => {
            c.style.animationPlayState = 'paused';
            c.style.opacity = '0';
        });
    });

    /* Paragraph word-reveal */
    const paraEls = document.querySelectorAll('.hero-desc, .overlap-text p, .nosotros-text p');
    paraEls.forEach(el => wrapWords(el, 100, 60));

    /* IntersectionObserver triggers */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.querySelectorAll('.char-reveal-inner').length) {
                el.querySelectorAll('.char-reveal-inner').forEach(c => {
                    c.style.animationPlayState = 'running';
                    c.style.opacity = '1';
                });
            }
            if (el.classList.contains('word-reveal')) {
                el.querySelectorAll('.word-inner').forEach(w => { w.style.transform = 'translateY(0)'; w.style.opacity = '1'; });
                el.classList.add('active');
            }
            observer.unobserve(el);
        });
    }, { threshold: 0.2 });

    titleEls.forEach(el => observer.observe(el));
    paraEls.forEach(el => observer.observe(el));
});
