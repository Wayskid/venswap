/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        White: "#FFFFFF",
        Black: "#000000",
        Grey: "#7D7D7D",
        Orange: "#F99F1C",
        Blue: "#534cab",
        Brown: "#494455",
        Light_Violet: "#DEBEFF",
        Green: "#45BEA4",
      },
      screens: {
        custom_screen: "858px",
      },
    },
  },
  plugins: [],
};
