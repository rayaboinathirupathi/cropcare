/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure server-only packages are not bundled into the client
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai'],
  },
};

export default nextConfig;
