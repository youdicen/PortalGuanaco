/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: '#2E4036',
        clay: '#CC5833',
        cream: '#F2F0E9',
        carbon: '#1A1A1A',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '2rem',
        '3xl': '3rem',
      }
    },
  },
  plugins: [],
}
