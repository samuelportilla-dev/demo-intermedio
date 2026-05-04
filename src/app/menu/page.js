"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Preloader from '@/components/Preloader';
import GlobalNav from '@/components/GlobalNav';
import Footer from '@/components/Footer';
import '../../styles/home.css';
import '../../styles/menu.css';
import '../../styles/menu-premium.css';

export default function MenuPage() {
  useEffect(() => {
    // Navbar scroll
    const handleScroll = () => {
      const nav = document.querySelector('.global-nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.background = 'rgba(0, 48, 73, 0.98)';
          nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
          nav.style.background = 'rgba(0, 48, 73, 0.95)';
          nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.2)';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);


    // Initializing SmartMenu
    if (typeof window !== 'undefined') {
      if (window.initSmartMenu) {
        window.initSmartMenu();
      } else {
        // Fallback if script is not yet loaded
        const checkInit = setInterval(() => {
          if (window.initSmartMenu) {
            window.initSmartMenu();
            clearInterval(checkInit);
          }
        }, 100);
        setTimeout(() => clearInterval(checkInit), 5000);
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Preloader />
      <div className="ambient-background"></div>
      <GlobalNav activeLink="menu" />

      {/* Cinematic Carousel Header */}
      <header className="cinematic-carousel-header" id="ui-hero-carousel">
        {/* Los slides se cargarán dinámicamente desde app.js */}
      </header>

      {/* Premium Menu Container */}
      <div className="premium-menu-container">
        {/* ScrollSpy Sidebar */}
        <aside className="menu-sidebar">
          <div className="sidebar-sticky">
            <h3 className="sidebar-title">Nuestro Menú</h3>
            <nav className="scrollspy-nav" id="ui-nav-categorias"></nav>
          </div>
        </aside>

        {/* Menu Content */}
        <main className="menu-products-area">
          {/* Sticky Search Bar */}
          <div className="search-sticky-container">
            <div className="search-box-wrapper">
              <div className="search-input-group">
                <span className="search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="text"
                  id="menu-search-input"
                  placeholder="Buscar mi pizza, entrada o bebida..."
                  onKeyUp={(e) => { if (window.ejecutarBusqueda) window.ejecutarBusqueda(e.target.value); }}
                />
                <button
                  className="btn-search-cat"
                  id="cat-filter-btn"
                  onClick={(e) => { if (window.toggleMiniMenuCategorias) window.toggleMiniMenuCategorias(e); }}
                  title="Filtrar por categoría"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu container — populated by app.js */}
          <div id="menu-container"></div>
        </main>
      </div>

      <Footer />
    </>
  );
}
