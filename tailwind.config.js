/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
      linearGradientColors: {
        "custom-gradient": ["#FF7E5F", "#FEB47B"], // Define your custom gradient colors here
      },
    },
    fontSize: {
      xs: ["10px", "12px"],
      sm: ["12px", "16px"],
      md: ["14px", "18px"],
      lg: ["17px", "24px"],
      xl: ["20px", "28px"],
      "2xl": ["24px", "36px"],
      "4xl": ["40px", "54px"],
      "6xl": ["64px", "64px"],
      logoSize: ["40px", "44px"],
      logoMobile: ["20px", "28px"],
      cartDesktop: ["28px", "40px"],
      faq: ["24px", "36px"],
      aboutUs: ["24px", "36px"],
      faqExtended: ["20px", "28px"],
      featured: ["32px", "44px"],
      blueFont: ["56px", "68px"],
      smallTitles: ["16px", "22px"],
    },

    extend: {
      colors: {
        lightblue: "#467AFF",
        primaryBrand: "#FD7C5B",
        brandBlack: "var(--Black-less-opacity, rgba(0, 0, 0, 0.50))",
        whiteish: "#E2E1E1",
      },
      backgrounds: {
        primaryBrandGrad: "",
      },
      boxShadow: {
        shadowBrand: "0 0 240px 0 #FD7C5B",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
};
