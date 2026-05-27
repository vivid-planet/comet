import cometPlugin from "@comet/eslint-plugin";

import nextjsConfig from "../nextjs.js";

export * from "../nextjs.js";

const config = [
    ...nextjsConfig,
    {
        plugins: {
            "@comet": cometPlugin,
        },
        rules: {
            "@comet/no-gql-redundant-name-suffix": "error",
        },
    },
];

export default config;
