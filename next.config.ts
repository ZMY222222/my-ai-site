import type { NextConfig } from "next";

const deployTarget = process.env.DEPLOY_TARGET;
const isCloudBase = deployTarget === "cloudbase";
const isStaticExport = isCloudBase || deployTarget === "github-pages";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    images: {
      unoptimized: true,
    },
  }),
  ...(isCloudBase && {
    basePath: "/zmy123456",
  }),
};

export default nextConfig;
