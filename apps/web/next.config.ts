import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  transpilePackages: ["@repo/db"]
}

export default nextConfig;
