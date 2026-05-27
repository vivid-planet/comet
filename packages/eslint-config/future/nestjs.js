import cometPlugin from "@comet/eslint-plugin";

import nestjsConfig from "../nestjs.js";

export * from "../nestjs.js";

const config = [
    ...nestjsConfig,
    {
        plugins: {
            "@comet": cometPlugin,
        },
        rules: {
            "@comet/no-gql-fragment-name-suffix": "error",
        },
    },
];

export default config;
