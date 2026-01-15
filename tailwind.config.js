/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
};
