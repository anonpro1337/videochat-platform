import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          "card-hover": "var(--bg-card-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--accent-purple)",
          dark: "#6d28d9",
          light: "var(--accent-purple-light)",
        },
        secondary: {
          DEFAULT: "var(--accent-green)",
          dark: "#059669",
          light: "#34d399",
        },
        accent: {
          DEFAULT: "var(--accent-orange)",
          dark: "#d97706",
          light: "#fbbf24",
        },
        destructive: {
          DEFAULT: "var(--accent-red)",
          dark: "#dc2626",
          light: "#f87171",
        },
        blue: {
          DEFAULT: "var(--accent-blue)",
          dark: "#2563eb",
        },
        pink: {
          DEFAULT: "var(--accent-pink)",
          dark: "#db2777",
        },
        border: {
          DEFAULT: "var(--border-color)",
          hover: "var(--border-hover)",
        },
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
  plugins: [require('@tailwindcss/forms')],
};

export default config;
