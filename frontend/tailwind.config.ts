import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EBE2D3',
          400: '#DDD1BD',
          500: '#CCAFA3',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F7C4CD',
          300: '#F096A6',
          400: '#DE5872',
          500: '#BD2846',
          600: '#8A152E',
          700: '#722F37',
          800: '#541520',
          900: '#3D0D15',
          950: '#23050B',
        },
        gold: {
          50: '#FCF9EF',
          100: '#F8F1D9',
          200: '#F0DFAD',
          300: '#E5C97B',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A47D2E',
          700: '#7C5B21',
          800: '#5B4019',
          900: '#3D2A11',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'wedding': '0 10px 30px -10px rgba(114, 47, 55, 0.1)',
        'wedding-lg': '0 20px 40px -15px rgba(114, 47, 55, 0.18)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
