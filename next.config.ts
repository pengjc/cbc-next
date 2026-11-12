import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  ...(process.env.CBC_STAGING === '1' ? { trailingSlash: true, distDir: '.next-staging' } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
