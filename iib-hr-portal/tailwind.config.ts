import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          50: "#E9EDF3",
          100: "#C6D0E0",
          200: "#9DAECB",
          300: "#738BB6",
          400: "#5170A4",
          500: "#2F5491",
          600: "#27477E",
          700: "#1D3764",
          800: "#142A4F",
          900: "#0B2545",
          950: "#061529",
        },
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#B45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(11 37 69 / 0.08), 0 1px 2px -1px rgb(11 37 69 / 0.08)",
        "card-hover": "0 8px 24px -6px rgb(11 37 69 / 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
