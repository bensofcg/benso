/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002c6a',
        secondary: '#00419d',
        accent: '#0056d0',
        dark: '#001737',
        light: '#e6e6e6',
      },
      fontFamily: {
        sans: ["'TT Commons Pro'", 'system-ui', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
      boxShadow: {
        'benso': '0 4px 20px rgba(0, 44, 106, 0.15)',
        'benso-hover': '0 8px 30px rgba(0, 44, 106, 0.25)',
      },
      borderRadius: {
        'benso': '16px',
      },
    },
  },
  plugins: [],
}
