/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
        },
        secondary: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        bg: {
          main: '#0F172A',
          surface: '#1E293B',
          elevated: '#334155',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
        },
        border: '#334155',
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      },
    },
  },
  plugins: [],
}
