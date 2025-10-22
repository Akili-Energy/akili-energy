/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // ppr: "incremental",
  },
};

export default nextConfig
