/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#015AB5",
          light: "#016BD8",
          dark: "#014B94",
        },
        accent: {
          DEFAULT: "#f5a623",
          light: "#ffb700",
          dark: "#d48a1e",
        },
        surface: {
          light: "#f0f2f5",
          DEFAULT: "#ffffff",
          dark: "#111827",
        },
        background: {
          DEFAULT: "#f0f2f5",
          dark: "#111827",
        },
        terminal: {
          DEFAULT: "#1e293b",
          light: "#334155",
        },
        success: "#09b517",
        error: "#ef4444",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
