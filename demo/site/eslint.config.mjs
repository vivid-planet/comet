import eslintConfigNextJs from "@comet/eslint-config/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**", ".next/**", "public/**", "next-env.d.ts"],
    },
    ...eslintConfigNextJs,
];

export default config;
