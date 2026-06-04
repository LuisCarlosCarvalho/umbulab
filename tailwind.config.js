/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#F1F8F5',   // Extremely soft green for warning/info banners
          100: '#D8ECE2',  // Light green borders
          200: '#B2DAC1',  // Accent border/ring
          300: '#82C19A',
          400: '#66BB6A',  // Light Green (#66BB6A)
          500: '#4CAF50',  
          600: '#2E7D32',  // Primary Green (#2E7D32)
          700: '#1B5E20',  // Dark green for hover states
          800: '#123F16',  // Deep forest green
          900: '#0B260D',
          950: '#051106',
        },
        indigo: {
          50: '#F1F8F5',
          100: '#D8ECE2',
          200: '#B2DAC1',
          300: '#82C19A',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#2E7D32',
          700: '#1B5E20',
          800: '#121212',  // Mapped to Graphite (#121212) for rich forest green-to-dark gradients
          900: '#0F0F0F',
          950: '#080808',
        }
      }
    },
  },
  plugins: [],
};
