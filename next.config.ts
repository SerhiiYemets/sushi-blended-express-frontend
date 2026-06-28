import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? { exclude: ["error", "warn"] }
                : false,
    },
        images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 160, 256],
        minimumCacheTTL: 60 * 60 * 24,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "joinposter.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "www.sushimax.cz",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        optimizePackageImports: [
            "react-icons",
            "react-hot-toast",
            "react-spinners",
            "swiper",
        ],
    },
        async redirects() {
        return [
            {
                source: "/kolin",
                destination: "/",
                permanent: true,
            },
            {
                source: "/jihlava",
                destination: "/",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
