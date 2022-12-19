module.exports = {
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Ubuntu", "sans-serif"],
      mono: ["Ubuntu Mono", "monospace"],
    },
    screens: {
      sm: "641px",
      md: "769px",
      lg: "1025px",
      xl: "1281px",
      "2xl": "1537px",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
