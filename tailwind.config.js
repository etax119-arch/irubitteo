/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'landing-orange': '#DF8F4B',
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
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // 히어로: 아래에서 천천히 떠오르며 나타나기
        'hero-rise': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // 히어로 강조 문구: 위로 올라가며 사라지고 아래로 내려오며 나타나기를 반복.
        // 첫 등장은 헤드라인과 함께 떠올라야 하므로 "보이는 상태"에서 사이클을 시작한다.
        'hero-char': {
          '0%, 55%': { opacity: '1', transform: 'translateY(0)' },
          '72.5%, 92.5%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        marquee: 'marquee 40s linear infinite',
        'hero-rise': 'hero-rise 1.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-char': 'hero-char 4s ease infinite',
      }
    },
  },
  plugins: [],
}
