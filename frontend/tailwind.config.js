/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4D3E",
          dark: "#163328",
          light: "#2A6B55",
        },
        accent: {
          DEFAULT: "#E67E22",
          dark: "#D46F15",
          light: "#F39C4A",
        },
        surface: {
          DEFAULT: "#F8FAF8",
          muted: "#EDF2EF",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
      },

      fontFamily: {
        sans: ["Poppins", "Roboto", "system-ui", "sans-serif"],
        heading: ["Merriweather", "Georgia", "serif"],
        serif: ["Merriweather", "Georgia", "serif"],
      },

      boxShadow: {
        soft: "0 10px 40px rgba(15, 23, 42, 0.08)",
        card: "0 16px 48px rgba(15, 23, 42, 0.12)",
        glow: "0 20px 60px rgba(31, 77, 62, 0.18)",
      },

      borderRadius: {
        "4xl": "2rem",
      },

      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "ken-burns": "kenBurns 18s ease-in-out infinite alternate",
      },

      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          from: { transform: "scale(1.05)" },
          to: { transform: "scale(1.15)" },
        },
      },
    },
  },

  plugins: [],
};
