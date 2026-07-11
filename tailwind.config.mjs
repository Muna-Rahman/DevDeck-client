/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom Theme Palette Definitions
        seagreen: '#2E8B57',
        mauve: '#E0B0FF',
        rosepink: '#FF66CC',
        deepgreen: '#052e16',
      },
    },
  },
  plugins: [],
};

export default config;