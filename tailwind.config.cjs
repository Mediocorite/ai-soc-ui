module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "ey-blue": "#00338D",
        "ey-yellow": "#FFE600",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
