/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "**.li.fi" },
      { protocol: "https", hostname: "assets.li.fi" },
    ],
  },
};

export default nextConfig;
