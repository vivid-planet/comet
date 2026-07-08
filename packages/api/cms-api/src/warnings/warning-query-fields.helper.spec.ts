import { describe, expect, it } from "vitest";

import { SortDirection } from "../common/sorting/sort-direction.enum";
import { WarningSort } from "./dto/warning.sort";
import { mapWarningOrderBy, mapWarningQueryFields } from "./warning-query-fields.helper";

function warningSort(field: WarningSort["field"], direction: SortDirection): WarningSort {
    return Object.assign(new WarningSort(), { field, direction });
}

describe("mapWarningQueryFields", () => {
    it("maps type to the generated rootEntityName column", () => {
        expect(mapWarningQueryFields({ type: { $eq: "Page" } })).toEqual({ rootEntityName: { $eq: "Page" } });
    });

    it("leaves warning columns and the entityInfo relation untouched", () => {
        const query = {
            message: { $ilike: "%x%" },
            severity: { $eq: "high" },
            status: { $in: ["open"] },
            createdAt: { $gt: "2020" },
            entityInfo: { name: { $ilike: "%foo%" } },
        };
        expect(mapWarningQueryFields(query)).toEqual(query);
    });

    it("maps type nested inside $and, $or and $not", () => {
        const query = {
            $and: [{ type: { $eq: "Page" } }],
            $or: [{ message: { $ilike: "%a%" } }],
            $not: { type: { $eq: "News" } },
        };
        expect(mapWarningQueryFields(query)).toEqual({
            $and: [{ rootEntityName: { $eq: "Page" } }],
            $or: [{ message: { $ilike: "%a%" } }],
            $not: { rootEntityName: { $eq: "News" } },
        });
    });

    it("does not mutate the input", () => {
        const query = { type: { $eq: "Page" } };
        mapWarningQueryFields(query);
        expect(query).toEqual({ type: { $eq: "Page" } });
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
