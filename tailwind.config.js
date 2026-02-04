/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'duru-orange': {
          50: '#FFF9F5',
          100: '#FFF2E8',
          200: '#FFE0CC',
          300: '#FFCBA3',
          400: '#FFB075',
          500: '#FF954F',
          600: '#E67A2E',
          700: '#CC601A',
        },
        'duru-ivory': '#FDFBF7',
        'duru-text': {
          main: '#2C2C2C',
          sub: '#5D5D5D',
          light: '#888888',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
