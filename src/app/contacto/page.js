"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import GlobalNav from '@/components/GlobalNav';
import Preloader from '@/components/Preloader';
import Footer from '@/components/Footer';
import '../../styles/contacto-premium.css';

export default function ContactoPage() {
  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const isMobile = window.innerWidth <= 1024;

      if (!isMobile) {
        const tl = gsap.timeline();
        tl.from('.animate-up', { 
          y: 60, 
          opacity: 0, 
          duration: 1.2, 
          stagger: 0.2, 
          ease: 'power4.out',
          force3D: true,
          clearProps: 'opacity' 
        });
        tl.from('.animate-right', { 
          x: 100, 
          opacity: 0, 
          duration: 1.4, 
          ease: 'power4.out',
          force3D: true,
          clearProps: 'opacity' 
        }, '-=0.9');
      } else {
        gsap.from('.premium-heading', { 
          y: 40, 
          opacity: 0, 
          duration: 0.9, 
          delay: 0.2, 
          ease: 'power3.out',
          force3D: true,
          clearProps: 'all' 
        });
        gsap.from('.premium-lead', { 
          y: 40, 
          opacity: 0, 
          duration: 0.9, 
          delay: 0.4, 
          ease: 'power3.out',
          force3D: true,
          clearProps: 'all' 
        });
        gsap.from('.info-card', { 
          scrollTrigger: { 
            trigger: '.contact-info-grid', 
            start: 'top 92%' 
          }, 
          y: 40, 
          opacity: 0, 
          duration: 0.8, 
          stagger: 0.18, 
          ease: 'power2.out', 
          force3D: true,
          clearProps: 'all' 
        });
        gsap.from('.glass-form-container', { 
          scrollTrigger: { 
            trigger: '.contact-form-side', 
            start: 'top 88%' 
          }, 
          y: 40, 
          opacity: 0, 
          duration: 1.2, 
          ease: 'power3.out', 
          force3D: true,
          clearProps: 'all' 
        });
      }

      gsap.from('.map-card', { 
        scrollTrigger: { 
          trigger: '.map-reveal-section', 
          start: 'top 85%' 
        }, 
        y: isMobile ? 40 : 100, 
        opacity: 0, 
        duration: 1.5, 
        ease: 'power4.out', 
        force3D: true,
        clearProps: 'all' 
      });
    };
    loadGSAP();
  }, []);

  function enviarContacto(e) {
    e.preventDefault();
    const nombre = document.getElementById('conNombre').value;
    const mensaje = document.getElementById('conMensaje').value;
    const email = document.getElementById('conEmail').value;
    let texto = `Hola La Nonna! 👋 Vengo desde su página web de Contacto:\n\n*Nombre:* ${nombre}\n`;
    if (email) texto += `*Email:* ${email}\n`;
    texto += `*Mensaje:* ${mensaje}\n\n_Enviado desde el portal premium._`;
    const num = (window.RESTAURANT_CONFIG?.telefonoWP) ?? '573112518913';
    window.open(`https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(texto)}`, '_blank');
  }

  return (
    <>
      <Preloader />
      <div className="ambient-glow"></div>
      <GlobalNav activeLink="contacto" />

      <main className="contact-hero">
        <section className="contact-split">
          <div className="contact-data-side">
            <div className="brand-badge animate-up">Design &amp; Tradition</div>
            <h1 className="premium-heading animate-up">Entremos en <span className="text-gradient">Contacto</span></h1>
            <p className="premium-lead animate-up">Cada reserva, consulta o saludo es el inicio de una nueva historia en nuestra mesa. Estamos aquí para escucharte.</p>

            <div className="contact-info-grid">
              {[
                { icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />, title: 'Visítanos', lines: ['Av. 0 #12-55, Barrio Caobos', 'Cúcuta, Colombia'], extra: <circle cx="12" cy="10" r="3" /> },
                { icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>, title: 'Email', lines: ['hola@lanonnarustica.com', 'info@premium.com'] },
                { icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />, title: 'Teléfono', lines: ['+57 (311) 251 8913', '+57 (607) 555 1234'] },
                { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, title: 'Horarios', lines: ['Mar - Dom: 11AM - 10PM', 'Lunes: Cerrado'] },
              ].map(({ icon, title, lines }) => (
                <div className="info-card animate-up" key={title}>
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">{icon}</svg>
                  </div>
                  <div className="info-text">
                    <h4>{title}</h4>
                    <p>{lines[0]}<br />{lines[1]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="social-connect animate-up">
              <span>Síguenos:</span>
              <div className="social-icons">
                <a href="#"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
                <a href="#"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                <a href="#"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></a>
              </div>
            </div>
          </div>

          <div className="contact-form-side">
            <div className="glass-form-container animate-right">
              <h3>Envíanos un Mensaje</h3>
              <p>Recibirás una respuesta inmediata vía WhatsApp.</p>
              <form id="contactFormPremium" onSubmit={enviarContacto}>
                <div className="input-group">
                  <label htmlFor="conNombre">Nombre Completo</label>
                  <input type="text" id="conNombre" placeholder="Ej. Juan Pérez" required />
                </div>
                <div className="input-group">
                  <label htmlFor="conEmail">Correo Electrónico (Opcional)</label>
                  <input type="email" id="conEmail" placeholder="juan@ejemplo.com" />
                </div>
                <div className="input-group">
                  <label htmlFor="conMensaje">Tu Mensaje</label>
                  <textarea id="conMensaje" rows="5" placeholder="¿En qué podemos ayudarte?" required></textarea>
                </div>
                <button type="submit" className="premium-whatsapp-btn">
                  <span className="btn-text">Enviar a WhatsApp</span>
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.411z" />
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="map-reveal-section">
          <div className="map-container">
            <div className="map-overlay">
              <div className="map-card animate-up">
                <h4>Estamos aquí</h4>
                <p>Visita nuestro rincón italiano en el corazón de Cúcuta.</p>
                <a href="https://www.google.com/maps/search/?api=1&query=Av.+0+%2312-55,+Barrio+Caobos,+C%C3%BAcuta" target="_blank" className="btn-line" rel="noreferrer">Cómo llegar</a>
              </div>
            </div>
            <iframe
              className="google-map-iframe"
              src="https://maps.google.com/maps?q=Av.%200%20%2312-55,%20Barrio%20Caobos,%20C%20%C3%BAcuta&t=&z=16&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              title="Mapa La Nonna Rústica"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
