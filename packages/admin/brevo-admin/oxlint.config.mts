import reactConfig, { restrictedImportPaths } from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

const dataGridImportRestrictions = ["@mui/x-data-grid", "@mui/x-data-grid-pro", "@mui/x-data-grid-premium"].flatMap((name) =>
    ["DataGrid", "DataGridPro", "DataGridPremium"].map((importName) => ({
        name,
        importNames: [importName],
        message: "Please use DataGrid from `@dextinity/brevo-admin` instead, which resolves the configured grid via `DextinityConfig`.",
    })),
);

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/*.generated.ts", "src/**/*.generated.ts"],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
        "no-restricted-imports": [
            "error",
            {
                paths: [...restrictedImportPaths, ...dataGridImportRestrictions],
            },
        ],
    },
});
