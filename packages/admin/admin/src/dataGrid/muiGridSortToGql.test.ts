import { describe, expect, it } from "vitest";

import type { GridColDef } from "./GridColDef";
import { muiGridSortToGql } from "./muiGridSortToGql";

describe("muiGridSortToGql", () => {
    describe("empty / missing input", () => {
        it("returns undefined when sortModel is undefined", () => {
            expect(muiGridSortToGql(undefined)).toBeUndefined();
        });

        it("returns undefined when sortModel is empty", () => {
            expect(muiGridSortToGql([])).toBeUndefined();
        });
    });

    describe("direction mapping", () => {
        it("maps 'asc' to ASC", () => {
            const result = muiGridSortToGql([{ field: "name", sort: "asc" }]);
            expect(result).toEqual([{ field: "name", direction: "ASC" }]);
        });

        it("maps 'desc' to DESC", () => {
            const result = muiGridSortToGql([{ field: "name", sort: "desc" }]);
            expect(result).toEqual([{ field: "name", direction: "DESC" }]);
        });

        it("defaults to ASC when sort is null", () => {
            const result = muiGridSortToGql([{ field: "name", sort: null }]);
            expect(result).toEqual([{ field: "name", direction: "ASC" }]);
        });
    });

    describe("field name resolution", () => {
        it("uses field name directly when no columns provided", () => {
            const result = muiGridSortToGql([{ field: "createdAt", sort: "desc" }]);
            expect(result).toEqual([{ field: "createdAt", direction: "DESC" }]);
        });

        it("uses field name when column has no sortBy", () => {
            const columns: GridColDef[] = [{ field: "status" }];
            const result = muiGridSortToGql([{ field: "status", sort: "asc" }], columns);
            expect(result).toEqual([{ field: "status", direction: "ASC" }]);
        });

        it("remaps field when column has a string sortBy", () => {
            const columns: GridColDef[] = [{ field: "displayName", sortBy: "name" }];
            const result = muiGridSortToGql([{ field: "displayName", sort: "asc" }], columns);
            expect(result).toEqual([{ field: "name", direction: "ASC" }]);
        });

        it("expands to multiple entries when column has an array sortBy", () => {
            const columns: GridColDef[] = [{ field: "fullName", sortBy: ["firstName", "lastName"] }];
            const result = muiGridSortToGql([{ field: "fullName", sort: "asc" }], columns);
            expect(result).toEqual([
                { field: "firstName", direction: "ASC" },
                { field: "lastName", direction: "ASC" },
            ]);
        });
    });

    describe("multiple sort items", () => {
        it("preserves order of multiple sort items", () => {
            const result = muiGridSortToGql([
                { field: "lastName", sort: "asc" },
                { field: "createdAt", sort: "desc" },
            ]);
            expect(result).toEqual([
                { field: "lastName", direction: "ASC" },
                { field: "createdAt", direction: "DESC" },
            ]);
        });

        it("mixes remapped and direct fields across multiple items", () => {
            const columns: GridColDef[] = [{ field: "fullName", sortBy: ["firstName", "lastName"] }];
            const result = muiGridSortToGql(
                [
                    { field: "fullName", sort: "asc" },
                    { field: "createdAt", sort: "desc" },
                ],
                columns,
            );
            expect(result).toEqual([
                { field: "firstName", direction: "ASC" },
                { field: "lastName", direction: "ASC" },
                { field: "createdAt", direction: "DESC" },
            ]);
        });
    });
});
