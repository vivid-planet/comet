import { ContentScopeValues } from "../Provider";
import { groupObjectsIntoArrays } from "./groupObjectsIntoArrays";

describe("groupObjectsIntoArrays", () => {
    it("should group objects with the same keys into arrays", () => {
        const input = [
            { domain: { value: "main" }, language: { label: "EN", value: "en" } },
            { domain: { value: "secondary" }, language: { label: "EN", value: "en" } },
            { country: { label: "Country", value: "us" }, domain: { value: "third" } },
            { country: { label: "Country", value: "us" } },
        ] as ContentScopeValues;
        const expectedOutput = [
            [
                { domain: { value: "main" }, language: { label: "EN", value: "en" } },
                { domain: { value: "secondary" }, language: { label: "EN", value: "en" } },
            ],
            [{ country: { label: "Country", value: "us" }, domain: { value: "third" } }],
            [{ country: { label: "Country", value: "us" } }],
        ];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should handle an empty array", () => {
        const input: [] = [];
        const expectedOutput: [] = [];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should handle an array with one object", () => {
        const input = [{ domain: { value: "main" }, language: { label: "EN", value: "en" } }];
        const expectedOutput = [[{ domain: { value: "main" }, language: { label: "EN", value: "en" } }]];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should group objects with different keys separately", () => {
        const input = [
            { domain: { value: "main" }, language: { label: "EN", value: "en" } },
            { country: { label: "Country", value: "us" } },
            { language: { value: "DE" } },
        ] as ContentScopeValues;
        const expectedOutput = [
            [{ domain: { value: "main" }, language: { label: "EN", value: "en" } }],
            [{ country: { label: "Country", value: "us" } }],
            [{ language: { value: "DE" } }],
        ];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });

    it("should group objects with the same keys but different values into the same array", () => {
        const input = [
            { domain: { value: "main" }, language: { label: "EN", value: "en" } },
            { domain: { value: "secondary" }, language: { label: "DE", value: "de" } },
            { domain: { value: "third" }, language: { label: "ES", value: "es" } },
        ];
        const expectedOutput = [
            [
                { domain: { value: "main" }, language: { label: "EN", value: "en" } },
                { domain: { value: "secondary" }, language: { label: "DE", value: "de" } },
                { domain: { value: "third" }, language: { label: "ES", value: "es" } },
            ],
        ];
        expect(groupObjectsIntoArrays(input)).toEqual(expectedOutput);
    });
});
