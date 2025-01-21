import cometConfig from "@comet/eslint-config/core.js";

/** @type {import('eslint')} */
const config = [
    ...cometConfig,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
