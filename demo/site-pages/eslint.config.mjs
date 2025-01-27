import cometConfig from "@comet/eslint-config/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**"],
    },
    ...cometConfig,
    {
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
        },
    },
];

export default config;
