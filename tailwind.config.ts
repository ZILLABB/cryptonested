import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logo-based color scheme
        'brand-primary': '#1CDDDD',    // Turquoise from logo
        'brand-secondary': '#FFFFFF',  // White for contrast
        'brand-accent': '#1CDDDD',     // Turquoise accent
        'brand-background': {
          light: '#F3F4F6',            // Light background for light mode
          dark: '#1E0B33'              // Deep purple from logo background
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
