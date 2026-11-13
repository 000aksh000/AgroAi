/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // AgroAI Premium Design System
        primary: {
          DEFAULT: '#174C35',
          50: '#F0F6F3',
          100: '#DCE9E2',
          200: '#BBD4C6',
          300: '#8FB9A2',
          400: '#5F997B',
          500: '#3D7E5D',
          600: '#174C35', // Deep Forest Green
          700: '#123D2A',
          800: '#0E2E1F',
          900: '#091E14',
        },
        secondary: {
          DEFAULT: '#65A765',
          50: '#F3FAF3',
          100: '#E4F4E4',
          200: '#C7E7C7',
          300: '#A4D5A4',
          400: '#82C182',
          500: '#65A765', // Fresh Leaf Green
          600: '#4E8F4E',
          700: '#3D723D',
          800: '#2D542D',
          900: '#1E391E',
        },
        soil: {
          DEFAULT: '#8B6548',
          50: '#FAF6F2',
          100: '#F3ECE4',
          200: '#E6D7C8',
          300: '#D5BEA8',
          400: '#B89476',
          500: '#9C7456',
          600: '#8B6548', // Earth Brown Accent
          700: '#735239',
          800: '#5A3F2C',
          900: '#422E20',
          950: '#2A1C13',
        },
        charcoal: {
          DEFAULT: '#202820', // Dark Charcoal Text
          light: '#333D33',
          dark: '#141A14',
        },
        muted: {
          DEFAULT: '#788579', // Soft Grey-Green
          dark: '#5C675D',
          light: '#A1ADA2',
        },
        surface: '#FFFFFF',
        sand: {
          50: '#FAFBF7',
          100: '#F7F8F2', // Warm Off-White Background
          200: '#E9ECE2',
          300: '#DCE1D3',
          400: '#CCD3C0',
          500: '#B8C1AA',
          600: '#9EA890',
          700: '#8B6548',
          800: '#584431',
          900: '#202820',
        },
        // Semantic Compatibility Aliases
        agri: {
          50: '#F0F6F3',
          100: '#DCE9E2',
          200: '#C7E7C7',
          300: '#A4D5A4',
          400: '#82C182',
          500: '#65A765',
          600: '#174C35',
          700: '#123D2A',
          800: '#0E2E1F',
          900: '#091E14',
          950: '#05130D',
        },
        leaf: {
          50: '#F3FAF3',
          100: '#E4F4E4',
          200: '#C7E7C7',
          300: '#A4D5A4',
          400: '#82C182',
          500: '#65A765',
          600: '#174C35',
          700: '#123D2A',
          800: '#0E2E1F',
          900: '#091E14',
        },
        earth: {
          50: '#FAF6F2',
          100: '#F3ECE4',
          200: '#E6D7C8',
          300: '#D5BEA8',
          400: '#B89476',
          500: '#9C7456',
          600: '#8B6548',
          700: '#735239',
          800: '#5A3F2C',
          900: '#422E20',
        },
        harvest: {
          50: '#FFFDF5',
          100: '#FEF8E7',
          200: '#FCEFC7',
          300: '#F9DF98',
          400: '#F5CB63',
          500: '#EAB333',
          600: '#CB9418',
          700: '#A37210',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(32, 40, 32, 0.05), 0 1px 2px -1px rgba(32, 40, 32, 0.04)',
        'card': '0 1px 3px 0 rgba(23, 76, 53, 0.04), 0 4px 12px -2px rgba(23, 76, 53, 0.03)',
        'card-hover': '0 4px 20px -2px rgba(23, 76, 53, 0.08), 0 2px 6px -1px rgba(23, 76, 53, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 76, 53, 0.12), 0 4px 12px -2px rgba(23, 76, 53, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
