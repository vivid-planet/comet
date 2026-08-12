import { describe, expect, it } from "vitest";

import {
    getClosestDateToDate,
    getDateFromTimeValue,
    getDateRangeListByMinuteStep,
    getDateWithNewTime,
    getTimeStringFromDate,
} from "./timePickerHelpers";

describe("getTimeStringFromDate", () => {
    it("formats a date as HH:mm", () => {
        expect(getTimeStringFromDate(new Date(2023, 5, 15, 14, 30))).toBe("14:30");
    });

    it("zero-pads hours and minutes", () => {
        expect(getTimeStringFromDate(new Date(2023, 5, 15, 9, 5))).toBe("09:05");
    });
});

describe("getDateWithNewTime", () => {
    it("applies the time to the given date", () => {
        const result = getDateWithNewTime(new Date(2023, 5, 15, 8, 0), "14:30");

        expect(getTimeStringFromDate(result)).toBe("14:30");
        expect(result.getFullYear()).toBe(2023);
        expect(result.getMonth()).toBe(5);
        expect(result.getDate()).toBe(15);
    });

    it("resets seconds and milliseconds", () => {
        const result = getDateWithNewTime(new Date(2023, 5, 15, 8, 0, 42, 123), "14:30");

        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it("does not mutate the passed date", () => {
        const date = new Date(2023, 5, 15, 8, 0);
        getDateWithNewTime(date, "14:30");

        expect(getTimeStringFromDate(date)).toBe("08:00");
    });
});

describe("getDateFromTimeValue", () => {
    it("returns a date with the given time", () => {
        expect(getTimeStringFromDate(getDateFromTimeValue("14:30"))).toBe("14:30");
    });

    it("accepts single-digit hours and minutes", () => {
        expect(getTimeStringFromDate(getDateFromTimeValue("9:5"))).toBe("09:05");
    });

    it.each(["", "1430", "abc", "24:00", "12:60"])("throws for the invalid time value %o", (timeValue) => {
        expect(() => getDateFromTimeValue(timeValue)).toThrow(`Time value ${timeValue} is not valid, must be in format HH:mm.`);
    });
});

describe("getDateRangeListByMinuteStep", () => {
    it("returns all times between start and end, including both bounds", () => {
        const dateList = getDateRangeListByMinuteStep("09:00", "11:00", 30);

        expect(dateList.map(getTimeStringFromDate)).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00"]);
    });

    it("stops before the end when the step does not divide the interval evenly", () => {
        const dateList = getDateRangeListByMinuteStep("09:00", "10:00", 45);

        expect(dateList.map(getTimeStringFromDate)).toEqual(["09:00", "09:45"]);
    });

    it("throws when the end time is before the start time", () => {
        expect(() => getDateRangeListByMinuteStep("11:00", "09:00", 30)).toThrow("End date must be bigger than start date.");
    });
});

describe("getClosestDateToDate", () => {
    it("returns the date closest to the target", () => {
        const dateList = getDateRangeListByMinuteStep("09:00", "11:00", 30);
        const closestDate = getClosestDateToDate(dateList, getDateFromTimeValue("10:20"));

        expect(getTimeStringFromDate(closestDate)).toBe("10:30");
    });

    it("keeps the earlier date when two dates are equally close", () => {
        const dateList = getDateRangeListByMinuteStep("09:00", "10:00", 30);
        const closestDate = getClosestDateToDate(dateList, getDateFromTimeValue("09:15"));

        expect(getTimeStringFromDate(closestDate)).toBe("09:00");
    });
});
