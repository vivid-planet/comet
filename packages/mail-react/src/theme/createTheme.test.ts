import { describe, expect, it } from "vitest";

import { createTheme } from "./createTheme.js";
import { getDefaultFromResponsiveValue, getResponsiveOverrides } from "./responsiveValue.js";

describe("createTheme contentIndentation", () => {
    it("has default contentIndentation with responsive mobile value", () => {
        const theme = createTheme();
        expect(getDefaultFromResponsiveValue(theme.sizes.contentIndentation)).toBe(32);
        expect(getResponsiveOverrides(theme.sizes.contentIndentation)).toContainEqual({ breakpointKey: "mobile", value: 16 });
    });

    it("allows overriding contentIndentation with a plain number", () => {
        const theme = createTheme({ sizes: { contentIndentation: 30 } });
        expect(getDefaultFromResponsiveValue(theme.sizes.contentIndentation)).toBe(30);
        expect(getResponsiveOverrides(theme.sizes.contentIndentation)).toEqual([]);
    });

    it("allows overriding contentIndentation with an object", () => {
        const theme = createTheme({ sizes: { contentIndentation: { default: 30, mobile: 15 } } });
        expect(getDefaultFromResponsiveValue(theme.sizes.contentIndentation)).toBe(30);
        expect(getResponsiveOverrides(theme.sizes.contentIndentation)).toContainEqual({ breakpointKey: "mobile", value: 15 });
    });
});
