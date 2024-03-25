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
<<<<<<< HEAD
    async rewrites() {
        return [
            {
                source: "/dam/:path*",
                destination: process.env.API_URL + "/dam/:path*",
            },
        ];
=======
    rewrites: async () => {
        if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === "true") return [];
        var rewrites = await require("./preBuild/build/preBuild/src/createRewrites").createRewrites();
        return rewrites;
    },
    redirects: async () => {
        if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === "true") return [];
        var redirects = await require("./preBuild/build/preBuild/src/createRedirects").createRedirects();
        return redirects;
>>>>>>> main
    },
    images: {
        deviceSizes: cometConfig.dam.allowedImageSizes,
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
};

module.exports = nextConfig;
