import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts"],
    },
    ...cometConfig,
    {
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
        },
    },
];

export default config;
