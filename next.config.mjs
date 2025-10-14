/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  output: "standalone",
  experimental: {
    webpackBuildWorker: false,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 300000,
        maxInitialRequests: 5,
        maxAsyncRequests: 10,
      };
    }
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.cache = { type: "filesystem", compression: "gzip" };
    return config;
  },
};
export default nextConfig;
