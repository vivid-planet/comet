import { parseISO } from "date-fns";

import { SortDirection } from "../common/sorting/sort-direction.enum";
import { PageTreeNodeSortField } from "./dto/page-tree-node.sort";
import { paginateNodes, sortPreloadedNodes } from "./page-tree-read-api";
import { PageTreeNodeInterface } from "./types";

describe("PageTreeReadApi", () => {
    describe("sortPreloadedNodes", () => {
        it("should skip sorting if only sort criteria is by pos ascending", () => {
            const alreadySorted = [{ pos: 1 }, { pos: 2 }] as PageTreeNodeInterface[];

            // Use toBe() to check if the array is the same instance
            expect(sortPreloadedNodes(alreadySorted, [{ field: PageTreeNodeSortField.pos, direction: SortDirection.ASC }])).toBe(alreadySorted);
        });

        it("should sort by pos descending", () => {
            const unsorted = [{ pos: 1 }, { pos: 2 }] as PageTreeNodeInterface[];

            const sorted = [{ pos: 2 }, { pos: 1 }] as PageTreeNodeInterface[];

            expect(sortPreloadedNodes(unsorted, [{ field: PageTreeNodeSortField.pos, direction: SortDirection.DESC }])).toEqual(sorted);
        });

        it("should sort by updatedAt ascending", () => {
            const unsorted = [
                { updatedAt: parseISO("2023-07-31T00:00:00") },
                { updatedAt: parseISO("2023-07-28T00:00:00") },
                { updatedAt: parseISO("2023-07-28T02:00:00") },
            ] as PageTreeNodeInterface[];

            const sorted = [
                { updatedAt: parseISO("2023-07-28T00:00:00") },
                { updatedAt: parseISO("2023-07-28T02:00:00") },
                { updatedAt: parseISO("2023-07-31T00:00:00") },
            ] as PageTreeNodeInterface[];

            expect(sortPreloadedNodes(unsorted, [{ field: PageTreeNodeSortField.updatedAt, direction: SortDirection.ASC }])).toEqual(sorted);
        });

        it("should sort by updatedAt descending", () => {
            const unsorted = [
                { updatedAt: parseISO("2023-07-28T00:00:00") },
                { updatedAt: parseISO("2023-07-31T00:00:00") },
                { updatedAt: parseISO("2023-07-28T02:00:00") },
            ] as PageTreeNodeInterface[];

            const sorted = [
                { updatedAt: parseISO("2023-07-31T00:00:00") },
                { updatedAt: parseISO("2023-07-28T02:00:00") },
                { updatedAt: parseISO("2023-07-28T00:00:00") },
            ] as PageTreeNodeInterface[];

            expect(sortPreloadedNodes(unsorted, [{ field: PageTreeNodeSortField.updatedAt, direction: SortDirection.DESC }])).toEqual(sorted);
        });

        it("should sort first by position, then by updatedAt", () => {
            const unsorted = [
                { pos: 2, updatedAt: parseISO("2023-07-28T00:00:00") },
                { pos: 1, updatedAt: parseISO("2023-07-28T02:00:00") },
                { pos: 2, updatedAt: parseISO("2023-07-31T00:00:00") },
                { pos: 1, updatedAt: parseISO("2023-07-31T02:00:00") },
            ] as PageTreeNodeInterface[];

            const sorted = [
                { pos: 1, updatedAt: parseISO("2023-07-31T02:00:00") },
                { pos: 1, updatedAt: parseISO("2023-07-28T02:00:00") },
                { pos: 2, updatedAt: parseISO("2023-07-31T00:00:00") },
                { pos: 2, updatedAt: parseISO("2023-07-28T00:00:00") },
            ] as PageTreeNodeInterface[];

            expect(
                sortPreloadedNodes(unsorted, [
                    { field: PageTreeNodeSortField.pos, direction: SortDirection.ASC },
                    { field: PageTreeNodeSortField.updatedAt, direction: SortDirection.DESC },
                ]),
            ).toEqual(sorted);
        });

        it("should sort first by updatedAt, then by position", () => {
            const unsorted = [
                { updatedAt: parseISO("2023-07-31T00:00:00"), pos: 2 },
                { updatedAt: parseISO("2023-07-28T00:00:00"), pos: 2 },
                { updatedAt: parseISO("2023-07-31T00:00:00"), pos: 1 },
                { updatedAt: parseISO("2023-07-28T00:00:00"), pos: 1 },
            ] as PageTreeNodeInterface[];

            const sorted = [
                { updatedAt: parseISO("2023-07-28T00:00:00"), pos: 1 },
                { updatedAt: parseISO("2023-07-28T00:00:00"), pos: 2 },
                { updatedAt: parseISO("2023-07-31T00:00:00"), pos: 1 },
                { updatedAt: parseISO("2023-07-31T00:00:00"), pos: 2 },
            ] as PageTreeNodeInterface[];

            expect(
                sortPreloadedNodes(unsorted, [
                    { field: PageTreeNodeSortField.updatedAt, direction: SortDirection.ASC },
                    { field: PageTreeNodeSortField.pos, direction: SortDirection.ASC },
                ]),
            ).toEqual(sorted);
        });
    });

    describe("paginateNodes", () => {
        describe("Nodes [1, 2, 3] with correct offset and limit options", () => {
            it("Should return [1] with offset 0 limit 1", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: 0,
                    limit: 1,
                };

                expect(paginateNodes(nodes, options)).toEqual([1]);
            });

            it("Should return [2, 3] with offset 1 limit 2", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: 1,
                    limit: 2,
                };

                expect(paginateNodes(nodes, options)).toEqual([2, 3]);
            });

            it("Should return empty array with offset 3 limit 1", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: 3,
                    limit: 1,
                };

                expect(paginateNodes(nodes, options)).toEqual([]);
            });
        });

        describe("Nodes [1, 2, 3] with incorrect offset and limit options", () => {
            it("Should return [1, 2, 3] with offset undefined limit 1", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: undefined,
                    limit: 1,
                };

                expect(paginateNodes(nodes, options)).toEqual(nodes);
            });

            it("Should return [1, 2, 3] with offset 0 limit undefined", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: 0,
                    limit: undefined,
                };

                expect(paginateNodes(nodes, options)).toEqual(nodes);
            });

            it("Should return [1, 2, 3] with offset undefined limit undefined", () => {
                const nodes = [1, 2, 3];

                expect(paginateNodes(nodes, {})).toEqual(nodes);
            });

            it("Should return [1, 2, 3] with offset -1 limit 2", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: -1,
                    limit: 2,
                };

                expect(paginateNodes(nodes, options)).toEqual(nodes);
            });

            it("Should return [1, 2, 3] with offset 1 limit -1", () => {
                const nodes = [1, 2, 3];
                const options = {
                    offset: 1,
                    limit: -1,
                };

                expect(paginateNodes(nodes, options)).toEqual(nodes);
            });
        });
    });
});
