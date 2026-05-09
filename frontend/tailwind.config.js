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
          50: '#f5f7ff',
          100: '#ebf0fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        slate: {
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
