/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      child_process: false
    };

    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader"
    });

    return config;
  },
}

module.exports = nextConfig
