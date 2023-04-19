const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // To add the fonts, setup in app/configs/fonts.ts
      fontFamily: {
        brand: ["Archivo", ...defaultTheme.fontFamily.sans],
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Chivo Mono", ...defaultTheme.fontFamily.mono],
      },
      // Use https://uicolors.app to generate these
      colors: {
        brand: {
          '50': '#f4faf7',
          '100': '#d6f0e5',
          '200': '#aee0cd',
          '300': '#7ec9b0',
          '400': '#53ac90',
          '500': '#3a9276',
          '600': '#2e7661',
          '700': '#265a4b',
          '800': '#234d41',
          '900': '#214037',
          '950': '#0e251f',
        },
        surface: {
          '50': '#d7dbd8',
          '100': '#c7ccc8',
          '200': '#acb4af',
          '300': '#89948e',
          '400': '#636e68',
          '500': '#3c4440',
          '600': '#2c3531',
          '700': '#1e2422',
          '800': '#151917',
          '900': '#0c0e0d',
          '950': '#020303',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      minHeight: {
        100: "100",
      },
      minWeight: {
        100: "100",
      },
    },
    debugScreens: {
      position: ["bottom", "left"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("tailwindcss-radix")(),
  ],
};
