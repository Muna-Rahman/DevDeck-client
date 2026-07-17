/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configures trusted external asset domains to render cleanly via next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
    ],
  },
  
  // Intercepts targeted routes on the frontend and proxies them to the server layer
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;