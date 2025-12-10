/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bgmain: "#FFFFFF",
        card: "#F4F4F4",
        accent: "#0D1821",
        textmain: "#0D1821",
        textmuted: "#0D1821",
      },
      borderRadius: {
        xl: "0.9rem",
      },
    },
    },
  plugins: [],
};