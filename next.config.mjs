/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/framer-motion/ },
      /Failed to parse source map/,
      /LayoutGroupContext/,
    ];
    return config;
  },
};

export default nextConfig;
