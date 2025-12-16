import nextjsConfig from "../nextjs.js";

const parentRestrictedImportsRule = nextjsConfig.find((config) => config.rules?.["no-restricted-imports"]);
const parentPaths = parentRestrictedImportsRule?.rules?.["no-restricted-imports"]?.[1]?.paths || [];

/** @type {import('eslint')} */
const config = [
    ...nextjsConfig,
    {
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        ...parentPaths,
                        {
                            name: "node-cache",
                            message: "node-cache is abandonware. Use cache-manager instead",
                        },
                    ],
                },
            ],
        },
    },
];

export default config;
