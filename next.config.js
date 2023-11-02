/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    UNISAT_API_KEY: process.env.UNISAT_API_KEY,
  },
  images: {
    domains: [
      "ordinals.com",
      "ord.cdn.magiceden.dev",
      "creator-hub-prod.s3.us-east-2.amazonaws.com",
      "raffle.satoshipunks.art",
      "testnet.ordinals.com",
      "ordinals.com",
      "example.com",
    ],
  },
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001" // development api
        : "https://intense-dawn-28474-65522bbea206.herokuapp.com", // production api
  },
};

module.exports = nextConfig;
