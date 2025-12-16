/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bgmain: "#FFF2E6",   // soft warm cream (background)
        card:   "#FFE0CC",   // slightly deeper card
        accent: "#FF7F50",   // bright orange CTA
        textmain: "#111827", // main dark text
        textmuted: "#4B5563" // secondary text
      },
    },
  },
  plugins: [],
};
