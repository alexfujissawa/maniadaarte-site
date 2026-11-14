/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FDFBF7',
          warm: '#F7F4EE',
          dark: '#F0ECE1',
        },
        brand: {
          brown: '#4A3E40',
          darkBrown: '#362D2E',
          softBrown: '#6B5E60',
          rose: '#D89BA6',
          terracotta: '#C87D6B',
          gold: '#C59B27',
          sage: '#7C9082',
        },
        pastel: {
          rose: '#F3E5E8',
          peach: '#FCF0E3',
          mint: '#E2ECE9',
          lavender: '#F5EFF6',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(74, 62, 64, 0.06), 0 2px 6px -1px rgba(74, 62, 64, 0.04)',
        'paper-hover': '0 20px 30px -10px rgba(74, 62, 64, 0.12), 0 8px 12px -4px rgba(74, 62, 64, 0.06)',
        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
