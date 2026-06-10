import { describe, expect, it } from "vitest";

import { resolveHasSaveConflict } from "../resolveHasSaveConflict";

describe("resolveHasSaveConflict", () => {
    it("should return false when referenceDate is undefined", () => {
        expect(resolveHasSaveConflict(undefined, "2024-01-01T10:00:01.000Z")).toBe(false);
    });

    it("should return false when newDate is undefined", () => {
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.000Z", undefined)).toBe(false);
    });

    it("should return false when both dates are undefined", () => {
        expect(resolveHasSaveConflict(undefined, undefined)).toBe(false);
    });

    it("should return true when newDate is clearly after referenceDate", () => {
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.000Z", "2024-01-01T10:00:02.000Z")).toBe(true);
    });

    it("should return false when newDate is before referenceDate", () => {
        expect(resolveHasSaveConflict("2024-01-01T10:00:02.000Z", "2024-01-01T10:00:00.000Z")).toBe(false);
    });

    it("should return false when both dates are equal", () => {
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.000Z", "2024-01-01T10:00:00.000Z")).toBe(false);
    });

    it("should return false when both dates fall within the same second after rounding", () => {
        // Both round down to 10:00:00 → same second → no conflict
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.100Z", "2024-01-01T10:00:00.200Z")).toBe(false);
    });

    it("should return false when both dates round up to the same second", () => {
        // Both have ≥500ms → both round up to 10:00:01 → no conflict
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.500Z", "2024-01-01T10:00:00.800Z")).toBe(false);
    });

    it("should return true when referenceDate rounds down but newDate rounds up to the next second", () => {
        // referenceDate: 499ms < 500 → rounds to 10:00:00
        // newDate:       500ms ≥ 500 → rounds up to 10:00:01
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.499Z", "2024-01-01T10:00:00.500Z")).toBe(true);
    });

    it("should return false when newDate rounds down but referenceDate rounds up to the next second", () => {
        // referenceDate: 500ms ≥ 500 → rounds up to 10:00:01
        // newDate:       499ms < 500 → rounds to 10:00:00
        expect(resolveHasSaveConflict("2024-01-01T10:00:00.500Z", "2024-01-01T10:00:00.499Z")).toBe(false);
    });
});
