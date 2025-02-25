import { capitalCase } from "change-case";

export function camelCaseToHumanReadable(s: string) {
    return capitalCase(s);
}
