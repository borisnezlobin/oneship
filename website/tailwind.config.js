/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "0": '0rem',
      },
      colors: {
        "theme": "#1c8000"
      },
    }
  },
  plugins: [],
}