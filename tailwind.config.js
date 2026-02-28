/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#FF5A5F',
        secondary: '#facc15'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        fadeOutMsg: {
          '0%': { opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'shake': 'shake 0.35s cubic-bezier(.36,.07,.19,.97) both',
        'fade-out-msg': 'fadeOutMsg 2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}

