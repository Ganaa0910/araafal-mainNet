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
      padding: "8rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: ["10px", "12px"],
      sm: ["12px", "16px"],
      md: ["14px", "18px"],
      lg: ["17px", "24px"],
      lg2: ["16px", "20px"],
      xl: ["20px", "28px"],
      "2xl": ["24px", "36px"],
      "3xl": ["32px", "44px"],
      "4xl": ["40px", "54px"],
      "5xl": ["56px", "58px"],
      "6xl": ["64px", "64px"],
      logoSize: ["40px", "44px"],
      logoMobile: ["20px", "28px"],
      cartDesktop: ["28px", "40px"],
      faq: ["24px", "36px"],
      aboutUs: ["24px", "36px"],
      faqExtended: ["20px", "28px"],
      featured: ["32px", "44px"],
      blueTitle: ["56px", "68px"],
      smallTitles: ["16px", "22px"],
      profileTitle: ["28px", "36px"],
    },

    extend: {
      backgroundImage: {
        "two-vector": "url('/twovector.svg')", // Replace with your SVG path
        "secondary-less":
          "var(--secondary-less-opacity, linear-gradient(266deg, rgba(70, 77, 255, 0.50) 0%, rgba(91, 195, 253, 0.50) 100%))",
      },
      colors: {
        lightblue: "#467AFF",
        brand: "#FD7C5B",
        brandBlack: "var(--Black-less-opacity, rgba(0, 0, 0, 0.50))",
        whiteish: "#E2E1E1",
        neutral100: "#C4C3C2",
        neutral400: "#4E4B48",
        neutral500: "#1C1C1C",
        neutral600: "#141414",
        secondaryLinear: "#464DFF",
      },
      backgrounds: {
        primaryBrandGrad: "",
      },
      boxShadow: {
        shadowBrand: "0 0 240px 0 #FD7C5B",
        shadowFeatured: "0 0 240px 0 #464DFF",
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
