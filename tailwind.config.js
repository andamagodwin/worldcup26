/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Pitch-at-night palette
        ink: '#0A0E17', // app background
        surface: '#121826', // cards
        surface2: '#1B2334', // raised / rows
        line: '#26304A', // hairline borders
        muted: '#8A95AD', // secondary text
        faint: '#5A627A', // tertiary text
        brand: '#FF7A1A', // vivid orange accent
        gold: '#F5C242', // trophy gold
        live: '#FF3B5C', // live red
      },
    },
  },
  plugins: [],
};
