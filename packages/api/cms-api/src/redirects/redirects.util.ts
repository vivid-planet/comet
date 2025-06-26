import { type BooleanFilter } from "../common/filter/boolean.filter";
import { type DateTimeFilter } from "../common/filter/date-time.filter";
import { type StringFilter } from "../common/filter/string.filter";
import { type RedirectFilter } from "./dto/redirects.filter";
import { type RedirectInterface } from "./entities/redirect-entity.factory";

export type FilterableRedirect = Pick<RedirectInterface, "generationType" | "source" | "active" | "createdAt" | "updatedAt"> & { target?: string };

export function redirectMatchesFilter(redirect: FilterableRedirect, filter: RedirectFilter): boolean {
    let matches: boolean | undefined;

    if (isEmptyFilter(filter)) {
        matches = true;
    }

    if (filter.generationType) {
        matches = stringMatchesFilter(redirect.generationType, filter.generationType);
    }

    if (filter.source) {
        matches = stringMatchesFilter(redirect.source, filter.source);
    }

    if (filter.target) {
        if (redirect.target) {
            const isAbsoluteUrl = redirect.target.startsWith("http://") || redirect.target.startsWith("https://");

            if (isAbsoluteUrl) {
                const url = new URL(redirect.target);
                matches = stringMatchesFilter(redirect.target, filter.target) || stringMatchesFilter(url.pathname, filter.target);
            } else {
                matches = stringMatchesFilter(redirect.target, filter.target);
            }
        } else {
            matches = false;
        }
    }

    if (filter.active) {
        matches = booleanMatchesFilter(redirect.active, filter.active);
    }

    if (filter.createdAt) {
        matches = dateTimeMatchesFilter(redirect.createdAt, filter.createdAt);
    }

    if (filter.updatedAt) {
        matches = dateTimeMatchesFilter(redirect.updatedAt, filter.updatedAt);
    }

    if (filter.and) {
        if (matches === undefined) {
            matches = filter.and.every((subFilter) => redirectMatchesFilter(redirect, subFilter));
        } else {
            matches = matches && filter.and.every((subFilter) => redirectMatchesFilter(redirect, subFilter));
        }
    }

    if (filter.or) {
        if (matches !== true) {
            if (filter.or.length > 0) {
                matches = filter.or.some((subFilter) => redirectMatchesFilter(redirect, subFilter));
            } else {
                matches = true;
            }
        }
    }

    return matches ?? false;
}

function stringMatchesFilter(string: string, filter: StringFilter) {
    if (filter.contains && string.includes(filter.contains)) {
        return true;
    } else if (filter.doesNotContain && !string.includes(filter.doesNotContain)) {
        return true;
    } else if (filter.startsWith && string.startsWith(filter.startsWith)) {
        return true;
    } else if (filter.endsWith && string.endsWith(filter.endsWith)) {
        return true;
    } else if (filter.equal && string === filter.equal) {
        return true;
    } else if (filter.notEqual && string !== filter.notEqual) {
        return true;
    } else if (filter.isAnyOf && filter.isAnyOf.includes(string)) {
        return true;
    }

    return false;
}

function booleanMatchesFilter(boolean: boolean, filter: BooleanFilter) {
    if (filter.equal && boolean === filter.equal) {
        return true;
    }

    return false;
}

function dateTimeMatchesFilter(date: Date, filter: DateTimeFilter) {
    if (filter.equal && date.getTime() === filter.equal.getTime()) {
        return true;
    } else if (filter.lowerThan && date.getTime() < filter.lowerThan.getTime()) {
        return true;
    } else if (filter.greaterThan && date.getTime() > filter.greaterThan.getTime()) {
        return true;
    } else if (filter.lowerThanEqual && date.getTime() <= filter.lowerThanEqual.getTime()) {
        return true;
    } else if (filter.greaterThanEqual && date.getTime() >= filter.greaterThanEqual.getTime()) {
        return true;
    } else if (filter.notEqual && date.getTime() !== filter.notEqual.getTime()) {
        return true;
    }

    return false;
}

export function isEmptyFilter(filter: RedirectFilter): boolean {
    const filters = Object.keys(filter);

    return (
        filters.length === 0 ||
        (filters.length === 1 && filter.and !== undefined && filter.and.length === 0) ||
        (filters.length === 1 && filter.or !== undefined && filter.or.length === 0)
    );
}
