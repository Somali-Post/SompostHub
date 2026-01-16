/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2e7585",
          foreground: "#ffffff",
          dark: "#245f6c",
        },
        navy: {
          DEFAULT: "#1a3a44",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#C2A44D",
          foreground: "#ffffff",
        },
        mobile: {
          bg: "var(--m-bg)",
          surface: "var(--m-surface)",
          accent: "var(--m-accent)",
          text: "var(--m-text)",
          muted: "var(--m-muted)",
          border: "var(--m-border)",
        },
        desktop: {
          bg: "var(--d-bg)",
          surface: "var(--d-surface)",
          accent: "var(--d-accent)",
          text: "var(--d-text)",
          muted: "var(--d-muted)",
          border: "var(--d-border)",
        },
        auth: {
          sidebarFrom: "#1a3a44",
          sidebarTo: "#2e7585",
          accent: "#C2A44D",
          button: "#2e7585",
          buttonHover: "#245f6c",
          surface: "#FFFFFF",
          bg: "#f3f5f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
