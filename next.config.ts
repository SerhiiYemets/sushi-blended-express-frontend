import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
        images: {
            remotePatterns: [
            {
                protocol: "https",
                hostname: "www.sushimax.cz",
                pathname: "/**", 
            },
        ],
    },
};

export default nextConfig;
