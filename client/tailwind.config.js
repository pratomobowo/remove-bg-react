/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'doc-red': '#DB1514',
        'doc-blue': '#0000FF',
      },
    },
  },
  plugins: [],
}
