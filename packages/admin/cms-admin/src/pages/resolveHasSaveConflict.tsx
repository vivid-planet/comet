import { addSeconds, isAfter, parseISO, startOfSecond } from "date-fns";

export function resolveHasSaveConflict(referenceDateAsString?: string, newDateAsString?: string): boolean {
    if (referenceDateAsString != null && newDateAsString != null) {
        const referenceDate =
            parseISO(referenceDateAsString).getMilliseconds() < 500
                ? startOfSecond(parseISO(referenceDateAsString))
                : startOfSecond(addSeconds(parseISO(referenceDateAsString), 1));
        const newDate =
            parseISO(newDateAsString).getMilliseconds() < 500
                ? startOfSecond(parseISO(newDateAsString))
                : startOfSecond(addSeconds(parseISO(newDateAsString), 1));

        return isAfter(newDate, referenceDate);
    }
    return false;
}
