/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        '104': '26rem',  // 130% del tamaño original (w-80)
      },
      height: {
        '124': '31rem',  // 130% del tamaño original (h-96)
      },
      colors: {
        primary: {
          DEFAULT: "#0000FF",
          50: "#FFF2E6",
          100: "#FFE0BF",
          200: "#FFCD99",
          300: "#FFB973",
          400: "#FFA64D",
          500: "#FF7A00",
          600: "#CC6200",
          700: "#994A00",
          800: "#663100",
          900: "#331900",
        },
      },
      keyframes: {
        ping: {
          "75%, 100%": {
            transform: "scale(1.5)",
            opacity: "0",
          },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: ".5",
            transform: "scale(0.8)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        ping: "ping 2s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        pulse: "pulse 1.5s ease-in-out infinite",
        slideIn: "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
