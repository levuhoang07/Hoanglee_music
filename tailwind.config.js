/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a0b10',
          card: '#12141e',
          hover: '#1a1d2d',
          sidebar: '#0d0e17',
        },
        accent: {
          DEFAULT: '#6366f1', // Indigo
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          pink: '#ec4899',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'walking': 'walk 0.8s infinite steps(4)',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 16px rgba(6, 182, 212, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
