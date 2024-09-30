/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,css}"],
  theme: {
    colors: {
      primary: "#181c26",
      secondary: "#1c1b25",
    },
    screens: {
      xs: "375px",
      sm: "768px",
      md: "940px",
      lg: "1200px",
      xl: "1600px",
    },
    extend: {
      colors: {
        "font-primary": "#ffffff",
        "ms-period-bg": "#181c26",
        "ms-status-bg": "#233337",
        "ms-title-font": "#696d7a",
        "ms-status-font": "#5e6b6e",
        "ms-status-border": "#355353",
        "dr-border": "#2a3c45",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(to right bottom, #111017, #131219, #15141c, #16161e, #181821, #191922, #191924, #1a1a25, #191b25, #191b26, #181c26, #181c26)",
      },
    },
  },
  plugins: [],
};
