const { extendTheme, withPigment } = require("@pigment-css/nextjs-plugin");

// @ts-check
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const cometConfig = require("./src/comet-config.json");

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
    cacheHandler: process.env.REDIS_ENABLED === "true" ? require.resolve("./dist/cache-handler.js") : undefined,
    cacheMaxMemorySize: process.env.REDIS_ENABLED === "true" ? 0 : undefined, // disable default in-memory caching
};

const createBreakpoint = (value) => {
    return {
        mediaQuery: `@media (min-width: ${value}px)`,
        value: value,
    };
};

module.exports = withBundleAnalyzer(
    withPigment(
        nextConfig,
        extendTheme({
            theme: {
                colors: {
                    primary: "#c00d0d",
                    textPrimary: "#000000",
                    lightGray: "#d9d9d9",
                    white: "#ffffff",
                    black: "#000000",
                    lightBackground: "#f2f2f2",
                    linkBlue: "#29B6F6",
                    darkBlue: "#0A1327",
                    darkBlueSec: "#151d34",
                    purple: "#3C1659",
                    n050: "#f6f6f6",
                    n100: "#F2F2F2",
                    n200: "#CCCCCC",
                    n300: "#999999",
                    n400: "#676767",
                    n500: "#4C4C4C",
                    n600: "#404040",
                    n700: "#333333",
                    n800: "#242424",
                    n900: "#141414",
                },
                fonts: {
                    primary: "Arial, sans-serif",
                },
                breakpoints: {
                    b560: createBreakpoint(560),
                    b960: createBreakpoint(960),
                    b1280: createBreakpoint(1280),
                    b1600: createBreakpoint(1600),
                    b1920: createBreakpoint(1920),
                },
                easings: {
                    easeOutCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
                    easeInOutSine: "cubic-bezier(0.37, 0, 0.63, 1)",
                    easeInOutQuad: "cubic-bezier(0.45, 0, 0.55, 1)",
                    easeInCubic: "cubic-bezier(0.32, 0, 0.67, 0)",
                },
            },
            cssVarPrefix: "pigment",
        }),
    ),
);
