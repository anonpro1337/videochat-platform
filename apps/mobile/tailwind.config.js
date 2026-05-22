/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a0f",
          card: "#14141f",
          border: "#1e1e2e",
          hover: "#252535",
        },
        primary: {
          DEFAULT: "#6c5ce7",
          light: "#a29bfe",
          dark: "#5541e0",
        },
        accent: {
          pink: "#fd79a8",
          green: "#00b894",
          amber: "#fdcb6e",
          cyan: "#00cec9",
        },
        text: {
          primary: "#ffffff",
          secondary: "#8888a0",
          muted: "#555570",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.08)",
          heavy: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
