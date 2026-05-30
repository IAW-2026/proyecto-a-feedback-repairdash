import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //Obliga a next importar la versión correcta de node.js de prisma.
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
