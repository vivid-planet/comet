import { defineConfig } from "oxlint";

import coreConfig from "@dextinity/eslint-config/oxlint/core.js";

export default defineConfig({
    extends: [coreConfig],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
        "no-console": "off",

        // Oxlint can't tell whether an import is only used as a type inside a decorated declaration. TypeScript emits
        // those types as runtime metadata when `emitDecoratorMetadata` is enabled, so turning them into type imports
        // would break NestJS' dependency injection.
        "typescript/consistent-type-imports": "off",
    },
});
