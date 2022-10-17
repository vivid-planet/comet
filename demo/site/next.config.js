/* eslint-disable */

module.exports = {
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
