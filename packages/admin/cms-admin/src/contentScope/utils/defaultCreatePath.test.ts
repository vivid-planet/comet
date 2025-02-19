import { ContentScopeValues } from "../Provider";
import { defaultCreatePath } from "./defaultCreatePath";

describe("defaultCreatePath", () => {
    it("should create paths from content scope values", () => {
        const values: ContentScopeValues = [
            { domain: { value: "main" }, language: { label: "DE", value: "de" } },
            { domain: { value: "main" }, language: { label: "EN", value: "en" } },
            { domain: { value: "secondary" }, language: { label: "EN", value: "en" } },
            { domain: { value: "secondary" }, language: { label: "DE", value: "de" } },
            { country: { value: "secondary" } },
        ];
        const result = defaultCreatePath(values);

        expect(result).toEqual(["/:domain(main|secondary)/:language(de|en)", "/:country(secondary)"]);
    });

    it("should handle empty values", () => {
        const values: ContentScopeValues = [];

        const result = defaultCreatePath(values);

        expect(result).toEqual([]);
    });

    it("should handle single value", () => {
        const values: ContentScopeValues = [{ domain: { value: "main" } }];

        const result = defaultCreatePath(values);

        expect(result).toEqual(["/:domain(main)"]);
    });

    it("should handle multiple dimensions", () => {
        const values: ContentScopeValues = [{ domain: { value: "main" }, language: { value: "de" }, country: { value: "DE" } }];

        const result = defaultCreatePath(values);

        expect(result).toEqual(["/:domain(main)/:language(de)/:country(DE)"]);
    });
});
