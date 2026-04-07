/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          750: "#2d3748",
        }
      },
      animation: {
        "bounce-delay-1": "bounce 1s infinite 0.15s",
        "bounce-delay-2": "bounce 1s infinite 0.3s",
      }
    },
  },
  plugins: [],
}