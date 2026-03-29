import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // @ts-ignore - Turbopack root config for Next.js 16
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
