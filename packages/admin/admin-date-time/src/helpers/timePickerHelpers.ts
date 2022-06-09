const today = new Date();

export const getDateRangeListByMinuteStep = (startTimeValue: string, endTimeValue: string, minuteStep: number): Date[] => {
    const startDate = getDateFromTimeValue(startTimeValue);
    const endDate = getDateFromTimeValue(endTimeValue);

    if (endDate < startDate) {
        throw new Error("End date must be bigger than start date.");
    }

    const dateRangeList: Date[] = [];
    const endTime = endDate.getTime();
    let time = startDate.getTime();

    while (time <= endTime) {
        dateRangeList.push(new Date(time));
        time += minuteStep * 60 * 1000;
    }

    return dateRangeList;
};

const leadingZero = (val: number) => {
    return val < 10 ? `0${val}` : val;
};

export const getTimeValueFromDate = (date: Date): string => {
    return `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;
};

export const timeValueIsValid = (timeValue: string): boolean => {
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

export const getDateFromTimeValue = (timeValue: string): Date => {
    if (!timeValueIsValid(timeValue)) {
        throw new Error(`Time value ${timeValue} is not valid, must be in format HH:mm.`);
    }

    const [hour, minute] = timeValue.split(":");
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), Number(hour), Number(minute));
};

export const getClosestDateToNow = (dateList: Date[], target: Date = new Date()): Date => {
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
