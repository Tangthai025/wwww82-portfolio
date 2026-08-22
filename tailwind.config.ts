import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        secondary: "var(--secondary)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        accent: {
          critical: "#FF3366",
          high: "#FF6B00",
          medium: "#FFB800",
          low: "#00D9FF",
          info: "#7D8996",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Geist Mono", "monospace"],
      },
      boxShadow: {
        "cyber-glow": "0 0 25px -5px var(--primary-glow)",
        "cyber-sm": "0 0 15px -3px var(--primary-glow)",
        "cyber-cyan": "0 0 25px -5px var(--secondary-glow)",
      },
      borderRadius: {
        cyber: "var(--radius, 6px)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
