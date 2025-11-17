// @ts-check

import nextBundleAnalyzer from "@next/bundle-analyzer";
import { dirname } from "path";
import { fileURLToPath } from "url";

import cometConfig from "./src/comet-config.json" with { type: "json" };

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    images: cometConfig.images,
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === "production",
    },
    eslint: {
        ignoreDuringBuilds: process.env.NODE_ENV === "production",
    },
    experimental: {
        optimizePackageImports: ["@comet/site-nextjs"],
    },
    cacheHandler: process.env.REDIS_ENABLED === "true" ? import.meta.resolve("./dist/cache-handler.js").replace("file://", "") : undefined,
    cacheMaxMemorySize: process.env.REDIS_ENABLED === "true" ? 0 : undefined, // disable default in-memory caching
    rewrites: () => {
        return {
            afterFiles: [
                {
                    // Show a 404 instead of trying to render page for paths starting with /_next/ or /assets/ as they don't get rewritten in DomainRewriteMiddleware and cause errors in ...path page
                    source: "/:prefix(_next|assets)/:path*",
                    destination: "/404",
                },
            ],
        };
    },
    webpack: (config, { isServer, nextRuntime }) => {
        if (!isServer) {
            config.module.rules.push({
                test: /\.[jt]sx?$/,
                include: [dirname(fileURLToPath(import.meta.url)) + "/src"],
                use: [
                    {
                        loader: "@comet/site-nextjs/webpackPersistedQueriesLoader",
                        options: {
                            persistedQueriesPath: ".next/persisted-queries.json",
                        },
                    },
                ],
            });
        }
        return config;
    },
};

export default withBundleAnalyzer(nextConfig);
