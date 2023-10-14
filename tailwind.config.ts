// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//       colors: {
//         lightGray: "#737373",
//         darkerLightGray: "#424242",
//         lighterGray: "#D6D6D6",
//         lighterDarkGray: "#232323",
//         darkGray: "#202020",
//         defaultGray: "#292929",
//       },
//       fontSize: {
//         xs: ["10px", "12px"],
//         sm: ["12px", "16px"],
//         md: ["14px", "18px"],
//         lg: ["16px", "24px"],
//         xl: ["20px", "28px"],
//         "2xl": ["24px", "36px"],
//         "4xl": ["40px", "54px"],
//         "6xl": ["64px", "64px"],
//       },
//     },
//   },
//   plugins: [],
// };
// export default config;
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightblue: "#467AFF",
        primaryBrand: "#FD7C5B",
      },
      backgroundImage: {
        "two-vector": "url('/twovector.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        xs: ["10px", "12px"],
        sm: ["12px", "16px"],
        md: ["14px", "18px"],
        lg: ["16px", "24px"],
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
      },
      textColor: {
        featuredRaffles: "#E2E1E1",
      },
    },
  },
  plugins: [],
};
