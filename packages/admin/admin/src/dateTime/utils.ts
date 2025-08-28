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

export const isValidDate = (date: Date) => {
    return !isNaN(date.getTime());
};
