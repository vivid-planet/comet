/* eslint-disable */

module.exports = {
    distDir: "build/current",
    headers: async () => [
        {
            source: "/_next/image",
            headers: [
                {
                    key: "Cache-Control",
                    value: "max-age=31536000",
                },
            ],
        },
    ],
    redirects: async () => {
        var redirects = await require("./preBuild/build/preBuild/src/createRedirects").createRedirects();
        return redirects;
    },
    images: {
        deviceSizes: process.env.DAM_ALLOWED_IMAGE_SIZES.split(",").map(Number),
        imageSizes: [],
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        var path = require("path");

        config.resolve.alias["@src"] = path.resolve(__dirname, "src/");

        return config;
    },
    env: {
        SITE_URL: process.env.SITE_URL,
        GTM_ID: process.env.GTM_ID,
        API_URL: process.env.API_URL,
        PCM_API_URL: process.env.PCM_API_URL,
        PCM_API_USER: process.env.PCM_API_USER,
        PCM_API_PASSWORD: process.env.PCM_API_PASSWORD,
        DAM_ALLOWED_IMAGE_ASPECT_RATIOS: process.env.DAM_ALLOWED_IMAGE_ASPECT_RATIOS,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        SITE_DOMAIN: process.env.SITE_DOMAIN,
        SITE_LANGUAGES: process.env.SITE_LANGUAGES,
        SITE_DEFAULT_LANGUAGE: process.env.SITE_DEFAULT_LANGUAGE,
    },
    i18n: {
        locales: process.env.SITE_LANGUAGES.split(","),
        defaultLocale: process.env.SITE_DEFAULT_LANGUAGE,
        localeDetection: process.env.NODE_ENV !== "development",
    },
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === "production",
    },
    eslint: {
        ignoreDuringBuilds: process.env.NODE_ENV === "production",
    },
};
