import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export disabled to enable admin portal with middleware
  // Re-enable for production deployment if needed
  // output: 'export',

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Trailing slash for better static hosting compatibility
  trailingSlash: true,

  // Base path if deploying to subdirectory (leave empty for root domain)
  // basePath: '',

  // Asset prefix for CDN (optional)
  // assetPrefix: '',
};

export default nextConfig;
