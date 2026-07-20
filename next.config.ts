import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  typescript: {
    // Next 16.2.10's built-in build-time typecheck can't call into TS7's
    // compiler API yet (no stable programmatic API until TS 7.1). We run
    // `tsc --noEmit` separately instead — see package.json "typecheck".
    ignoreBuildErrors: true,
  },
};

export default withPayload(nextConfig);
