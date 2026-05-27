import graphqlPlugin from "@graphql-eslint/eslint-plugin";

import reactConfig from "../react.js";

export * from "../react.js";

const config = [
    ...reactConfig,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        processor: graphqlPlugin.processor,
    },
    {
        files: ["**/*.graphql"],
        languageOptions: {
            parser: graphqlPlugin.parser,
        },
        plugins: {
            "@graphql-eslint": graphqlPlugin,
        },
        rules: {
            // Type-info rules from typescript-eslint cannot run on virtual GraphQL blocks extracted by the processor.
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/consistent-type-exports": "off",
            "@graphql-eslint/naming-convention": [
                "error",
                {
                    OperationDefinition: {
                        forbiddenSuffixes: ["Query", "Mutation", "Subscription"],
                    },
                    FragmentDefinition: {
                        forbiddenSuffixes: ["Fragment"],
                    },
                },
            ],
        },
    },
];

export default config;
