import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your config options here
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;
