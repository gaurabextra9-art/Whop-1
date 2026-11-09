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
          DEFAULT: "#0F172A", // Deep Navy Charcoal
          light: "#1E293B",
          dark: "#020617",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#EA580C", // Rich Copper / Contractor Orange
          hover: "#C2410C",
          light: "#FFF7ED",
          border: "#FDBA74",
          foreground: "#FFFFFF",
        },
        slate: {
          850: "#172033",
          950: "#080C15",
        },
        copper: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'contractor': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
        'contractor-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.12)',
        'accent-glow': '0 0 25px -5px rgba(234, 88, 12, 0.4)',
      }
    },
  },
  plugins: [],
}
