import coreConfig, { restrictedImportPatterns } from "./core.js";

export const restrictedImportPaths = [
    {
        name: "react",
        importNames: ["default"],
    },
    {
        name: "next/image",
        importNames: ["default"],
        message: "Don't use next/image. See https://cms-docs.dextinity.com/docs/faqs/next-image-import-restriction",
    },
    {
        name: "node-cache",
        message: "node-cache is abandonware. Use cache-manager or @cacheable/node-cache instead",
    },
];

/** @type {import("oxlint").OxlintConfig} */
const config = {
    extends: [coreConfig],
    // Oxlint replaces `jsPlugins` instead of merging it, so the plugins of the extended config are repeated.
    jsPlugins: coreConfig.jsPlugins,
    plugins: ["eslint", "typescript", "import", "unicorn", "oxc", "react", "nextjs"],
    env: { node: true, jest: true, browser: true, es2024: true },
    rules: {
        "@dextinity/no-private-sibling-import": ["error", ["gql", "sc", "gql.generated"]],

        "react/display-name": "off",
        "react/exhaustive-deps": "error",
        "react/jsx-curly-brace-presence": "error",
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "react/react-in-jsx-scope": "off",
        "react/rules-of-hooks": "error",
        "react/self-closing-comp": "error",

        "nextjs/no-img-element": "off",

        "no-restricted-globals": ["error", "React"],
        "no-restricted-imports": [
            "error",
            {
                paths: restrictedImportPaths,
                patterns: restrictedImportPatterns,
            },
        ],
    },
};

export default config;
