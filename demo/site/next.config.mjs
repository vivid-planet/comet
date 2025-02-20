// @ts-check

import nextBundleAnalyzer from "@next/bundle-analyzer";

import cometConfig from "./src/comet-config.json" with { type: "json" };

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
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
    cacheHandler: process.env.REDIS_ENABLED === "true" ? import.meta.resolve("./dist/cache-handler.js").replace("file://", "") : undefined,
    cacheMaxMemorySize: process.env.REDIS_ENABLED === "true" ? 0 : undefined, // disable default in-memory caching
    rewrites: () => {
        return {
            afterFiles: [
                {
                    source: "/:path(_next|assets)/:file*",
                    destination: "/404",
                },
            ],
        };
    },
};

export default withBundleAnalyzer(nextConfig);
