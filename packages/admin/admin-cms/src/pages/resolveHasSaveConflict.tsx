import { isAfter, parseISO } from "date-fns";

export function resolveHasSaveConflict(referenceDateAsString?: string, newDateAsString?: string): boolean {
    if (referenceDateAsString != null && newDateAsString != null) {
        const referenceDate = parseISO(referenceDateAsString);
        const newDate = parseISO(newDateAsString);
        return isAfter(newDate, referenceDate);
    }
    return false;
}
