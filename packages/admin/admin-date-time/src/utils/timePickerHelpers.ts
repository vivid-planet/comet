import { eachMinuteOfInterval, format } from "date-fns";

const today = new Date();

export const getDateRangeListByMinuteStep = (startTimeValue: string, endTimeValue: string, minuteStep: number): Date[] => {
    const startDate = getDateFromTimeValue(startTimeValue);
    const endDate = getDateFromTimeValue(endTimeValue);

    if (endDate < startDate) {
        throw new Error("End date must be bigger than start date.");
    }

    return eachMinuteOfInterval({ start: startDate, end: endDate }, { step: minuteStep });
};

const timeValueIsValid = (timeValue: string): boolean => {
    if (!/^([0-9]?[0-9]):[0-9]?[0-9]$/.test(timeValue)) {
        return false;
    }

    const [hour, minute] = timeValue.split(":");

    if (Number(hour) > 23) {
        return false;
    }

    if (Number(minute) > 59) {
        return false;
    }

    return true;
};

export const getTimeStringFromDate = (date: Date): string => format(date, "HH:mm");

export const getDateWithNewTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
};

export const getDateFromTimeValue = (timeValue: string): Date => {
    if (!timeValueIsValid(timeValue)) {
        throw new Error(`Time value ${timeValue} is not valid, must be in format HH:mm.`);
    }

    const [hour, minute] = timeValue.split(":");
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), Number(hour), Number(minute));
};

export const getClosestDateToDate = (dateList: Date[], target: Date = new Date()): Date => {
    let closestDate: Date = dateList[0];
    const targetTime = target.getTime();

    dateList.forEach((date) => {
        const currentItemTime = date.getTime();

        if (Math.abs(targetTime - currentItemTime) < Math.abs(targetTime - closestDate.getTime())) {
            closestDate = date;
        }
    });

    return closestDate;
};
