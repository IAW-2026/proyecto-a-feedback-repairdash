import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'bg': '#271033',
          'card': '#3a1f52',
          'accent-soft': '#8d62a5',
          'accent-mid': '#c392dd',
          'accent-strong': '#f500f1',
          'text-light': '#fbdaf9',
        }
      },
      fontFamily: {
        'gilroy': ['Gilroy', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
