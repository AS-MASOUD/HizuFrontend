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
        background: "#F7F5EE",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3eb",
        "surface-container": "#f1eee6",
        "surface-container-high": "#ebe8e0",
        "surface-container-highest": "#e5e2da",
        surface: "#ffffff",
        "surface-dim": "#dcdad2",
        "surface-bright": "#fcf9f1",
        "on-surface": "#161A1D",
        "on-surface-variant": "#5A626A",
        outline: "#727973",
        "outline-variant": "#c2c8c2",
        primary: "#082719",
        "on-primary": "#ffffff",
        "primary-container": "#1f3d2e",
        "on-primary-container": "#87a894",
        secondary: "#516536",
        "on-secondary": "#ffffff",
        "secondary-container": "#d4ebb0",
        "on-secondary-container": "#576b3c",
        tertiary: "#03252d",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#1d3b43",
        "on-tertiary-container": "#86a5af",
        "sand-accent": "#EDE8DC",
        "sand-gold": "#dfc79b",
        "blue-eng": "#0284c7",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.75rem",
        xl: "1.25rem",
        "2xl": "1.75rem",
        full: "9999px",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
