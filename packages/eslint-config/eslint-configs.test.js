import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

/**
 * The ESLint configs of this package aren't used to lint this repository anymore, it uses the Oxlint configs. These
 * tests make sure the ESLint configs keep resolving: `calculateConfigForFile` loads every plugin and validates every
 * rule name and its options.
 */
const configFiles = ["core.js", "nestjs.js", "nextjs.js", "react.js", "future/nestjs.js", "future/nextjs.js", "future/react.js"];

describe.each(configFiles)("%s", (configFile) => {
    it("resolves for a TypeScript file", async () => {
        const eslint = new ESLint({ overrideConfigFile: fileURLToPath(new URL(configFile, import.meta.url)) });

        const config = await eslint.calculateConfigForFile("src/index.tsx");

        expect(Object.keys(config.rules)).not.toHaveLength(0);
    });
});
