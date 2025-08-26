/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using direct hex colors in components rather than these named values
        primary: {
          DEFAULT: '#dc6b01',
          light: '#ee8422',
          dark: '#b55a01'
        },
        secondary: {
          DEFAULT: '#2b2a2a',
          light: '#3c3b3b',
          dark: '#1a1919'
        }
      }
    },
  },
  plugins: [],
}