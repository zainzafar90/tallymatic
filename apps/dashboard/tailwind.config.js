const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            li: {
              fontWeight: 200,
              marginTop: '0.3rem',
              marginBottom: '0.3rem',
              lineHeight: '1.5rem',
            },
          },
        },
      }),
      fontFamily: {
        sans: ['Inter, sans-serif', { fontFeatureSettings: '"cv11"' }, ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        link: 'hsl(var(--link))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          light: 'hsl(var(--light-background))',
          blue: 'hsl(var(--blue-background))',
        },
        foreground: 'hsl(var(--foreground))',
        avatar: 'hsl(var(--avatar))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        neutral: {
          DEFAULT: 'hsl(var(--neutral))',
          foreground: 'hsl(var(--neutral-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        shadow: {
          blue: 'hsl(var(--blue-shadow))',
        },
        'warning-secondary': 'hsl(var(--warning-secondary))',
        'card-secondary': 'hsl(var(--card-secondary))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'appear-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(var(--x))',
          },
          '100%': {
            opacity: 'var(--opacity)',
            transform: 'none',
          },
        },
        'pulse-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
          '80%': {
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '100%',
            transform: 'none',
          },
        },
        'concentric-waves': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.9)',
          },
          '40%, 50%': {
            opacity: 'var(--opacity)',
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'appear-in': 'appear-in 500ms ease-out 1 normal both running calc(300ms + (var(--stagger,0) * 225ms))',
        'pulse-in': 'pulse-in 750ms ease-in-out 125ms 1 normal both running',
        'concentric-ripple': 'concentric-waves 3s ease infinite normal backwards running calc(500ms + var(--delay,0s))',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
