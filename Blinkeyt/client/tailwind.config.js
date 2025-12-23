/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",   // src folder
    "./views/**/*.{html,ejs}",          // if you use views
    "./components/**/*.{js,jsx,ts,tsx}" // if you keep comps outside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
