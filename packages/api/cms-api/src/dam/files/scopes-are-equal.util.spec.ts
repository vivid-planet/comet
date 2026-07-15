import { describe, expect, it } from "vitest";

import { scopesAreEqual } from "./scopes-are-equal.util";

class DamScope {
    constructor(public domain: string) {}
}

describe("scopesAreEqual", () => {
    it("returns true for scopes with equal properties", () => {
        expect(scopesAreEqual({ domain: "main" }, { domain: "main" })).toBe(true);
    });

    it("returns false for scopes with different values", () => {
        expect(scopesAreEqual({ domain: "main" }, { domain: "secondary" })).toBe(false);
    });

    it("returns false for scopes with different keys", () => {
        expect(scopesAreEqual({ domain: "main" }, { domain: "main", language: "en" })).toBe(false);
    });

    it("compares a class instance and a plain object by their properties", () => {
        expect(scopesAreEqual(new DamScope("main"), { domain: "main" })).toBe(true);
    });

    it("treats two undefined scopes as equal", () => {
        expect(scopesAreEqual(undefined, undefined)).toBe(true);
    });

    it("treats an undefined scope and an empty scope as equal", () => {
        // Both reduce to {} after cloning. Callers that need to distinguish "no scope" from "empty scope" must guard
        // for undefined themselves before calling.
        expect(scopesAreEqual(undefined, {})).toBe(true);
    });

    it("treats an undefined scope and a non-empty scope as different", () => {
        expect(scopesAreEqual(undefined, { domain: "main" })).toBe(false);
    });
});
