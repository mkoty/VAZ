import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для GitHub Pages используем export, для остальных - стандартный режим
  output: process.env.DEPLOY_TARGET === 'github' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  // basePath только для GitHub Pages
  basePath: process.env.DEPLOY_TARGET === 'github' ? '/VAZ' : '',
  assetPrefix: process.env.DEPLOY_TARGET === 'github' ? '/VAZ/' : '',
};

export default nextConfig;
