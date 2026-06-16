const { COLORS } = require('./theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './features/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        // Poppins per-weight faces. `font-sans` is the regular default; the
        // others map the old tailwind weight classes to true Poppins faces.
        sans: ['Poppins_400Regular'],
        'p-medium': ['Poppins_500Medium'],
        'p-semibold': ['Poppins_600SemiBold'],
        'p-bold': ['Poppins_700Bold'],
        'p-extrabold': ['Poppins_800ExtraBold'],
      },
      colors: COLORS,
    },
  },
  plugins: [],
};
