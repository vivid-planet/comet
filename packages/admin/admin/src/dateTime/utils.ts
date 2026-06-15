import { format, parse } from "date-fns";

export const getDateValue = (value: string | null | undefined): Date | null => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date value: ${value}`);
    }

    return date;
};

export const getIsoDateString = (date: Date) => {
    return format(date, "yyyy-MM-dd");
};

export const isValidDate = (date: Date) => {
    return !isNaN(date.getTime());
};

export const getTimeStringFromDate = (date: Date) => {
    return format(date, "HH:mm");
};

export const getDateFromTimeString = (value: string | null | undefined): Date | null => {
    if (!value) {
        return null;
    }

    const parsedDate = parse(value, "HH:mm", new Date());

    if (!isValidDate(parsedDate)) {
        throw new Error(`Invalid time value: "${value}", must be a 24h time in format HH:mm`);
    }

    return parsedDate;
};
