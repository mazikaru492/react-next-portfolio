/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-16.666667%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-16.666667%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 16s linear infinite",
        "marquee-reverse": "marquee-reverse 16s linear infinite",
      },
    },
  },
  plugins: [],
};
