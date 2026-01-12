import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid LESS file compilation issues
  // Turbopack in Next.js 16 doesn't handle .less files from @antv/s2-react
  experimental: {
    turbo: undefined,
  },
  // Configure webpack to handle LESS files
  webpack: (config, { isServer }) => {
    // Handle .less files from @antv/s2-react
    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: {
                // Can override AntV S2 theme variables here
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
