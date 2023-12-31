/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      light: {
        400: '#EDF0F5',
        500: '#C1C9D6',
        600: '#9AA5B8',
      },
      black: '#000000',
      dark: {
        400: '#1A1B20',
        500: '#22252A',
        600: '#2D2F34',
      },
      primary: {
        400: '#85ADD8',
        500: '#60A5fA',
        600: '#CEDFF7',
      }
    },
    extend: {
      boxShadow: {
        button: '0px 12px 24px 0px rgba(0, 0, 0, 0.10)',
      },
    }
  },
  plugins: [],
}
