import eslintConfigNextJs from "@comet/eslint-config/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigNextJs,
    {
        rules: {
            "@next/next/no-html-link-for-pages": "off", // disabled because lib has no pages dir
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
