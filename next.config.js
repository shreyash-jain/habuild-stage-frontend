/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
module.exports = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};
