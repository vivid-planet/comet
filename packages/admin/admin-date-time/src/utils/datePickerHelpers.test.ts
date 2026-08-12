import { describe, expect, it } from "vitest";

import { defaultMaxDate, defaultMinDate, getIsoDateString } from "./datePickerHelpers";

describe("getIsoDateString", () => {
    it("formats a date as yyyy-MM-dd", () => {
        expect(getIsoDateString(new Date(2023, 5, 15))).toBe("2023-06-15");
    });

    it("zero-pads month and day", () => {
        expect(getIsoDateString(new Date(2023, 0, 5))).toBe("2023-01-05");
    });

    it("uses the local date, not the UTC date", () => {
        // 23:30 local time is already the next day in UTC for positive offsets.
        expect(getIsoDateString(new Date(2023, 5, 15, 23, 30))).toBe("2023-06-15");
    });
});

describe("default date bounds", () => {
    it("spans from 120 years in the past to 40 years in the future", () => {
        const currentYear = new Date().getFullYear();

        expect(defaultMinDate.getFullYear()).toBe(currentYear - 120);
        expect(defaultMaxDate.getFullYear()).toBe(currentYear + 40);
    });
});
