import nestjsConfig from "../nestjs.js";

/** @type {import('eslint')} */
const config = [
    ...nestjsConfig,
    {
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "node-cache",
                            message: "node-cache is abandonware. Use @nestjs/cache-manager instead",
                        },
                    ],
                },
            ],
        },
    },
];

export default config;
