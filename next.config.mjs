/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx"],
  images: {},
  experimental: {
    appDir: false,
  },
  // compiler: {
  //   removeConsole: true
  // }
};

export default nextConfig;
