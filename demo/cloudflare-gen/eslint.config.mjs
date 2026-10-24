import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigReact from "@dextinity/eslint-config/react.js";

export default defineConfig([
    globalIgnores(["dist/**", ".wrangler/**", "migrations/**"]),
    ...eslintConfigReact,
    {
        languageOptions: {
            parserOptions: {
                // The admin, the Worker and the Node.js scripts have different globals, so each has its own tsconfig
                projectService: false,
                project: ["./tsconfig.admin.json", "./tsconfig.worker.json", "./tsconfig.node.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
        },
    },
]);
