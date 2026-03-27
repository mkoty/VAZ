import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для GitHub Pages используем статический export
  output: process.env.DEPLOY_TARGET === 'github' ? 'export' : undefined,
  images: {
    unoptimized: true, // GitHub Pages не поддерживает оптимизацию изображений
  },
  // basePath для GitHub Pages (название репозитория)
  basePath: process.env.DEPLOY_TARGET === 'github' ? '/VAZ' : '',
  assetPrefix: process.env.DEPLOY_TARGET === 'github' ? '/VAZ/' : '',
};

export default nextConfig;
