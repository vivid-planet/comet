import eslintConfigNestJs from "@comet/eslint-config/nestjs.js";

const noRestrictedImports = eslintConfigNestJs.flatMap((config) =>
    config.rules?.["no-restricted-imports"] ? config.rules["no-restricted-imports"] : [],
);

const filteredNoRestrictedImports = noRestrictedImports.reduce((acc, rule) => {
    if (Array.isArray(rule.paths)) {
        rule.paths = rule.paths.filter((path) => {
            return !(path.name === "class-validator" && path.importNames.includes("IsOptional"));
        });
        acc.push(rule);
    } else {
        acc.push(rule);
    }

    return acc;
}, []);

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts"],
    },
    ...eslintConfigNestJs.map((config) => ({
        ...config,
        rules: {
            ...config.rules,
            "no-restricted-imports": filteredNoRestrictedImports,
        },
    })),
];

export default config;
