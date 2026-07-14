import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C69',
        secondary: '#FFB347',
        background: '#FFF8F3',
        surface: '#FFFFFF',
        'text-main': '#2D1B0E',
        'text-sub': '#7A5C4A',
        'text-muted': '#B8956A',
        success: '#6BBF8E',
        border: '#F0E6DD',
      },
    },
  },
  plugins: [],
}

export default config
