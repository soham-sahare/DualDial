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
  async rewrites() {
    return [
      {
        source: "/_next/static/chunks/:path*.map",
        destination: "/api/empty-map",
      },
      {
        source: "/:path*.map",
        destination: "/api/empty-map",
      },
    ];
  },
};

export default nextConfig;
