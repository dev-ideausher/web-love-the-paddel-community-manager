/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['"Helvetica Neue"', "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        primary: "#252B37",
        buttontext: "#415B2E",
        primary1: "#D43A48",
        primary2: "#3662D4",
        primary3: "#FF930F",
        secondary: "#F5F5F5",
        neutral: "#FBE8EA",
        neutral2: "#2D2D2D",
        black4: "#0A0D12",
        neutral1: "#5B5C5A",
        "neutral-900": "",
        "neutral-1000": "",
        "neutral-100": "",
        "neutral-101": "",
        "neutral-5": "",
        white: "#FFF",
        ternary: "#F5B400",
        success: "#118B0E",
        danger: "#FF2E39",
        black: "#000",
        "black-1": "#141414",
        "black-2": "#424244",
        "black-3": "#0E0F0C",
        "black-4": "#0E2225",
        "grey-1": "#686A6D",
        "grey-2": "#8A8A8A",
        "grey-3": "#F4F4F4",
        "grey-4": "#686A6D",
        "grey-5": "#828282",
        "grey-6": "#F5F7F5",
        "grey-7": "#97989A",
        main: "#F7F8F8",
        "light-blue": "#4C5F7D",
        "red-1": "#FBE8EA",
        orange: "#FF930F",
        blue: "#141857",
      },

      screens: {
        xl: "1300px",
        xxl: "1560px",
        "3xl": "1900px",
      },
      borderWidth: {
        0.5: "0.5px",
        1.5: "1.5px",
      },
      gridTemplateColumns: {},
    },
  },
  plugins: [],
};
