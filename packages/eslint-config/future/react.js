import reactConfig from "../react.js";
import formatJs from "eslint-plugin-formatjs";

/** @type {import('eslint')} */
const config = [
    ...reactConfig,
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
        rules: {
            "react/jsx-no-literals": [
                "error",
                {
                    allowedStrings: ["…", "€", "$", "?", "–", "—", "/", "(", ")", "%"],
                },
            ],
            "@typescript-eslint/consistent-type-exports": [
                "error",
                {
                    fixMixedExportsWithInlineTypeSpecifier: true,
                },
            ],
        },
    },
    {
        plugins: {
            formatjs: formatJs,
        },
        rules: {
            "formatjs/enforce-default-message": ["error", "literal"],
        },
    },
];

export default config;
export { restrictedImportPaths } from "../react.js";
