/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Blocmate / CORE100 brand identity
        brand: {
          DEFAULT: '#dc3947',
          50: '#fdf2f3',
          100: '#fbe1e3',
          200: '#f7c7cc',
          300: '#f0a0a8',
          400: '#e66b78',
          500: '#dc3947',
          600: '#c62a38',
          700: '#a61f2c',
          800: '#891d28',
          900: '#751d27',
        },
        canvas: '#f7f7f5',
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        'card-lg': '0 10px 30px -12px rgba(0,0,0,0.18)',
        brand: '0 12px 30px -10px rgba(220,57,71,0.55)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
