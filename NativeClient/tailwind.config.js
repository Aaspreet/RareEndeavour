/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(31, 28, 31)",
        secondary: "rgb(23, 19, 23)",
        mainRed: "rgb(255, 10, 10)",
        mainGreen: "rgb(0, 255, 0)",
        mainText: "rgb(255, 255, 255)",
        secondaryText: "rgb(240, 240, 240)",
        thirdText: "rgb(240, 240, 240)",
        mainWhite: "rgb(255, 255, 255)",
        mainBlack: "rgb(0, 0, 0)",
      },
    },
  },
  plugins: [],
};
