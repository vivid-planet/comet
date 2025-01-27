import cometConfig from "@comet/eslint-config/nestjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/mikro-orm/migrations/**", "lib/**", "block-meta.json"],
    },
    ...cometConfig,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
