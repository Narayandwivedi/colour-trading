/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        flicker: {
          '0%': { opacity: 0.8, height: '8px' },
          '100%': { opacity: 0.2, height: '12px' }
        },
        'wire-pulse': {
          '0%, 100%': { 'clip-path': 'polygon(0 0, 0% 0, 0% 100%, 0 100%)' },
          '50%': { 'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
        'bomb-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        }
      },
      animation: {
        flicker: 'flicker 0.5s infinite alternate',
        'wire-pulse': 'wire-pulse 1.5s ease-in-out infinite',
        'bomb-pulse': 'bomb-pulse 2s ease-in-out infinite',
      },
      boxShadow: {
        'bomb': 'inset 5px 5px 15px rgba(0,0,0,0.5), 2px 2px 8px rgba(0,0,0,0.8)',
        'bomb-glow': '0 0 10px 2px rgba(255,100,0,0.5)'
      },
      
    },
  },
  plugins: [],
}