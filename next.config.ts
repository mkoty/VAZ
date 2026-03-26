import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для Timeweb Cloud используем standalone режим вместо export
  output: process.env.DEPLOY_TARGET === 'timeweb' ? 'standalone' : 'export',
  images: {
    unoptimized: true,
  },
  // basePath только для GitHub Pages
  basePath: process.env.DEPLOY_TARGET === 'github' ? '/VAZ' : '',
  assetPrefix: process.env.DEPLOY_TARGET === 'github' ? '/VAZ/' : '',
};

export default nextConfig;
