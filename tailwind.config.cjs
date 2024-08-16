/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },
      minHeight: {
        screen: "100dvh",
      },
      minWidth: {
        screen: "100dvw",
      },
      colors: {
        main: "#002F42",
        red: "#EB6244",
        gray: "#E9F0FB",
        darkGray: "#9CADCE",
        activeLink: "#2DC2D6",
      },
      gridTemplateColumns: {
        opportunities: "repeat(auto-fill, minmax(30rem, 1fr))",
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-in-out",
        popIn: "popIn 0.25s ease-in-out forwards",
        popOff: "popOff 0.25s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scaleY(0)" },
          "100%": { opacity: 1, transform: "scaleY(1)" },
        },
        popIn: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        popOff: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0)", opacity: 0 },
        },
      },
      boxShadow: {
        xl: "0px 0px 25px 0px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
