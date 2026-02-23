import eslintConfigNextJs from "@comet/eslint-config/future/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**", ".next/**", "public/**", "block-meta.json"],
    },
    ...eslintConfigNextJs,
];

export default config;
