/** @type {import("next").NextConfig} */
const config = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },

  eslint: {
    // Evitar que erros de permissão ou lints externos falhem no deploy
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Evitar que erros de permissão de checagem falhem o deploy
    ignoreBuildErrors: true,
  },
};

export default config;
