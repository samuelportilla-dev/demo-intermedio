/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores del restaurante — mapeados como tokens Tailwind
        'nonna-red':    '#c1121f',
        'nonna-navy':   '#003049',
        'nonna-gold':   '#F77F00',
        'nonna-bg':     '#fdf8f5',
        'nonna-surface':'#ffffff',
        'nonna-text':   '#1a1a1a',
        'nonna-muted':  '#5c5c5c',
      },
      fontFamily: {
        outfit:  ['Outfit', 'sans-serif'],
        cinzel:  ['Cinzel', 'serif'],
        playfair:['Playfair Display', 'serif'],
      },
      borderRadius: {
        'pill': '100px',
        'card': '12px',
      },
      boxShadow: {
        'soft':    '0 4px 20px rgba(0, 0, 0, 0.04)',
        'strong':  '0 15px 35px rgba(0, 0, 0, 0.1)',
        'float':   '0 10px 30px rgba(0, 48, 73, 0.15)',
      },
    },
  },
  corePlugins: {
    // Desactivamos preflight para no romper los CSS legacy que ya funcionan
    preflight: false,
  },
  plugins: [],
};
