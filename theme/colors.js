// Single source of truth for the app's color tokens.
// Consumed by both Tailwind (tailwind.config.js `require`s this) and by
// React Native style props / icon colors (via the typed import in colors.d.ts).
const COLORS = {
  ink: '#0A0E17', // app background
  surface: '#121826', // cards
  surface2: '#1B2334', // raised / rows
  line: '#26304A', // hairline borders / dividers
  muted: '#8A95AD', // secondary text
  faint: '#5A627A', // tertiary text
  brand: '#FF7A1A', // vivid orange accent
  gold: '#F5C242', // trophy gold
  live: '#FF3B5C', // live red
  white: '#FFFFFF',
};

module.exports = { COLORS };
