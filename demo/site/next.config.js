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
                palette: {
                    primary: {
                        light: "#73E8FF",
                        main: "#29B6F6",
                        dark: "#0086C3",
                        contrastText: "#000000",
                    },
                    text: {
                        primary: "#242424",
                        secondary: "#828282",
                        inverted: "#ffffff",
                    },
                    gray: {
                        50: "#F2F2F2",
                        100: "#D9D9D9",
                        200: "#B3B3B3",
                        300: "#828282",
                        400: "#676767",
                        500: "#4C4C4C",
                        600: "#454545",
                        700: "#3C3C3C",
                        800: "#333333",
                        900: "#242424",
                    },
                    error: {
                        main: "#BC3520",
                        light: "#C6523F",
                        dark: "#832617",
                        contrastText: "#B3B3B3",
                    },
                    warning: {
                        main: "#F3B346",
                        light: "#F5C15F",
                        dark: "#A87D32",
                        contrastText: "#090909",
                    },
                    info: {
                        main: "#F3B346",
                        light: "#F5C15F",
                        dark: "#A87D32",
                        contrastText: "#090909",
                    },
                    success: {
                        main: "#66C54F",
                        light: "#77D06A",
                        dark: "#488938",
                        contrastText: "#090909",
                    },
                },
                fontFamily: "Arial, sans-serif",

                breakpoints: {
                    xs: createBreakpoint(600),
                    sm: createBreakpoint(900),
                    md: createBreakpoint(1200),
                    lg: createBreakpoint(1600),
                },
                spacing: {
                    D100: "var(--spacing-d100)",
                    D200: "var(--spacing-d200)",
                    D300: "var(--spacing-d300)",
                    D400: "var(--spacing-d400)",
                    S100: "var(--spacing-s100)",
                    S200: "var(--spacing-s200)",
                    S300: "var(--spacing-s300)",
                    S400: "var(--spacing-s400)",
                    S500: "var(--spacing-s500)",
                    S600: "var(--spacing-s600)",
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
