/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactProductionProfiling: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
