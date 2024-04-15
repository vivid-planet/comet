import { format } from "date-fns";

export const defaultMinDate = new Date();
defaultMinDate.setFullYear(defaultMinDate.getFullYear() - 120);

export const defaultMaxDate = new Date();
defaultMaxDate.setFullYear(defaultMaxDate.getFullYear() + 40);

export const getIsoDateString = (date: Date) => {
    return format(date, "yyyy-MM-dd");
};
