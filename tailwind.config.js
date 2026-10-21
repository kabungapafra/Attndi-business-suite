export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          orange: '#f97316',
          bg: '#f4f5f7',
          cardBg: '#0b1329',
          accent: '#1e293b',
          sidebar: '#0b1329',
          sidebarHover: '#16203a',
          sidebarActive: '#1c2848',
        },
      },
    },
  },
  plugins: [],
};
