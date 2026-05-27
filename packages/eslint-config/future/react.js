import cometPlugin from "@comet/eslint-plugin";

import reactConfig from "../react.js";

export * from "../react.js";

const config = [
    ...reactConfig,
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
