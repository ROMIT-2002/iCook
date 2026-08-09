/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#11100E',
        espresso: '#211A16',
        oxblood: '#401D20',
        agedIvory: '#F3EBDD',
        warmParchment: '#E5D8C5',
        antiqueBrass: '#AA8654',
        softChampagne: '#C7AA7A',
        mutedStone: '#A79C8C',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Bodoni Moda', 'Georgia', 'serif'],
        'serif-accent': ['Bodoni Moda', 'Cormorant Garamond', 'serif'],
        sans: ['Inter', 'Manrope', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
