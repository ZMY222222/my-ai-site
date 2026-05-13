import type { NextConfig } from "next";

const isCloudBase = process.env.DEPLOY_TARGET === "cloudbase";

const nextConfig: NextConfig = {
  ...(isCloudBase && {
    output: "export",
    basePath: "/zmy123456",
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
