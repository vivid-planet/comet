import { format } from "date-fns";

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

export const getDateTimeValue = (value: string | null | undefined): Date | null => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date-time value: ${value}`);
    }

    return date;
};

export const getIsoDateTimeString = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm"); // TODO: Does this differ from the current DateTimePicker?
};
