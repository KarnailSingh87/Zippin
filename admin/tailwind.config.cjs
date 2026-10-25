/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          green: '#0C831F',
          'green-dark': '#0a6e1a',
          'green-light': '#e8f5e9',
          yellow: '#F8CB46',
          sidebar: '#1a1a2e',
          'sidebar-hover': '#252547',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
