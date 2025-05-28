/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#334155',
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            code: {
              color: '#334155',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
            },
          },
        },
        dark: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
            code: {
              color: '#e2e8f0',
              backgroundColor: '#1e293b',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: '#f1f5f9',
            },
            blockquote: {
              color: '#cbd5e1',
              borderLeftColor: '#475569',
            },
            strong: {
              color: '#f1f5f9',
            },
            hr: {
              borderColor: '#475569',
            },
            th: {
              color: '#f1f5f9',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}