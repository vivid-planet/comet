import { createPathFromDimensionValues } from "./createPathFromDimensionValues";

describe("createPathFromDimensionValues", () => {
    it("should create path with single dimension and single value", () => {
        const dimensionValues = { domain: new Set(["main"]) };
        const result = createPathFromDimensionValues(dimensionValues);
        expect(result).toBe("/:domain(main)");
    });

    it("should create path with single dimension and multiple values", () => {
        const dimensionValues = { domain: new Set(["main", "secondary"]) };
        const result = createPathFromDimensionValues(dimensionValues);
        expect(result).toBe("/:domain(main|secondary)");
    });

    it("should create path with multiple dimensions and single values", () => {
        const dimensionValues = { domain: new Set(["main"]), language: new Set(["de"]) };
        const result = createPathFromDimensionValues(dimensionValues);
        expect(result).toBe("/:domain(main)/:language(de)");
    });

    it("should create path with multiple dimensions and multiple values", () => {
        const dimensionValues = { domain: new Set(["main", "secondary"]), language: new Set(["de", "en"]) };
        const result = createPathFromDimensionValues(dimensionValues);
        expect(result).toBe("/:domain(main|secondary)/:language(de|en)");
    });

    it("should create path with empty dimension values", () => {
        const dimensionValues: { [dimension: string]: Set<string> } = { domain: new Set() };
        const result = createPathFromDimensionValues(dimensionValues);
        expect(result).toBe("/:domain()");
    });

    it("should create path with no dimensions", () => {
        const dimensionValues = {};
        const result = createPathFromDimensionValues(dimensionValues);
        expect(result).toBe("");
    });
});
