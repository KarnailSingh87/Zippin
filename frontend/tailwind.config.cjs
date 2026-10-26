/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        zippin: {
          green: '#0C831F',
          'green-dark': '#0a6e1a',
          'green-light': '#e8f5e9',
          yellow: '#F8CB46',
          'yellow-light': '#FFF8E1',
          orange: '#FF6B2C',
          bg: '#F7F7F7',
          card: '#FFFFFF',
          text: '#1F1F1F',
          'text-light': '#666666',
          'text-lighter': '#999999',
          border: '#e8e8e8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        'drawer': '-4px 0 20px rgba(0,0,0,0.15)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'pulse-green': 'pulseGreen 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(12, 131, 31, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(12, 131, 31, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
