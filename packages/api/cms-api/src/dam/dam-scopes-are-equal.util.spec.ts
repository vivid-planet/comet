import { describe, expect, it } from "vitest";

import { damScopesAreEqual } from "./dam-scopes-are-equal.util";

class DamScope {
    constructor(public domain: string) {}
}

describe("damScopesAreEqual", () => {
    it("considers a class instance and a plain object with the same values equal", () => {
        expect(damScopesAreEqual(new DamScope("main"), { domain: "main" })).toBe(true);
    });

    it("considers scopes with different values unequal", () => {
        expect(damScopesAreEqual({ domain: "main" }, { domain: "secondary" })).toBe(false);
    });

    it("considers scopes with different keys unequal", () => {
        expect(damScopesAreEqual({ domain: "main" }, { domain: "main", language: "en" })).toBe(false);
    });

    it("considers two undefined scopes equal", () => {
        expect(damScopesAreEqual(undefined, undefined)).toBe(true);
    });

    it("considers an undefined scope and a scope with values unequal", () => {
        expect(damScopesAreEqual(undefined, { domain: "main" })).toBe(false);
    });
});
