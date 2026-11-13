/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Vintage Botanical Core Palette
        botanical: {
          bg: '#101B16',          // Deep Forest Shadow Background
          secondary: '#18251D',   // Rich Dark Foliage / Sidebar Background
          card: '#202B22',        // Slate Green Card Background
          'card-hover': '#263428',// Elevated Card Hover
          forest: '#294C36',      // Deep Forest Green
          moss: '#71805A',        // Muted Moss Green
          soil: '#79563C',        // Rich Agricultural Soil Brown
          gold: '#B69A62',        // Antique Brass & Warm Gold
          'gold-light': '#D4BE8D',// Soft Pale Gold
          'gold-dark': '#8C733E', // Aged Brass
          parchment: '#D9CEB5',   // Vintage Parchment Cream
          text: '#F0EBDD',        // Primary Cream/Ivory Text
          muted: '#A5AA96',       // Muted Sage / Moss Grey Text
          border: '#2D3B30',      // Organic Botanical Border
          'border-gold': 'rgba(182, 154, 98, 0.25)', // Antique Gold Accent Line
        },
        primary: {
          DEFAULT: '#294C36',
          50: '#18251D',
          100: '#1F3325',
          200: '#233F2E',
          300: '#294C36',
          400: '#346045',
          500: '#3F7655',
          600: '#294C36',
          700: '#213E2C',
          800: '#182E20',
          900: '#101F16',
        },
        secondary: {
          DEFAULT: '#71805A',
          50: '#1C2218',
          100: '#2B3525',
          200: '#3C4B33',
          300: '#526444',
          400: '#647A53',
          500: '#71805A',
          600: '#5F6C4C',
          700: '#4D583D',
          800: '#3B432F',
          900: '#272C1F',
        },
        gold: {
          DEFAULT: '#B69A62',
          50: '#FBF8F2',
          100: '#F5EFE0',
          200: '#E8DBC0',
          300: '#D4BE8D',
          400: '#C5A96F',
          500: '#B69A62',
          600: '#9E834F',
          700: '#846D40',
          800: '#675430',
          900: '#4A3B20',
        },
        parchment: {
          DEFAULT: '#D9CEB5',
          50: '#FAF8F4',
          100: '#F4EFE6',
          200: '#E9E2D2',
          300: '#D9CEB5',
          400: '#C7B99B',
          500: '#B4A280',
          600: '#998765',
          700: '#7C6C4F',
          800: '#5E523A',
          900: '#403726',
        },
        soil: {
          DEFAULT: '#79563C',
          50: '#241B15',
          100: '#33261D',
          200: '#4A372A',
          300: '#634A38',
          400: '#79563C',
          500: '#8E6749',
          600: '#A47957',
          700: '#79563C',
          800: '#5C402B',
          900: '#3E2A1B',
        },
        charcoal: {
          DEFAULT: '#F0EBDD', // In dark mode, charcoal text maps to creamy text
          light: '#F8F5EC',
          dark: '#E0D7C3',
        },
        muted: {
          DEFAULT: '#A5AA96', // Muted sage/moss
          light: '#BDC2B0',
          dark: '#8E947F',
        },
        surface: '#202B22',
        sand: {
          50: '#18251D',
          100: '#101B16',
          200: '#233226',
          300: '#2D3B30',
          400: '#3A4C3E',
          500: '#71805A',
          600: '#8E9A75',
          700: '#A5AA96',
          800: '#D9CEB5',
          900: '#F0EBDD',
        },
        // Semantic Compatibility Aliases
        agri: {
          50: '#18251D',
          100: '#1F3325',
          200: '#233F2E',
          300: '#294C36',
          400: '#3F7655',
          500: '#71805A',
          600: '#294C36',
          700: '#213E2C',
          800: '#182E20',
          900: '#101F16',
        },
        leaf: {
          50: '#1C2218',
          100: '#253120',
          200: '#33442C',
          300: '#48613D',
          400: '#5F8051',
          500: '#71805A',
          600: '#294C36',
          700: '#213E2C',
          800: '#182E20',
          900: '#101F16',
        },
        earth: {
          50: '#101B16',
          100: '#18251D',
          200: '#202B22',
          300: '#2D3B30',
          400: '#79563C',
          500: '#8E6749',
          600: '#B69A62',
          700: '#D9CEB5',
          800: '#F0EBDD',
          900: '#FAF8F4',
        },
      },
      boxShadow: {
        'subtle': '0 2px 6px rgba(0, 0, 0, 0.35)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(182, 154, 98, 0.12)',
        'card-hover': '0 8px 28px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(182, 154, 98, 0.35)',
        'elevated': '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(182, 154, 98, 0.25)',
        'gold-glow': '0 0 20px rgba(182, 154, 98, 0.25)',
        'forest-glow': '0 0 24px rgba(41, 76, 54, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
