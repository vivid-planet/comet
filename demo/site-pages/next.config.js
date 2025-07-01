/* eslint-disable */

// @ts-check

const cometConfig = require("./src/comet-config.json");

/**
 * @type {import('next').NextConfig['i18n'] | undefined}
 **/
let i18n = undefined;

if (process.env.SITE_IS_PREVIEW !== "true") {
    if (!process.env.NEXT_PUBLIC_SITE_LANGUAGES) {
        throw new Error("Missing environment variable NEXT_PUBLIC_SITE_LANGUAGES");
    }

    if (!process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE) {
        throw new Error("Missing environment variable NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE");
    }

    i18n = {
        locales: process.env.NEXT_PUBLIC_SITE_LANGUAGES.split(","),
        defaultLocale: process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE,
        localeDetection: process.env.NODE_ENV === "development" ? false : undefined,
    };
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    rewrites: async () => {
        if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === "true") return [];
        var rewrites = await require("./preBuild/build/preBuild/src/createRewrites").createRewrites();
        return rewrites;
    },
    redirects: async () => {
        if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === "true") return [];
        var redirects = await require("./preBuild/build/preBuild/src/createRedirects").createRedirects();
        return redirects;
    },
    images: {
        deviceSizes: cometConfig.dam.allowedImageSizes,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        var path = require("path");

        config.resolve.alias["@src"] = path.resolve(__dirname, "src/");

        return config;
    },
    i18n,
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
        optimizePackageImports: ["@comet/site-nextjs"],
    },
};

module.exports = nextConfig;
