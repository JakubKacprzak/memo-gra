/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./public/js/**/*.js", "./public/css/*.css"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Poppins", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
