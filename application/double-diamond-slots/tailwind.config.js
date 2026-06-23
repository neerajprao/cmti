/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        casino: {
          black: '#0a0a0a',
          charcoal: '#141414',
          chrome: '#c8ccd4',
          chromeDark: '#5a5e66',
          crimson: '#ff1744',
          gold: '#ffc94d',
          neonBlue: '#00e5ff',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        lcd: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        ui: ['"Oswald"', 'sans-serif'],
      },
      boxShadow: {
        'inset-deep': 'inset 0 6px 18px rgba(0,0,0,0.85), inset 0 -4px 10px rgba(0,0,0,0.6)',
        'chrome-edge': '0 0 0 2px rgba(255,255,255,0.15), 0 8px 30px rgba(0,0,0,0.7)',
        'glow-gold': '0 0 20px rgba(255,201,77,0.6), 0 0 60px rgba(255,201,77,0.25)',
        'glow-crimson': '0 0 20px rgba(255,23,68,0.7), 0 0 50px rgba(255,23,68,0.3)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        flicker: 'flicker 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
