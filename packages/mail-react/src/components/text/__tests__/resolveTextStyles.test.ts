import { describe, expect, it } from "vitest";

import type { TextVariants, ThemeText } from "../../../theme/themeTypes.js";
import { resolveTextStyles } from "../MjmlText.js";

describe("resolveTextStyles", () => {
    it("applies base-only styles when no variant is active", () => {
        const themeText: ThemeText = { fontSize: "16px", color: "#333" };
        const result = resolveTextStyles(themeText, undefined, undefined);

        expect(result.props.fontSize).toBe("16px");
        expect(result.props.color).toBe("#333");
        expect(result.variant).toBeUndefined();
    });

    it("merges variant styles over base styles", () => {
        const themeText: ThemeText = {
            fontSize: "16px",
            color: "#333",
            variants: { heading: { fontSize: "24px", fontWeight: "700" } } as ThemeText["variants"],
        };
        const result = resolveTextStyles(themeText, "heading" as keyof TextVariants, undefined);

        expect(result.props.fontSize).toBe("24px");
        expect(result.props.fontWeight).toBe("700");
        expect(result.props.color).toBe("#333");
    });

    it("uses defaultVariant when no variant prop is provided", () => {
        const themeText: ThemeText = {
            fontSize: "16px",
            defaultVariant: "body" as keyof TextVariants,
            variants: { body: { lineHeight: "1.6" } } as ThemeText["variants"],
        };
        const result = resolveTextStyles(themeText, undefined, undefined);

        expect(result.props.lineHeight).toBe("1.6");
        expect(result.variant).toBe("body");
    });

    it("applies bottomSpacing as paddingBottom when prop is true", () => {
        const themeText: ThemeText = { bottomSpacing: 16 };
        const result = resolveTextStyles(themeText, undefined, true);

        expect(result.props.paddingBottom).toBe(16);
        expect(result.bottomSpacingActive).toBe(true);
    });

    it("does not apply bottomSpacing when prop is false", () => {
        const themeText: ThemeText = { bottomSpacing: 16 };
        const result = resolveTextStyles(themeText, undefined, false);

        expect(result.props.paddingBottom).toBeUndefined();
        expect(result.bottomSpacingActive).toBe(false);
    });

    it("does not apply bottomSpacing when theme has no value", () => {
        const themeText: ThemeText = {};
        const result = resolveTextStyles(themeText, undefined, true);

        expect(result.props.paddingBottom).toBeUndefined();
        expect(result.bottomSpacingActive).toBe(false);
    });

    it("extracts default value from responsive variant styles", () => {
        const themeText: ThemeText = {
            variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } as ThemeText["variants"],
        };
        const result = resolveTextStyles(themeText, "heading" as keyof TextVariants, undefined);

        expect(result.props.fontSize).toBe("24px");
    });

    it("returns no variant when neither variant prop nor defaultVariant is set", () => {
        const themeText: ThemeText = { fontSize: "16px" };
        const result = resolveTextStyles(themeText, undefined, undefined);

        expect(result.variant).toBeUndefined();
    });

    it("variant prop overrides defaultVariant", () => {
        const themeText: ThemeText = {
            defaultVariant: "body" as keyof TextVariants,
            variants: {
                body: { fontSize: "16px" },
                heading: { fontSize: "24px" },
            } as ThemeText["variants"],
        };
        const result = resolveTextStyles(themeText, "heading" as keyof TextVariants, undefined);

        expect(result.props.fontSize).toBe("24px");
        expect(result.variant).toBe("heading");
    });
});
