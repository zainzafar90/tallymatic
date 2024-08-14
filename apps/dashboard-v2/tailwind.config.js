/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter, sans-serif', { fontFeatureSettings: '"cv11"' }],
      },
    },
  },
  plugins: [],
};
