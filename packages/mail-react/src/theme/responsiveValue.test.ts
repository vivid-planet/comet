import { describe, expect, it } from "vitest";

import { getDefaultFromResponsiveValue, getResponsiveOverrides, type ResponsiveValue } from "./responsiveValue.js";

describe("getDefaultFromResponsiveValue", () => {
    it("returns the value when given a plain number", () => {
        expect(getDefaultFromResponsiveValue(20)).toBe(20);
    });

    it("returns the default property from an object", () => {
        expect(getDefaultFromResponsiveValue({ default: 20, mobile: 10 })).toBe(20);
    });

    it("returns the default property when only default is present", () => {
        expect(getDefaultFromResponsiveValue({ default: 42 })).toBe(42);
    });

    it("works with string type", () => {
        expect(getDefaultFromResponsiveValue<string>({ default: "24px", mobile: "20px" })).toBe("24px");
    });

    it("returns a plain string value", () => {
        expect(getDefaultFromResponsiveValue<string>("24px")).toBe("24px");
    });
});

describe("getResponsiveOverrides", () => {
    it("returns an empty array for a plain number", () => {
        expect(getResponsiveOverrides(20)).toEqual([]);
    });

    it("returns an empty array for an object with only default", () => {
        expect(getResponsiveOverrides({ default: 42 })).toEqual([]);
    });

    it("returns overrides for non-default keys", () => {
        const result = getResponsiveOverrides({ default: 20, mobile: 10 });
        expect(result).toEqual([{ breakpointKey: "mobile", value: 10 }]);
    });

    it("returns multiple overrides for multiple breakpoint keys", () => {
        const value: ResponsiveValue = { default: 30, mobile: 10 };
        const result = getResponsiveOverrides(value);
        expect(result).toContainEqual({ breakpointKey: "mobile", value: 10 });
        expect(result).not.toContainEqual(expect.objectContaining({ breakpointKey: "default" }));
    });

    it("never includes the default key in overrides", () => {
        const result = getResponsiveOverrides({ default: 20, mobile: 10 });
        expect(result.every((o) => o.breakpointKey !== "default")).toBe(true);
    });

    it("works with string type", () => {
        const result = getResponsiveOverrides<string>({ default: "24px", mobile: "20px" });
        expect(result).toEqual([{ breakpointKey: "mobile", value: "20px" }]);
    });
});
