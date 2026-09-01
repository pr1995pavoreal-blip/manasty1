/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        darkbg: '#0f172a',
        cardbg: '#1e293b',
      },
      fontFamily: {
        sans: ['Cairo', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(234, 179, 8, 0.3)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
