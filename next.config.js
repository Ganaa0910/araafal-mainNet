/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OKLINK_API_KEY: process.env.OKLINK_API_KEY,
    BESTINSLOT_API_KEY: process.env.BESTINSLOT_API_KEY,
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
};

module.exports = nextConfig;
