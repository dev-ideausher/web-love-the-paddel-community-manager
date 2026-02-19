/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx"],
  images: {},
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://lovethepadel.duckdns.org/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
