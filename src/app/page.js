"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Preloader from '@/components/Preloader';
import GlobalNav from '@/components/GlobalNav';
import Footer from '@/components/Footer';
import '../styles/home.css';
import '../styles/menu.css';
import '../styles/home-premium.css';

export default function Home() {
  useEffect(() => {
    // Intersection Observer for Brutal animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe reveals
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Global UI Init
    if (window.initSmartMenu) window.initSmartMenu();

    // Clip-path extreme reveal trick
    const clipObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.4 });
    
    const clipContainer = document.getElementById('clipSection');
    if(clipContainer) clipObserver.observe(clipContainer);

    return () => {
      observer.disconnect();
      clipObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Preloader />
      <GlobalNav />

      {/* Hero Section Brutal */}
      <header className="hero-10k">
        <div className="hero-10k-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1920&auto=format&fit=crop')" }}></div>
        <div className="hero-10k-content reveal">
          <h1>L'Arte della Pizza</h1>
          <p className="hero-desc">Fermentación lenta de 72 horas. Ingredientes importados de Nápoles. Una experiencia magistral en cada bocado.</p>
          <div className="hero-actions">
            <Link href="/menu" className="hero-cta">Explorar Menú</Link>
            <Link href="/reservas" className="hero-cta btn-reservar-hero">Reservar</Link>
          </div>
        </div>
      </header>

      {/* Marquee Infinito de Alto Impacto */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="filled">Masa Madre Viva</span> <span>•</span> <span>Horno a 450°C</span> <span>•</span> <span className="filled">Auténtica Napolitana</span> <span>•</span> <span>Tomate San Marzano</span> <span>•</span>
          <span className="filled">Masa Madre Viva</span> <span>•</span> <span>Horno a 450°C</span> <span>•</span> <span className="filled">Auténtica Napolitana</span> <span>•</span> <span>Tomate San Marzano</span> <span>•</span>
        </div>
      </div>

      {/* Overlapping Structure 1 */}
      <section className="overlap-section reveal" style={{ marginTop: '5rem' }}>
        <div className="overlap-img">
          <img src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1000&auto=format&fit=crop" alt="Horno de leña rústico napolitano" />
        </div>
        <div className="overlap-text">
          <span className="subtitle">La Tradición de Fuego</span>
          <h2>Nuestro Horno Pavesi</h2>
          <p>Traído directamente de las laderas del Vesubio, nuestro horno de piedra volcánica es el corazón palpitante de La Nonna. Alcanza temperaturas superiores a los 450°C, sellando los ingredientes en apenas 90 segundos para garantizar una costra perfectamente inflada y tostada ('cornicione'), mientras su centro permanece peligrosamente suave.</p>
          <p>No usamos gas. Utilizamos exclusivamente leña de roble envejecida, la cual aporta notas sutilmente ahumadas imposibles de replicar con métodos modernos.</p>
          <Link href="/nosotros" style={{ color: 'var(--color-principal)', fontWeight: 800, textDecoration: 'none', fontSize: '1.1rem', borderBottom: '2px solid' }}>Descubre nuestra historia &rarr;</Link>
        </div>
      </section>

      {/* STICKY SCROLL: La Perfección Italiana */}
      <section className="sticky-super-container">
        <div className="sticky-left">
          <span className="big-number">01</span>
          <span className="subtitle" style={{ fontWeight: 700, color: 'var(--color-principal)', textTransform: 'uppercase', letterSpacing: '2px' }}>Nuestros Pilares</span>
          <h2 className="reveal">El Arte en su <br />Estado Más Crudo</h2>
          <p className="reveal" style={{ fontSize: '1.2rem', color: 'var(--color-texto-claro)', lineHeight: 1.8, marginBottom: '2rem' }}>No fabricamos comida rápida. Cuidamos cada disco de masa como una obra individual. Observa el desarrollo de nuestros clásicos más aclamados a la derecha, esculpidos a fuego vivo.</p>
          <Link href="/menu" className="btn-nav-reserva reveal" style={{ display: 'inline-block' }}>Ver menú completo</Link>
        </div>
        <div className="sticky-right">
          <div className="sticky-card reveal">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop" alt="Margherita" />
            <h3>La Margherita Intacta</h3>
            <p>Nuestra obra insignia. Queso Fior di latte de la Campania derretido bajo el fuego abrazador, tocado con albahaca fresca del día.</p>
          </div>
          <div className="sticky-card reveal">
            <img src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop" alt="Prosciutto" />
            <h3>Prosciutto y Rúcula</h3>
            <p>Laminado de prosciutto di Parma D.O.P. traído desde Italia, posado sobre rúcula salvaje recién cosechada. Perfecto contraste salado y amargo.</p>
          </div>
          <div className="sticky-card reveal">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" alt="Trufa" />
            <h3>Trufa Blanca y Setas</h3>
            <p>Una experiencia de lujo puro. Aceite de trufa blanca importado sobre una selección de setas silvestres y queso ricotta suave.</p>
          </div>
        </div>
      </section>

      {/* CLIP PATH REVEAL: Impresión Visual */}
      <section className="clip-reveal-container reveal" id="clipSection">
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920&auto=format&fit=crop" alt="Restaurante oscuro" className="clip-reveal-bg" />
        <div className="clip-content">
          <h2>Siente el fuego</h2>
          <p style={{ fontSize: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>Ven a perderte en nuestro rincón de Nápoles.</p>
        </div>
      </section>

      {/* THEME ULTRA-PREMIUM: Filosofía Inquebrantable */}
      <section className="philosophy-ultra-premium">
        <div className="philosophy-header">
          <span className="subtitle">Sin atajos</span>
          <h2 className="philosophy-title reveal">Filosofía <br />Inquebrantable</h2>
        </div>
        
        <div className="philosophy-grid">
          {/* Card 1 */}
          <div className="philosophy-card reveal">
            <div className="philosophy-icon-wrapper">
              <img src="/img/philo_dop.png" alt="D.O.P." />
            </div>
            <h3>D.O.P. Garantizado</h3>
            <p>No usamos sustitutos. Si dice Queso Parmigiano-Reggiano, tiene su sello de origen intacto tallado en la rueda de maduración.</p>
          </div>

          {/* Card 2 */}
          <div className="philosophy-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="philosophy-icon-wrapper">
              <img src="/img/philo_paciencia.png" alt="Paciencia" />
            </div>
            <h3>Paciencia Culinaria</h3>
            <p>La levadura industrial te hincha y duele. Nuestra técnica a base de tiempo predigiere los azúcares y te entrega una nube crujiente.</p>
          </div>

          {/* Card 3 */}
          <div className="philosophy-card reveal" style={{ transitionDelay: '0.4s' }}>
            <div className="philosophy-icon-wrapper">
              <img src="/img/philo_fuego.png" alt="Fuego" />
            </div>
            <h3>Fuego, el único juez</h3>
            <p>Un cocinero no es nadie ante el volcán. Nuestro Pavesi decide crujir las imperfecciones de la pizza en tan solo 90 vibrantes segundos.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
