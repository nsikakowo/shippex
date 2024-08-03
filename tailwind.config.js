module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        brandGrey: '#4b5563',
        lightBlue: '#60A5FA',
        darkPrimary: '#1f2937',
        iconColor: '#6b7280',
        secondary: '#F8FAFC',
        borderColor: '#E5E7EB',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
