import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111111',
          light: '#333333',
          muted: '#666666',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f7f7f8',
          border: '#e5e5e5',
          hover: '#f0f0f0',
        },
        accent: {
          DEFAULT: '#111111',
          soft: '#f5f5f5',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
export default config
