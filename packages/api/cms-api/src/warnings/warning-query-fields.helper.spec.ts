import type { EntityMetadata } from "@mikro-orm/postgresql";
import { describe, expect, it } from "vitest";

import { gqlArgsToMikroOrmQuery } from "../common/filter/mikro-orm";
import { StringFilter } from "../common/filter/string.filter";
import { SortDirection } from "../common/sorting/sort-direction.enum";
import { WarningSort } from "./dto/warning.sort";
import { mapWarningOrderBy, mapWarningQueryFields } from "./warning-query-fields.helper";

function stringFilter(values: Partial<StringFilter>): StringFilter {
    return Object.assign(new StringFilter(), values);
}

function warningSort(field: WarningSort["field"], direction: SortDirection): WarningSort {
    return Object.assign(new WarningSort(), { field, direction });
}

describe("mapWarningQueryFields", () => {
    it("nests name under the entityInfo relation", () => {
        expect(mapWarningQueryFields({ name: { $ilike: "%foo%" } })).toEqual({ entityInfo: { name: { $ilike: "%foo%" } } });
    });

    it("nests secondaryInformation under the entityInfo relation", () => {
        expect(mapWarningQueryFields({ secondaryInformation: { $eq: "foo" } })).toEqual({
            entityInfo: { secondaryInformation: { $eq: "foo" } },
        });
    });

    it("merges name and secondaryInformation into a single entityInfo object", () => {
        expect(mapWarningQueryFields({ name: { $ilike: "%a%" }, secondaryInformation: { $ilike: "%b%" } })).toEqual({
            entityInfo: { name: { $ilike: "%a%" }, secondaryInformation: { $ilike: "%b%" } },
        });
    });

    it("maps type to the generated rootEntityName column", () => {
        expect(mapWarningQueryFields({ type: { $eq: "Page" } })).toEqual({ rootEntityName: { $eq: "Page" } });
    });

    it("leaves warning columns untouched", () => {
        const query = { message: { $ilike: "%x%" }, severity: { $eq: "high" }, status: { $in: ["open"] }, createdAt: { $gt: "2020" } };
        expect(mapWarningQueryFields(query)).toEqual(query);
    });

    it("maps fields nested inside $and and $or", () => {
        const query = { $and: [{ type: { $eq: "Page" } }], $or: [{ name: { $ilike: "%a%" } }, { secondaryInformation: { $ilike: "%b%" } }] };
        expect(mapWarningQueryFields(query)).toEqual({
            $and: [{ rootEntityName: { $eq: "Page" } }],
            $or: [{ entityInfo: { name: { $ilike: "%a%" } } }, { entityInfo: { secondaryInformation: { $ilike: "%b%" } } }],
        });
    });

    // Regression: "does not contain" produces a `$not`. The `$not` must wrap the whole `entityInfo`
    // relation condition — MikroORM rejects a `$not` operator nested inside the relation object.
    it("maps fields nested inside $not", () => {
        expect(mapWarningQueryFields({ $not: { name: { $ilike: "%foo%" } } })).toEqual({
            $not: { entityInfo: { name: { $ilike: "%foo%" } } },
        });
    });

    it("does not mutate the input", () => {
        const query = { name: { $ilike: "%foo%" } };
        mapWarningQueryFields(query);
        expect(query).toEqual({ name: { $ilike: "%foo%" } });
    });

    describe("integration with gqlArgsToMikroOrmQuery for every string operator", () => {
        const metadata = {} as EntityMetadata;

        // Every occurrence of a relation field must sit directly under an `entityInfo` key, never as a
        // bare Warning column (which MikroORM would reject with "Trying to query by not existing property").
        const relationFieldsWellNested = (value: unknown, underEntityInfo = false, results: boolean[] = []): boolean[] => {
            if (Array.isArray(value)) {
                value.forEach((item) => relationFieldsWellNested(item, underEntityInfo, results));
            } else if (value !== null && typeof value === "object") {
                for (const [key, nested] of Object.entries(value)) {
                    if (key === "name" || key === "secondaryInformation") {
                        results.push(underEntityInfo);
                    }
                    relationFieldsWellNested(nested, key === "entityInfo", results);
                }
            }
            return results;
        };

        const operators: Array<[string, Partial<StringFilter>]> = [
            ["contains", { contains: "x" }],
            ["notContains", { notContains: "x" }],
            ["equal", { equal: "x" }],
            ["notEqual", { notEqual: "x" }],
            ["startsWith", { startsWith: "x" }],
            ["endsWith", { endsWith: "x" }],
            ["startsWith+endsWith", { startsWith: "a", endsWith: "b" }],
            ["isEmpty", { isEmpty: true }],
            ["isNotEmpty", { isNotEmpty: true }],
            ["isAnyOf", { isAnyOf: ["a", "b"] }],
        ];

        it.each(operators)("nests the name field under entityInfo for operator %s", (_label, values) => {
            const filter = { and: [{ name: stringFilter(values) }] };
            const mapped = mapWarningQueryFields(gqlArgsToMikroOrmQuery({ filter }, metadata));
            const nesting = relationFieldsWellNested(mapped);

            expect(nesting.length).toBeGreaterThan(0);
            expect(nesting.every(Boolean)).toBe(true);
        });
    });
});

describe("mapWarningOrderBy", () => {
    it("returns undefined when no sort is given", () => {
        expect(mapWarningOrderBy(undefined)).toBeUndefined();
    });

    it("sorts type by the generated rootEntityName column", () => {
        expect(mapWarningOrderBy([warningSort("type" as WarningSort["field"], SortDirection.ASC)])).toEqual([{ rootEntityName: SortDirection.ASC }]);
    });

    it("sorts name by the entityInfo relation", () => {
        expect(mapWarningOrderBy([warningSort("name" as WarningSort["field"], SortDirection.DESC)])).toEqual([
            { entityInfo: { name: SortDirection.DESC } },
        ]);
    });

    it("leaves plain warning columns untouched", () => {
        expect(mapWarningOrderBy([warningSort("createdAt" as WarningSort["field"], SortDirection.DESC)])).toEqual([
            { createdAt: SortDirection.DESC },
        ]);
    });

    it("maps each item of a multi-field sort", () => {
        const orderBy = mapWarningOrderBy([
            warningSort("type" as WarningSort["field"], SortDirection.ASC),
            warningSort("name" as WarningSort["field"], SortDirection.DESC),
            warningSort("severity" as WarningSort["field"], SortDirection.ASC),
        ]);
        expect(orderBy).toEqual([
            { rootEntityName: SortDirection.ASC },
            { entityInfo: { name: SortDirection.DESC } },
            { severity: SortDirection.ASC },
        ]);
    });
});
