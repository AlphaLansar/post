/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Fond institutionnel
        canvas: '#F5F6F8',
        surface: '#FFFFFF',
        // Bleu nuit — barre latérale / entêtes
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#EEF2F7',
          700: '#122A4C',
          800: '#0E2340',
          900: '#0B1F3A',
          950: '#081629',
        },
        // Or institutionnel — accent
        gold: {
          DEFAULT: '#C9A227',
          soft: '#E7D19B',
          dark: '#9C7C15',
        },
        ink: {
          DEFAULT: '#1B2430',
          muted: '#5B6675',
          faint: '#8A94A3',
        },
        line: '#E4E7EC',
        pos: '#1E7F53',
        posbg: '#E7F4EC',
        neg: '#C0392B',
        negbg: '#FBEAE8',
        warn: '#B8860B',
        warnbg: '#FBF3E0',
        info: '#1F5FA8',
        infobg: '#E8F0FA',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        panel: '0 4px 16px rgba(11,31,58,0.08)',
        pop: '0 12px 32px rgba(11,31,58,0.16)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
