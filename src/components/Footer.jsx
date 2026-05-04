export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-between text-left gap-8">
        {/* Brand */}
        <div className="flex-1 min-w-[300px]">
          <img src="/img/logo.png" alt="Logo" className="footer-logo-img ml-0" />
          <p
            className="footer-slogan mb-4"
            style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '1.8rem' }}
          >
            La verdadera esencia de la cocina rústica en tu mesa.
          </p>
        </div>

        {/* Contacto */}
        <div className="flex-1 min-w-[250px]">
          <h3
            className="mb-6"
            style={{ color: 'var(--color-dorado)', fontFamily: 'var(--fuente-titulos)' }}
          >
            Contacto Directo
          </h3>
          <p className="mb-2 text-lg">📍 Av. 0 #12-55, Barrio Caobos, Cúcuta</p>
          <p className="mb-2 text-lg">📞 Reservas: +57 311 251 8913</p>
          <p className="mb-2 text-lg">✉️ gerencia@lanonnarustica.com</p>
        </div>

        {/* Horario */}
        <div className="flex-1 min-w-[250px]">
          <h3
            className="mb-6"
            style={{ color: 'var(--color-dorado)', fontFamily: 'var(--fuente-titulos)' }}
          >
            Horario de Fuego
          </h3>
          <p className="mb-2 text-lg">
            Lunes: <span className="opacity-60">Cerrado por fermentación</span>
          </p>
          <p className="mb-2 text-lg">
            Martes a Sábado: <span className="font-bold">11:00am - 10:30pm</span>
          </p>
          <p className="mb-2 text-lg">
            Domingos: <span className="font-bold">12:00pm - 09:00pm</span>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-16 border-t border-white/10 pt-8 text-white/40 text-center">
        <p>
          &copy; 2026 LA NONNA RÚSTICA ITALIANA.<br />
          Arquitectura Digital Premium por Samuel Andres Portilla Ardila.
        </p>
      </div>
    </footer>
  );
}
