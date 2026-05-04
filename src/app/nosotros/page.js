"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import GlobalNav from '@/components/GlobalNav';
import Preloader from '@/components/Preloader';
import Footer from '@/components/Footer';
import '../../styles/nosotros.css';
import '../../styles/nosotros-mobile.css';

export default function NosotrosPage() {
  useEffect(() => {
    const isMobile = window.innerWidth < 900;

    const revealOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, revealOptions);

    document.querySelectorAll('.reveal, .mobile-reveal').forEach(el => revealObserver.observe(el));

    if (!isMobile) {
      const nodes = document.querySelectorAll('.history-node');
      const images = document.querySelectorAll('.history-img-wrapper');

      const nodeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            nodes.forEach(n => n.classList.remove('focus'));
            entry.target.classList.add('focus');
            const targetId = entry.target.getAttribute('data-target');
            images.forEach(img => {
              img.classList.remove('active-img');
              if (img.id === targetId) img.classList.add('active-img');
            });
          }
        });
      }, { threshold: 0.2, rootMargin: '-20% 0px -40% 0px' });

      nodes.forEach(node => nodeObserver.observe(node));
      if (nodes[0]) nodes[0].classList.add('focus');
      if (images[0]) images[0].classList.add('active-img');
    } else {
      document.querySelectorAll('.history-node').forEach(n => n.classList.add('focus'));
    }

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      <Preloader />
      <style>{`@media (max-width: 900px) { .nav-cart-wrapper { display: none !important; } }`}</style>
      <GlobalNav activeLink="nosotros" />

      {/* 10x Editorial Hero */}
      <header className="hero-editorial">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop"
          className="hero-editorial-img"
          alt="La Nonna Rústica Interior"
        />
        <div className="hero-editorial-content reveal">
          <span className="editorial-subtitle">Genuino &amp; Intacto</span>
          <h1 className="editorial-title">Paciencia.<br />Harina.<br />Fuego.</h1>
          <p className="hero-editorial-p">No hemos cambiado una sola receta en 90 años. Porque la prisa es el enemigo de lo excepcional.</p>
        </div>
      </header>

      {/* Métricas Heroicas */}
      <section className="heritage-stats">
        <div className="stat-item reveal"><h3>72</h3><p>Horas de Fermentación Lenta</p></div>
        <div className="stat-item reveal" style={{ transitionDelay: '0.1s' }}><h3>450°C</h3><p>Fuego Vivo Constante</p></div>
        <div className="stat-item reveal" style={{ transitionDelay: '0.2s' }}><h3>90s</h3><p>Tiempo de Cocción Exacto</p></div>
        <div className="stat-item reveal" style={{ transitionDelay: '0.3s' }}><h3>1</h3><p>Sola Masa Madre Viva</p></div>
      </section>

      {/* History Timeline */}
      <section className="history-stack-container">
        {/* Desktop Sticky Image Column */}
        <div className="history-img-col">
          <div className="history-img-wrapper active-img" id="img-1924">
            <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop" alt="1924" />
          </div>
          <div className="history-img-wrapper" id="img-1960">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" alt="1960" />
          </div>
          <div className="history-img-wrapper" id="img-2003">
            <img src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800&auto=format&fit=crop" alt="2003" />
          </div>
          <div className="history-img-wrapper" id="img-hoy">
            <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=800&auto=format&fit=crop" alt="Hoy" />
          </div>
        </div>

        <div className="history-text-col">
          <div className="history-node" data-target="img-1924">
            <span className="history-year mobile-reveal">1924</span>
            <h2 className="mobile-reveal">El Principio del Cultivo</h2>
            <div className="mobile-img-container mobile-reveal">
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop" alt="1924" />
            </div>
            <p className="mobile-reveal">En el corazón de Nápoles, el Bisabuelo Vincenzo comienza a cultivar nuestro <em>Lievito Madre</em>. Esta exactamente misma levadura ha sido alimentada y dividida diariamente por cuatro generaciones. No es levadura comercial; es una entidad que respira y vive bajo nuestro techo.</p>
          </div>

          <div className="history-node" data-target="img-1960">
            <span className="history-year mobile-reveal">1960</span>
            <h2 className="mobile-reveal">La Expansión a Colombia</h2>
            <div className="mobile-img-container mobile-reveal">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" alt="1960" />
            </div>
            <p className="mobile-reveal">Nuestra familia cruza el Atlántico trayendo consigo no solo recetas, sino un jarrón de terracota protegido térmicamente donde viajaba la masa madre. Abrimos nuestro primer horno de leña en Cúcuta, fusionando la técnica italiana con la leña de roble local.</p>
          </div>

          <div className="history-node" data-target="img-2003">
            <span className="history-year mobile-reveal">2003</span>
            <h2 className="mobile-reveal">La Evolución Táctica</h2>
            <div className="mobile-img-container mobile-reveal">
              <img src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800&auto=format&fit=crop" alt="2003" />
            </div>
            <p className="mobile-reveal">Construimos desde cero 'Il Mostro', nuestro majestuoso Horno Pavesi con piedra refractaria del Vesubio. Importar los materiales duró 6 meses, y su primer encendido fue curado con una mezcla de maderas frutales para templar la cúpula interior.</p>
          </div>

          <div className="history-node" data-target="img-hoy">
            <span className="history-year mobile-reveal">Hoy</span>
            <h2 className="mobile-reveal">La Auténtica Rústica</h2>
            <div className="mobile-img-container mobile-reveal">
              <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=800&auto=format&fit=crop" alt="Hoy" />
            </div>
            <p className="mobile-reveal">Crecimos, pero nuestro manifiesto sigue intacto: Sin cortadores mecánicos, sin harinas procesadas industrialmente. Cada pizza que sale de nuestra cocina es un testimonio de resistencia culinaria frente a la era del congelado.</p>
          </div>
        </div>
      </section>

      {/* Filosofía Banner */}
      <div className="philosophy-banner reveal">
        <div className="philosophy-overlay">
          <svg className="philosophy-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F77F00" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <h2 className="philosophy-quote">"En Italia, la comida no es una necesidad, es teatro, poesía y religión combinadas."</h2>
          <Link href="/menu" className="btn-nav-reserva philosophy-btn">Conoce Nuestro Arte</Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
