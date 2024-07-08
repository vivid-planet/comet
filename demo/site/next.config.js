/* eslint-disable */

// @ts-check

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
    cacheHandler: process.env.NEXT_PHASE !== "phase-production-build" ? require.resolve("./cache-handler.mjs") : undefined,
    cacheMaxMemorySize: process.env.NEXT_PHASE !== "phase-production-build" ? 0 : undefined, // disable default in-memory caching
};

module.exports = nextConfig;
