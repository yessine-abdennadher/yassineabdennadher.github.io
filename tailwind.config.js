// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: { 'gray-950': '#111111' },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      animation: {
        blob: 'blob 8s infinite',
      },
      transitionDelay: { // Tailwind native
        2000: '2000ms',
        4000: '4000ms',
      },
    },
  },
  plugins: [],
}
