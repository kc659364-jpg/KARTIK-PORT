/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/registry/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Strict Dual-Theme Palette
        darkBase: '#0B0F19',
        darkAccent: '#2563EB',
        darkText: '#FFFFFF',
        darkMuted: '#94A3B8',
        darkCard: '#111827',
        darkBorder: '#1E293B',

        lightBg: '#FFFFFF',
        lightCard: '#E8DCCB',
        lightAccent: '#4B2E2B',
        lightText: '#241714',
        lightMuted: '#5C4845',
        lightBorder: '#D8C7B3',

        // Backward-compatibility token mappings
        espresso: {
          DEFAULT: '#241714',
          light: '#382521',
          dark: '#140D0B',
        },
        cream: {
          DEFAULT: '#FFFFFF',
          card: '#E8DCCB',
          light: '#FFFFFF',
          dark: '#E8DCCB',
        },
        caramel: {
          DEFAULT: '#4B2E2B',
          light: '#5E3A36',
          dark: '#3A2321',
        },
        'muted-brown': '#5C4845',
        'light-latte': '#E8DCCB',
        'border-subtle': '#D8C7B3',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      fontFamily: {
        body: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(43, 29, 24, 0.06)',
        'card-hover': '0 16px 36px rgba(43, 29, 24, 0.08)',
        subtle: '0 4px 20px rgba(43, 29, 24, 0.06)',
      },
      keyframes: {
        kineticReveal: {
          '0%': { opacity: '0', transform: 'translateY(0.35em) rotate(4deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0)' },
        },
        orbPulse: {
          '0%': { transform: 'scale(0.96) translateY(0)' },
          '100%': { transform: 'scale(1.04) translateY(-12px)' },
        },
        ringSpin: {
          '0%': { transform: 'rotateX(65deg) rotateY(20deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(65deg) rotateY(20deg) rotateZ(360deg)' },
        },
        ringSpinRev: {
          '0%': { transform: 'rotateX(45deg) rotateY(-30deg) rotateZ(360deg)' },
          '100%': { transform: 'rotateX(45deg) rotateY(-30deg) rotateZ(0deg)' },
        },
      },
      animation: {
        'kinetic-reveal': 'kineticReveal 500ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'orb-pulse': 'orbPulse 6s ease-in-out infinite alternate',
        'ring-spin': 'ringSpin 16s linear infinite',
        'ring-spin-rev': 'ringSpinRev 22s linear infinite',
      },
    },
  },
  plugins: [],
};
