import eslintConfigNestJs from "@comet/eslint-config/future/nestjs.js";
import storybook from "eslint-plugin-storybook";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
    },
    ...eslintConfigNestJs,
    ...storybook.configs["flat/recommended"],
    {
        files: ["**/*.stories.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: "./.storybook/tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];

export default config;
