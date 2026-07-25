/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#090A0F',
        darkNavy: '#0D111D',
        darkViolet: '#120F24',
        surface: 'rgba(255, 255, 255, 0.03)',
        surfaceBorder: 'rgba(0, 240, 255, 0.15)',
        cyanAccent: '#00F0FF',
        blueNeon: '#2563EB',
        ultraviolet: '#8B5CF6',
        magentaNeon: '#FF007A',
        limeCyber: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'neon-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
        'neon-magenta': '0 0 20px rgba(255, 0, 122, 0.35)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(0,240,255,0.08) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
