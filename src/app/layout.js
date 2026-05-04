import Script from 'next/script';
import "./globals.css";
import "../styles/global.css";
import "../styles/nav.css";
import "../styles/fx-effects.css";

export const metadata = {
  title: "La Nonna Rústica - El Verdadero Sabor Italiano",
  description: "La verdadera esencia de la cocina rústica en tu mesa.",
  icons: {
    icon: '/img/logo.png',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  }
};

export const viewport = {
  themeColor: "#c1121f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;800&family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body suppressHydrationWarning>
        {children}

        {/* Global UI Components */}
        <div className="mega-drawer-overlay" id="drawer-overlay"></div>
        <div className="mega-drawer" id="mega-drawer">
          <div className="drawer-header">
            <h2>Tu Selección <span id="drawer-count">(0)</span></h2>
            <button className="close-drawer" id="close-drawer-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="drawer-main-content">
            <div className="drawer-items-list" id="drawer-cart-items"></div>
            <div className="cross-sell-zone" id="cross-sell-zone" style={{ display: 'none' }}></div>
          </div>
          <div className="drawer-footer">
            <div className="drawer-total-row">
              <span>Subtotal</span>
              <span id="drawer-total" className="drawer-price">$0</span>
            </div>
            <button id="drawer-btn-ordenar" className="drawer-checkout-btn">Ordenar a Mesa / Llevar</button>
          </div>
        </div>

        <div id="modal-producto" className="modal">
          <div className="modal-content premium-modal">
            <div className="modal-body" id="modal-body"></div>
          </div>
        </div>
        
        <div id="modal-orden" className="modal">
          <div className="modal-content form-orden-layout">
            <span className="cerrar-modal" id="cerrar-orden">&times;</span>
            <h2>Completa tu Pedido</h2>
            <form id="form-pedido">
              <input type="text" id="nombre-cliente" placeholder="Tu Nombre Completo" required />
              <input type="text" id="direccion-cliente" placeholder="Dirección de Entrega o 'Mesa #'" />
              <textarea id="notas-pedido" placeholder="Instrucciones especiales para el chef..."></textarea>
              <button type="submit" className="btn-block">Enviar a Cocina vía WhatsApp</button>
            </form>
          </div>
        </div>
        
        {/* Mobile Categories Bottom Sheet */}
        <div id="mini-menu-categorias" className="mini-menu-cats"></div>

        {/* Core Scripts */}
        <Script src="/data/menu.js?v=2.1" strategy="beforeInteractive" />
        
        {/* FX System */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" strategy="afterInteractive" />
        <Script src="/js/fx-particles.js" strategy="afterInteractive" />
        <Script src="/js/fx-scramble.js" strategy="afterInteractive" />
        <Script src="/js/fx-tilt.js" strategy="afterInteractive" />
        <Script src="/js/fx-transitions.js" strategy="afterInteractive" />
        
        {/* Main App */}
        <Script src="/js/app.js?v=2.1" strategy="afterInteractive" />
      </body>
    </html>
  );
}
