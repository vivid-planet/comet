import isEqual from "lodash.isequal";
import { describe, expect, it } from "vitest";

import { deduplicateByContentScope } from "./deduplicate-by-content-scope";
import type { ContentScope } from "./interfaces/content-scope.interface";

// Behavior that lodash.uniqWith(scopes, isEqual) provided, which this function must preserve:
// removing scopes that are deep-equal to an earlier one, keeping the first occurrence and the original order.
// This mirror lets each test assert both the exact expected result and parity with the replaced implementation.
function uniqWithIsEqual<T>(items: T[], getScope: (item: T) => ContentScope): T[] {
    const result: T[] = [];
    for (const item of items) {
        if (!result.some((kept) => isEqual(getScope(kept), getScope(item)))) {
            result.push(item);
        }
    }
    return result;
}

const identity = (scope: ContentScope) => scope;

describe("deduplicateByContentScope", () => {
    it("returns an empty array for empty input", () => {
        expect(deduplicateByContentScope([], identity)).toEqual([]);
    });

    it("keeps distinct scopes untouched", () => {
        const scopes = [
            { domain: "main", language: "en" },
            { domain: "main", language: "de" },
            { domain: "secondary", language: "en" },
        ];

        expect(deduplicateByContentScope(scopes, identity)).toEqual(scopes);
        expect(deduplicateByContentScope(scopes, identity)).toEqual(uniqWithIsEqual(scopes, identity));
    });

    it("removes exact duplicates and keeps the first occurrence in order", () => {
        const scopes = [
            { domain: "main", language: "en" },
            { domain: "main", language: "de" },
            { domain: "main", language: "en" },
            { domain: "secondary", language: "en" },
            { domain: "main", language: "de" },
        ];

        const expected = [
            { domain: "main", language: "en" },
            { domain: "main", language: "de" },
            { domain: "secondary", language: "en" },
        ];

        expect(deduplicateByContentScope(scopes, identity)).toEqual(expected);
        expect(deduplicateByContentScope(scopes, identity)).toEqual(uniqWithIsEqual(scopes, identity));
    });

    it("treats scopes with the same entries in a different key order as equal", () => {
        const scopes = [
            { domain: "main", language: "en" },
            { language: "en", domain: "main" },
        ];

        expect(deduplicateByContentScope(scopes, identity)).toEqual([{ domain: "main", language: "en" }]);
        expect(deduplicateByContentScope(scopes, identity)).toEqual(uniqWithIsEqual(scopes, identity));
    });

    it("keeps scopes that differ only in a single value", () => {
        const scopes = [
            { domain: "main", language: "en" },
            { domain: "main", language: "en-US" },
        ];

        expect(deduplicateByContentScope(scopes, identity)).toEqual(scopes);
        expect(deduplicateByContentScope(scopes, identity)).toEqual(uniqWithIsEqual(scopes, identity));
    });

    it("distinguishes values of different primitive types", () => {
        const scopes = [{ tenant: 1 }, { tenant: "1" }, { tenant: true }, { tenant: "1" }];

        const expected = [{ tenant: 1 }, { tenant: "1" }, { tenant: true }];

        expect(deduplicateByContentScope(scopes, identity)).toEqual(expected);
        expect(deduplicateByContentScope(scopes, identity)).toEqual(uniqWithIsEqual(scopes, identity));
    });

    it("distinguishes scopes with a different number of keys", () => {
        const scopes = [{ domain: "main" }, { domain: "main", language: "en" }];

        expect(deduplicateByContentScope(scopes, identity)).toEqual(scopes);
        expect(deduplicateByContentScope(scopes, identity)).toEqual(uniqWithIsEqual(scopes, identity));
    });

    it("deduplicates by the extracted scope and keeps the first matching item", () => {
        const items = [
            { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
            { scope: { domain: "main", language: "en" }, label: { domain: "Different label", language: "English" } },
            { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
        ];

        const getScope = (item: (typeof items)[number]) => item.scope;

        expect(deduplicateByContentScope(items, getScope)).toEqual([items[0], items[2]]);
        expect(deduplicateByContentScope(items, getScope)).toEqual(uniqWithIsEqual(items, getScope));
    });

    it("does not mutate the input array", () => {
        const scopes = [
            { domain: "main", language: "en" },
            { domain: "main", language: "en" },
        ];

        deduplicateByContentScope(scopes, identity);

        expect(scopes).toHaveLength(2);
    });
});
