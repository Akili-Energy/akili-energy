/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // unoptimized: true,
    dangerouslyAllowLocalIP: true, // Only for private networks
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akilienergy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.akilienergy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cweicspxjbbfndvtznwi.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "dcmlyppdcnxqbyvyvlpv.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  reactCompiler: true,
};

export default nextConfig;
