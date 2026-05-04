"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalNav({ activeLink = '' }) {
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.global-nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.background = 'var(--color-secundario)';
          nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
          nav.style.background = 'rgba(0, 48, 73, 0.95)'; // Keep initial transparency if needed or use variable
          nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.2)';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Global Drawer Logic
    const openBtn = document.getElementById('open-drawer-btn');
    const mobileOpenBtn = document.getElementById('mobile-open-drawer');
    const closeBtn = document.getElementById('close-drawer-btn');
    const overlay = document.getElementById('drawer-overlay');
    const drawer = document.getElementById('mega-drawer');

    function openDrawer(e) {
      if (e) e.preventDefault();
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      // If we are on menu page, app.js might have this function
      if (window.actualizarUiMegaDrawer) window.actualizarUiMegaDrawer();
      else if (window.actualizarUiCarrito) window.actualizarUiCarrito();
    }
    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      document.body.style.overflow = 'auto';
    }

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Ensure SmartMenu is initialized for global elements
    if (window.initSmartMenu) window.initSmartMenu();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (openBtn) openBtn.removeEventListener('click', openDrawer);
      if (mobileOpenBtn) mobileOpenBtn.removeEventListener('click', openDrawer);
      if (closeBtn) closeBtn.removeEventListener('click', closeDrawer);
      if (overlay) overlay.removeEventListener('click', closeDrawer);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio', key: 'inicio' },
    { href: '/menu', label: 'Menú', key: 'menu' },
    { href: '/nosotros', label: 'Nuestra Historia', key: 'nosotros' },
    { href: '/contacto', label: 'Contacto', key: 'contacto' },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <nav className="global-nav">
        <div className="global-nav-container">
          <Link href="/" className="global-nav-logo">
            <img src="/img/logo.png" alt="Logo" />
            LA NONNA RÚSTICA
          </Link>

          <div className="global-nav-links">
            {navLinks.map(({ href, label, key }) => (
              <Link
                key={key}
                href={href}
                className={activeLink === key ? 'active' : ''}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="global-nav-actions">
            <div id="open-drawer-btn" className="nav-cart-wrapper" style={{ cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <div id="global-cart-badge" className="nav-cart-badge">0</div>
            </div>
            <Link href="/reservas" className="btn-nav-reserva">Reservar Mesa</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className={`bottom-nav-item${activeLink === 'inicio' ? ' active' : ''}`}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Inicio
        </Link>
        <Link href="/menu" className={`bottom-nav-item${activeLink === 'menu' ? ' active' : ''}`}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          Menú
        </Link>
        
        {/* Normal Cart Button */}
        <div id="mobile-open-drawer" className="bottom-nav-item" style={{ cursor: 'pointer' }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <div id="mobile-cart-badge" className="nav-cart-badge" style={{ position: 'absolute', top: '-5px', right: '-8px' }}>0</div>
          </div>
          Carrito
        </div>

        <Link href="/nosotros" className={`bottom-nav-item${activeLink === 'nosotros' ? ' active' : ''}`}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Nosotros
        </Link>
      </nav>
    </>
  );
}
