/* eslint-disable */

// @ts-check

const cometConfig = require("./comet-config.json");

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
    redirects: async () => {
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
};

module.exports = nextConfig;
