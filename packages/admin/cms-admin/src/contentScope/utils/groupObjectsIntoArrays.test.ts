import { groupObjectsIntoArrays } from "./groupObjectsIntoArrays";

describe("groupObjectsIntoArrays", () => {
    it("should group objects with the same keys into arrays", () => {
        const input: Record<string, any>[] = [{ a: 1, b: 2 }, { a: 1, b: 3 }, { c: 2, a: 3 }, { c: 4 }];
        const expectedOutput = [
            [
                { a: 1, b: 2 },
                { a: 1, b: 3 },
            ],
            [{ c: 2, a: 3 }],
            [{ c: 4 }],
        ];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should handle an empty array", () => {
        const input: Record<string, any>[] = [];
        const expectedOutput: Record<string, any>[] = [];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should handle an array with one object", () => {
        const input: Record<string, any>[] = [{ a: 1 }];
        const expectedOutput: Record<string, any>[] = [[{ a: 1 }]];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should group objects with different keys separately", () => {
        const input: Record<string, any>[] = [{ a: 1 }, { b: 2 }, { c: 3 }];
        const expectedOutput: Record<string, any>[] = [[{ a: 1 }], [{ b: 2 }], [{ c: 3 }]];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should group objects with the same keys but different values into the same array", () => {
        const input: Record<string, any>[] = [{ a: 1 }, { a: 2 }, { a: 3 }];
        const expectedOutput: Record<string, any>[] = [[{ a: 1 }, { a: 2 }, { a: 3 }]];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });
});
