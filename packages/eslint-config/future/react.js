import reactConfig from "../react.js";

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
                    allowedStrings: ["…", "€", "$", "?", "–", "—", "/", "(", ")"],
                },
            ],
        },
    },
];

export default config;
