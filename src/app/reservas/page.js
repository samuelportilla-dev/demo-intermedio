/* =========================================================
   RESERVAS PREMIUM $10K - LA NONNA RÚSTICA (LEGACY PORT)
   ========================================================= */
"use client";

import { useEffect } from 'react';
import GlobalNav from '@/components/GlobalNav';
import Preloader from '@/components/Preloader';
import '../../styles/reservas-premium.css';

export default function ReservasPage() {
  useEffect(() => {
    // Load GSAP dynamically to ensure compatibility with Next.js SSR
    const initAnimations = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      window.scrollTo(0, 0);
      const tl = gsap.timeline();

      tl.to('.res-hero-bg', { scale: 1, duration: 2, ease: "power2.out" })
        .fromTo('.gsap-hero-title', 
          { y: 100, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, 
          "-=1.5")
        .fromTo('.gsap-hero-subtitle', 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, 
          "-=0.7")
        .fromTo('.gsap-reveal', 
          { y: 100, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }, 
          "-=0.5");

      // Parallax suave en Hero
      gsap.to('.res-hero-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".res-hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      
      // Initialize global UI logic if needed
      if (window.initSmartMenu) window.initSmartMenu();
    };

    initAnimations();

    // --- LOGICA DEL SELECTOR DE PERSONAS ---
    const chips = document.querySelectorAll('.person-chip');
    const hiddenInputPersonas = document.getElementById('resPersonas');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (hiddenInputPersonas) {
          hiddenInputPersonas.value = chip.getAttribute('data-value');
        }
      });
    });

    // --- LOGICA DEL CARRUSEL DE OCASIÓN ---
    const oCards = document.querySelectorAll('.occasion-card');
    const hiddenInputOcasion = document.getElementById('resOcasion');

    oCards.forEach(card => {
      card.addEventListener('click', () => {
        oCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (hiddenInputOcasion) {
          hiddenInputOcasion.value = card.getAttribute('data-value');
        }
        
        // Desplazamiento suave al centro al seleccionar
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });

    // --- INTEGRACIÓN WHATSAPP PROFESIONAL ---
    const form = document.getElementById('formReserva');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById("resNombre").value;
        const fecha = document.getElementById("resFecha").value;
        const hora = document.getElementById("resHora").value;
        const personas = document.getElementById("resPersonas").value;
        const ocasion = document.getElementById("resOcasion").value;

        let textoWP = `SOLICITUD DE RESERVA - LA NONNA RÚSTICA\n\n`;
        textoWP += `Anfitrión: ${nombre}\n`;
        textoWP += `Fecha: ${fecha}\n`;
        textoWP += `Hora: ${hora}\n`;
        textoWP += `Comensales: ${personas}\n`;
        textoWP += `Ocasión: ${ocasion}\n\n`;
        textoWP += `Cordialmente solicitado para confirmación de disponibilidad.`;

        const num = (window.RESTAURANT_CONFIG?.telefonoWP) ? window.RESTAURANT_CONFIG.telefonoWP : "573112518913";
        const link = `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(textoWP)}`;
        window.open(link, '_blank');
      });
    }
  }, []);

  return (
    <div className="page-reservas">
      <Preloader />
      
      {/* Global Navigation */}
      <GlobalNav activeLink="reservas" />

      {/* Hero Section Cinematográfica */}
      <header className="res-hero">
        <div className="res-hero-bg"></div>
        <div className="res-hero-content">
          <h1 className="gsap-hero-title">La Mesa de la Nonna</h1>
          <p className="gsap-hero-subtitle">Una experiencia gastronómica exclusiva</p>
        </div>
      </header>

      {/* Booking Section */}
      <main className="res-booking-section">
        <div className="glass-booking-container gsap-reveal">
          <div className="booking-grid">
            <div className="booking-info">
              <h2>Tu Velada Ideal</h2>
              <p>Déjanos el honor de prepararte una mesa perfecta. En La Nonna Rústica, cada reserva es una promesa de calidad, sabor y hospitalidad italiana auténtica.</p>
              
              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--res-gold)', fontSize: '1.1rem', fontWeight: 800 }}>[I]</span>
                  <span>Ambiente exclusivo y privado</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--res-gold)', fontSize: '1.1rem', fontWeight: 800 }}>[II]</span>
                  <span>Cava de vinos seleccionada</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--res-gold)', fontSize: '1.1rem', fontWeight: 800 }}>[III]</span>
                  <span>Atención personalizada del Chef</span>
                </div>
              </div>
            </div>

            <div className="booking-form-container">
              <form className="premium-form" id="formReserva">
                <div className="form-group">
                  <label className="input-label">Nombre del Anfitrión</label>
                  <input type="text" id="resNombre" className="input-reserva" placeholder="¿A nombre de quién?" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="input-label">Fecha</label>
                    <input type="date" id="resFecha" className="input-reserva" required />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Hora</label>
                    <input type="time" id="resHora" className="input-reserva" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Número de Comensales</label>
                  <div className="people-selector" id="peopleSelector">
                    <div className="person-chip" data-value="1-2">1-2</div>
                    <div className="person-chip active" data-value="3-4">3-4</div>
                    <div className="person-chip" data-value="5-8">5-8</div>
                    <div className="person-chip" data-value="Mesa Grande">8+</div>
                  </div>
                  <input type="hidden" id="resPersonas" defaultValue="3-4" />
                </div>

                {/* Carrusel Especial de Ocasión */}
                <div className="form-group">
                  <label className="input-label">Tipo de Ocasión</label>
                  <div className="occasion-carousel" id="occasionCarousel">
                    <div className="occasion-card active" data-value="Cena Casual">
                      <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop" alt="Casual" />
                      <div className="oc-overlay"><span>Cena Casual</span></div>
                    </div>
                    <div className="occasion-card" data-value="Cumpleaños">
                      <img src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=400&auto=format&fit=crop" alt="Cumple" />
                      <div className="oc-overlay"><span>Cumpleaños</span></div>
                    </div>
                    <div className="occasion-card" data-value="Aniversario">
                      <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop" alt="Aniversario" />
                      <div className="oc-overlay"><span>Aniversario</span></div>
                    </div>
                    <div className="occasion-card" data-value="Negocios">
                      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop" alt="Negocios" />
                      <div className="oc-overlay"><span>Negocios</span></div>
                    </div>
                    <div className="occasion-card" data-value="Otra">
                      <img src="https://images.unsplash.com/photo-1528605248644-14dd04cbda1d?q=80&w=400&auto=format&fit=crop" alt="Otra" />
                      <div className="oc-overlay"><span>Otra</span></div>
                    </div>
                  </div>
                  <input type="hidden" id="resOcasion" defaultValue="Cena Casual" />
                </div>

                <button type="submit" className="res-btn-submit">Confirmar Reserva</button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Premium Centered */}
      <footer className="footer-premium footer-reservas">
        <div className="footer-content" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div className="footer-logo">
            <img src="/img/logo.png" alt="Logo" className="footer-logo-img" style={{ margin: '0 auto' }} />
          </div>
          <p style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '1.5rem', margin: '2rem 0', color: 'var(--res-gold)' }}>
            "La verdadera esencia de Italia en cada bocado."
          </p>
          <div className="footer-tech" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <p>Digital Experience Crafted by:</p>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>Samuel Portilla</span>
          </div>
          <div style={{ marginTop: '3rem', opacity: 0.3 }}>
            &copy; 2026 LA NONNA RÚSTICA.<br />
            Arquitectura Digital Premium por Samuel Andres Portilla Ardila.
          </div>
        </div>
      </footer>
    </div>
  );
}
