import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //Obliga a next importar la versión correcta de node.js de prisma.
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
