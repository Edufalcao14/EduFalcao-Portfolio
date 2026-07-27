import type { Config } from 'tailwindcss'

/** Restored from the original site. ESM export because the package is type: module. */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'hero-image': "url('/images/hero-bg.png')",
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        button: '0px 0px 68px 7px rgba(5, 150, 105, 0.4)',
        badge:'0px 0px 68px 1px rgba(5, 150, 105, 0.4)',
      },
      
    },
  },
  plugins: [],
}

export default config
