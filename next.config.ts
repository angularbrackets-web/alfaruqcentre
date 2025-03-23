import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media4.giphy.com' },
      { protocol: 'https', hostname: 'media0.giphy.com' },
    ],
  }
};

export default nextConfig;
