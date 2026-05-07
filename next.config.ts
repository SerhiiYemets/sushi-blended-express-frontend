import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "www.sushimax.cz", pathname: "/**" },
            { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
            { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
        ],
    },
};

export default nextConfig;
