import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  transpilePackages: ["@repo/db","@repo/queue"]
}

export default nextConfig;
