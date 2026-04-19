import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use static export for production (S3 deploy). Dev server works without it.
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
