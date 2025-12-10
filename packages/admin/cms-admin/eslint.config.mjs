import eslintConfigReact from "@comet/eslint-config/future/react.js";

const importedObjectWithNoRestrictedImports = eslintConfigReact.find((config) => config.rules?.["no-restricted-imports"]);
const [importedNoRestrictedImportsType, importedNoRestrictedImportsPathsObject] =
    importedObjectWithNoRestrictedImports.rules["no-restricted-imports"];

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "no-restricted-imports": [
                importedNoRestrictedImportsType,
                {
                    ...importedNoRestrictedImportsPathsObject,
                    paths: [
                        ...importedNoRestrictedImportsPathsObject.paths,
                        {
                            name: "@testing-library/react",
                            message: 'Please import from "test-utils" instead.',
                        },
                    ],
                },
            ],
        },
    },
];

export default config;
