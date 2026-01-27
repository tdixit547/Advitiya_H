import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/r/:path*',
        destination: 'http://localhost:3001/r/:path*',
      },
    ];
  },
};

export default nextConfig;
