/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        ticker: "ticker 35s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 2s infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        pulseDot: { "0%,100%": { opacity: 1, transform: "scale(1)" }, "50%": { opacity: 0.4, transform: "scale(0.75)" } },
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
