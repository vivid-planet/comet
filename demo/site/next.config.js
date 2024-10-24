/* eslint-disable */

// @ts-check
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const cometConfig = require("./src/comet-config.json");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/dam/:path*",
                destination: process.env.API_URL + "/dam/:path*",
            },
        ];
    },
    async redirects() {
        const adminUrl = process.env.ADMIN_URL;

        if (!adminUrl) {
            throw Error("ADMIN_URL is not defined");
        }
        return [
            {
                source: "/admin",
                destination: adminUrl,
                permanent: false,
            },
        ];
    },
    images: {
        deviceSizes: cometConfig.dam.allowedImageSizes,
    },
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === "production",
    },
    eslint: {
        ignoreDuringBuilds: process.env.NODE_ENV === "production",
    },
    compiler: {
        styledComponents: true,
    },
    experimental: {
        optimizePackageImports: ["@comet/cms-site"],
    },
    cacheHandler: process.env.REDIS_ENABLED === "true" ? require.resolve("./dist/cache-handler.js") : undefined,
    cacheMaxMemorySize: process.env.REDIS_ENABLED === "true" ? 0 : undefined, // disable default in-memory caching
};

module.exports = withBundleAnalyzer(nextConfig);
