import { describe, expect, it } from "vitest";

import { getSelectableAiContentTypes } from "./aiContentType";

describe("getSelectableAiContentTypes", () => {
    it("offers all types when none are configured", () => {
        expect(getSelectableAiContentTypes({})).toEqual(["Generated", "Modified"]);
    });

    it("offers only the configured types", () => {
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: ["Generated"] })).toEqual(["Generated"]);
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: ["Modified"] })).toEqual(["Modified"]);
    });

    it("offers no type when the configured types are empty", () => {
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: [] })).toEqual([]);
    });

    it("keeps the type already set on the file selectable although it isn't configured", () => {
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: ["Generated"], currentAiContentType: "Modified" })).toEqual([
            "Generated",
            "Modified",
        ]);
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: [], currentAiContentType: "Modified" })).toEqual(["Modified"]);
    });

    it("doesn't offer a type twice when it is both configured and set on the file", () => {
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: ["Generated"], currentAiContentType: "Generated" })).toEqual(["Generated"]);
    });

    it("keeps a stable order regardless of the configured order", () => {
        expect(getSelectableAiContentTypes({ configuredAiContentTypes: ["Modified", "Generated"] })).toEqual(["Generated", "Modified"]);
    });
});
