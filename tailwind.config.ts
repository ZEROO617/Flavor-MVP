import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#EAE6DD',
          card: '#FFFFFF',
          elevated: '#F4F1EC',
          hover: '#E2DDD4',
          border: '#D4CFC5',
        },
        primary: {
          DEFAULT: '#1A1A18',
          muted: '#5A5A54',
          subtle: '#8A8A82',
        },
        accent: {
          DEFAULT: '#1A1A18',
          bright: '#333330',
          soft: '#1A1A1812',
        },
        brand: {
          DEFAULT: '#1A1A18',
          dark: '#000000',
          light: '#333330',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
export default config
