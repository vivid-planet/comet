import eslintConfigNestJs from "@comet/eslint-config/nestjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
    },
    ...eslintConfigNestJs,
];

export default config;
