import type { Config } from "tailwindcss";

const config: Config = {
  content: [

    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { primary: "#0a0a0f", secondary: "#12121a", card: "#1a1a2e", "card-hover": "#222244" },
        text: { primary: "#ffffff", secondary: "#a1a1aa", muted: "#71717a" },
        primary: { DEFAULT: "#7c3aed", dark: "#6d28d9", light: "#a855f7" },
        secondary: { DEFAULT: "#10b981", dark: "#059669", light: "#34d399" },
        accent: { DEFAULT: "#f59e0b", dark: "#d97706", light: "#fbbf24" },
        destructive: { DEFAULT: "#ef4444", dark: "#dc2626", light: "#f87171" },
        blue: { DEFAULT: "#3b82f6", dark: "#2563eb" },
        pink: { DEFAULT: "#ec4899", dark: "#db2777" },
        border: { DEFAULT: "rgba(255,255,255,0.08)", hover: "rgba(255,255,255,0.15)" },
      },
      borderRadius: {
        sm: "8px", md: "12px", lg: "16px", xl: "20px", "2xl": "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.25s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient": "gradient-shift 4s ease infinite",
        "ping-slow": "ping-slow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(16px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        slideDown: { "0%": { transform: "translateY(-16px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        scaleIn: { "0%": { transform: "scale(0.92)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-glow": { "0%,100%": { boxShadow: "0 0 20px rgba(124,58,237,0.15)" }, "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.05)" } },
        "gradient-shift": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        "ping-slow": { "0%": { transform: "scale(1)", opacity: "0.8" }, "50%": { transform: "scale(1.5)", opacity: "0.2" }, "100%": { transform: "scale(1)", opacity: "0.8" } },
      },
    },
  },
  plugins: [],
};

export default config;
