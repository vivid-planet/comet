import { addDays, subDays } from "date-fns";

import { RedirectGenerationType } from "./redirects.enum";
import { type FilterableRedirect, isEmptyFilter, redirectMatchesFilter } from "./redirects.util";

describe("redirectMatchesFilter", () => {
    it("should match for empty filter", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, {})).toBe(true);
    });

    it("should match for string filter", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, { source: { contains: "our" } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { contains: "arg" } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { source: { startsWith: "/sou" } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { startsWith: "/arg" } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { source: { endsWith: "rce" } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { endsWith: "get" } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { source: { equal: "/source" } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { equal: "/target" } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { source: { notEqual: "/source" } })).toBe(false);
        expect(redirectMatchesFilter(redirect, { source: { notEqual: "/target" } })).toBe(true);

        expect(redirectMatchesFilter(redirect, { source: { isAnyOf: ["/source", "/target"] } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { isAnyOf: ["/target"] } })).toBe(false);
    });

    it("should match for boolean filter", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, { active: { equal: true } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { active: { equal: false } })).toBe(false);
    });

    it("should match for date time filter", () => {
        const today = new Date();
        const yesterday = subDays(today, 1);
        const tomorrow = addDays(today, 1);

        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: yesterday,
            updatedAt: today,
        };

        expect(redirectMatchesFilter(redirect, { createdAt: { equal: yesterday } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { createdAt: { equal: today } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { createdAt: { notEqual: today } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { createdAt: { notEqual: yesterday } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { updatedAt: { greaterThan: yesterday } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { updatedAt: { greaterThan: today } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { updatedAt: { greaterThanEqual: today } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { updatedAt: { greaterThanEqual: tomorrow } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { updatedAt: { lowerThan: tomorrow } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { updatedAt: { lowerThan: today } })).toBe(false);

        expect(redirectMatchesFilter(redirect, { updatedAt: { lowerThanEqual: today } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { updatedAt: { lowerThanEqual: yesterday } })).toBe(false);
    });

    it("should match for multiple filters", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, { source: { contains: "our" }, active: { equal: true } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { contains: "our" }, active: { equal: false } })).toBe(false);
    });

    it("should match for and filters", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, { source: { contains: "our" }, and: [{ active: { equal: true } }] })).toBe(true);
        expect(redirectMatchesFilter(redirect, { source: { contains: "our" }, and: [{ active: { equal: false } }] })).toBe(false);

        expect(redirectMatchesFilter(redirect, { and: [] })).toBe(true);
        expect(redirectMatchesFilter(redirect, { and: [{ source: { contains: "our" } }, { active: { equal: true } }] })).toBe(true);
        expect(redirectMatchesFilter(redirect, { and: [{ source: { contains: "our" } }, { active: { equal: false } }] })).toBe(false);
    });

    it("should match for or filters", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, { source: { contains: "our" }, or: [{ active: { equal: true } }] })).toBe(true); // Both match
        expect(redirectMatchesFilter(redirect, { source: { contains: "our" }, or: [{ active: { equal: false } }] })).toBe(true); // First matches
        expect(redirectMatchesFilter(redirect, { source: { equal: "/target" }, or: [{ active: { equal: true } }] })).toBe(true); // Second matches
        expect(redirectMatchesFilter(redirect, { source: { equal: "/target" }, or: [{ active: { equal: false } }] })).toBe(false); // None match

        expect(redirectMatchesFilter(redirect, { or: [] })).toBe(true);
        expect(redirectMatchesFilter(redirect, { or: [{ source: { contains: "our" } }, { active: { equal: true } }] })).toBe(true); // Both match
        expect(redirectMatchesFilter(redirect, { or: [{ source: { contains: "our" } }, { active: { equal: false } }] })).toBe(true); // First matches
        expect(redirectMatchesFilter(redirect, { or: [{ source: { equal: "/target" } }, { active: { equal: true } }] })).toBe(true); // Second matches
        expect(redirectMatchesFilter(redirect, { or: [{ source: { equal: "/target" } }, { active: { equal: false } }] })).toBe(false); // None match
    });

    it("should match target URL and pathname", () => {
        const redirect: FilterableRedirect = {
            generationType: RedirectGenerationType.manual,
            source: "/source",
            target: "https://example.com/target",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(redirectMatchesFilter(redirect, { target: { equal: "/target" } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { target: { equal: "https://example.com/target" } })).toBe(true);

        expect(redirectMatchesFilter(redirect, { target: { startsWith: "/target" } })).toBe(true);
        expect(redirectMatchesFilter(redirect, { target: { startsWith: "https://example.com/target" } })).toBe(true);
    });
});

describe("isEmptyFilter", () => {
    it("should return true for empty filter", () => {
        expect(isEmptyFilter({})).toBe(true);
    });

    it("should return false for non-empty filter", () => {
        expect(isEmptyFilter({ source: { contains: "our" } })).toBe(false);
    });

    it("should return true for empty and-filter", () => {
        expect(isEmptyFilter({ and: [] })).toBe(true);
    });

    it("should return false for non-empty and-filter", () => {
        expect(isEmptyFilter({ and: [{ source: { contains: "our" } }] })).toBe(false);
    });

    it("should return true for empty or-filter", () => {
        expect(isEmptyFilter({ or: [] })).toBe(true);
    });

    it("should return false for non-empty or-filter", () => {
        expect(isEmptyFilter({ or: [{ source: { contains: "our" } }] })).toBe(false);
    });
});
