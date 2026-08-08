import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // framer-motion and the Payload UI are barrel-heavy; this rewrites their
  // re-exports into direct imports so the bundler can drop what is unused.
  experimental: {
    optimizePackageImports: ["framer-motion", "@payloadcms/ui"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
