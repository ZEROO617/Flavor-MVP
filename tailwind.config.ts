import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        surface: { DEFAULT: '#0f172a', card: '#1e293b', hover: '#334155' },
      },
    },
  },
  plugins: [],
}
export default config
