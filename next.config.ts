import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty config - turbopack doesn't support webpack watchOptions
  // Data persistence uses file system but HMR issue needs different solution
};

export default nextConfig;
