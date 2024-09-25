import { parseAspectRatio } from "./Image";

describe("Image: parseAspectRatio", () => {
    it("should throw Error if invalid value", () => {
        try {
            expect(parseAspectRatio("xy")).toThrowError();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            expect(error.message).toBe("An error occurred while parsing the aspect ratio: xy");
        }
    });
    it("should work with single integer value", () => {
        expect(parseAspectRatio(4)).toBeCloseTo(4 / 1);
    });
    it("should work with single float value", () => {
        expect(parseAspectRatio(4.5)).toBeCloseTo(4.5 / 1);
    });
    it("should work with single string value", () => {
        expect(parseAspectRatio("4")).toBeCloseTo(4 / 1);
    });
    it("should work with string value with x", () => {
        expect(parseAspectRatio("4x3")).toBeCloseTo(4 / 3);
    });
    it("should work with string value with /", () => {
        expect(parseAspectRatio("4/3")).toBeCloseTo(4 / 3);
    });
    it("should work with string value with :", () => {
        expect(parseAspectRatio("4:3")).toBeCloseTo(4 / 3);
    });
    it("should not work with Infinity", () => {
        try {
            expect(parseAspectRatio("Infinity")).toThrowError();
        } catch (error) {
            /* empty */
        }
    });
    it("should not work with -Infinity", () => {
        try {
            expect(parseAspectRatio(-Infinity)).toThrowError();
        } catch (error) {
            /* empty */
        }
    });
});
