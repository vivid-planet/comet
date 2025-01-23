import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: [".docusaurus", "build"],
    },
    ...cometConfig,
    {
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "no-restricted-imports": "off",
        },
    },
];

export default config;
