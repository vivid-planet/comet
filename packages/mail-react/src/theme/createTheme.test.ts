import { describe, expect, it } from "vitest";

import { createTheme } from "./createTheme.js";
import { getDefaultValue, getResponsiveOverrides } from "./responsiveValue.js";

describe("createTheme text merging", () => {
    it("has default text styles", () => {
        const theme = createTheme();
        expect(theme.text.fontFamily).toBe("Arial, sans-serif");
        expect(theme.text.fontSize).toBe("16px");
        expect(theme.text.lineHeight).toBe("20px");
        expect(theme.text.bottomSpacing).toBe(16);
    });

    it("has no variants or defaultVariant by default", () => {
        const theme = createTheme();
        expect(theme.text.variants).toBeUndefined();
        expect(theme.text.defaultVariant).toBeUndefined();
    });

    it("shallow-merges text overrides with defaults", () => {
        const theme = createTheme({ text: { fontSize: "18px" } });
        expect(theme.text.fontFamily).toBe("Arial, sans-serif");
        expect(theme.text.fontSize).toBe("18px");
        expect(theme.text.lineHeight).toBe("20px");
        expect(theme.text.bottomSpacing).toBe(16);
    });

    it("passes through variants as-is", () => {
        const theme = createTheme({
            text: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } as any,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((theme.text.variants as any)?.heading?.fontSize).toEqual({ default: "24px", mobile: "20px" });
    });
});

describe("createTheme contentIndentation", () => {
    it("has default contentIndentation with responsive mobile value", () => {
        const theme = createTheme();
        expect(getDefaultValue(theme.sizes.contentIndentation)).toBe(32);
        expect(getResponsiveOverrides(theme.sizes.contentIndentation)).toContainEqual({ breakpointKey: "mobile", value: 16 });
    });

    it("allows overriding contentIndentation with a plain number", () => {
        const theme = createTheme({ sizes: { contentIndentation: 30 } });
        expect(getDefaultValue(theme.sizes.contentIndentation)).toBe(30);
        expect(getResponsiveOverrides(theme.sizes.contentIndentation)).toEqual([]);
    });

    it("allows overriding contentIndentation with an object", () => {
        const theme = createTheme({ sizes: { contentIndentation: { default: 30, mobile: 15 } } });
        expect(getDefaultValue(theme.sizes.contentIndentation)).toBe(30);
        expect(getResponsiveOverrides(theme.sizes.contentIndentation)).toContainEqual({ breakpointKey: "mobile", value: 15 });
    });
});
