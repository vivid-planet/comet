// @vitest-environment node
import { describe, expect, it } from "vitest";

import { generateScopedName } from "./generateScopedName";

const buttonModuleFilename = "/project/packages/ui/src/button/Button.module.css";

describe("generateScopedName", () => {
    it("maps `root` in a component module to the component's root class", () => {
        expect(generateScopedName("root", buttonModuleFilename)).toBe("dextinityButton");
    });

    it("maps a part name in a component module to the component's part class", () => {
        expect(generateScopedName("startIcon", buttonModuleFilename)).toBe("dextinityButton__startIcon");
    });

    it("maps a component module in a camelCase feature folder", () => {
        expect(generateScopedName("root", "/project/packages/ui/src/iconButton/IconButton.module.css")).toBe("dextinityIconButton");
    });

    it("maps a component module with Windows path separators", () => {
        expect(generateScopedName("root", "C:\\project\\packages\\ui\\src\\button\\Button.module.css")).toBe("dextinityButton");
    });

    it("maps a module outside a component folder deterministically, without the contract prefix", () => {
        const storyModuleFilename = "/project/packages/ui/src/button/__stories__/Customization.module.css";

        expect(generateScopedName("root", storyModuleFilename)).toBe(generateScopedName("root", storyModuleFilename));
        expect(generateScopedName("root", storyModuleFilename)).not.toMatch(/^dextinity/);
    });

    it("maps the same local name in different non-contract modules to different names", () => {
        const firstFilename = "/project/packages/ui/src/storybook/first.module.css";
        const secondFilename = "/project/packages/ui/src/storybook/second.module.css";

        expect(generateScopedName("root", firstFilename)).not.toBe(generateScopedName("root", secondFilename));
    });
});
