/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue, js, jsx, ts, tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  plugins: [
    require('flowbite'),
    require("@tailwindcss/typography"),
    require('daisyui')
  ],
  daisyui: {
    themes: ["dark"],
  },
};