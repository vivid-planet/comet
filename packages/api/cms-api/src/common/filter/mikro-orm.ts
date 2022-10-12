import { FilterQuery, ObjectQuery } from "@mikro-orm/core";

import { BooleanFilter } from "./boolean.filter";
import { DateFilter } from "./date.filter";
import { NumberFilter } from "./number.filter";
import { StringFilter } from "./string.filter";

function quoteLike(string: string): string {
    return string.replace(/([%_\\])/g, "\\$1");
}
export function filterToMikroOrmQuery(
    filterProperty: StringFilter | NumberFilter | DateFilter | BooleanFilter,
    propertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): FilterQuery<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret: FilterQuery<any> = {};
    if (filterProperty instanceof StringFilter) {
        const ilike: string[] = [];
        if (filterProperty.contains !== undefined) {
            ilike.push(`%${quoteLike(filterProperty.contains)}%`);
        }
        if (filterProperty.startsWith !== undefined) {
            ilike.push(`${quoteLike(filterProperty.startsWith)}%`);
        }
        if (filterProperty.endsWith !== undefined) {
            ilike.push(`%${quoteLike(filterProperty.endsWith)}`);
        }
        if (ilike.length === 1) {
            ret.$ilike = ilike[0];
        } else if (ilike.length > 1) {
            ret.$and = ilike.map((i) => {
                return {
                    [propertyName]: { $ilike: i },
                };
            });
        }
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            ret.$ne = filterProperty.notEqual;
        }
    } else if (filterProperty instanceof NumberFilter) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.lowerThan !== undefined) {
            ret.$lt = filterProperty.lowerThan;
        }
        if (filterProperty.geraterThan !== undefined) {
            ret.$gt = filterProperty.geraterThan;
        }
        if (filterProperty.lowerThanEqual !== undefined) {
            ret.$lte = filterProperty.lowerThanEqual;
        }
        if (filterProperty.greaterThanEqual !== undefined) {
            ret.$gte = filterProperty.greaterThanEqual;
        }
        if (filterProperty.notEqual !== undefined) {
            ret.$ne = filterProperty.notEqual;
        }
    } else if (filterProperty instanceof DateFilter) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.lowerThan !== undefined) {
            ret.$lt = filterProperty.lowerThan;
        }
        if (filterProperty.geraterThan !== undefined) {
            ret.$gt = filterProperty.geraterThan;
        }
        if (filterProperty.lowerThanEqual !== undefined) {
            ret.$lte = filterProperty.lowerThanEqual;
        }
        if (filterProperty.greaterThanEqual !== undefined) {
            ret.$gte = filterProperty.greaterThanEqual;
        }
        if (filterProperty.notEqual !== undefined) {
            ret.$ne = filterProperty.notEqual;
        }
    } else if (filterProperty instanceof BooleanFilter) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
    } else {
        throw new Error(`Unsupported filter`);
    }
    return ret;
}

export function filtersToMikroOrmQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyFilter?: (acc: ObjectQuery<any>, filterValue: StringFilter | NumberFilter | DateFilter | BooleanFilter | unknown, filterKey: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ObjectQuery<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const genericFilter = (filter: any): FilterQuery<any> => {
        return Object.keys(filter).reduce((acc, filterPropertyName) => {
            if (filterPropertyName == "and") {
                if (filter.and) {
                    acc.$and = filter.and.map(genericFilter);
                }
            } else if (filterPropertyName == "or") {
                if (filter.or) {
                    acc.$or = filter.or.map(genericFilter);
                }
            } else {
                const filterProperty = filter[filterPropertyName];
                if (filterProperty) {
                    if (applyFilter) {
                        applyFilter(acc, filterProperty, filterPropertyName);
                    } else {
                        const query = filterToMikroOrmQuery(filterProperty, filterPropertyName);
                        if (Object.keys(query).length > 0) {
                            acc[filterPropertyName] = query;
                        }
                    }
                }
            }
            return acc;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {} as ObjectQuery<any>);
    };
    return genericFilter(filter);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchToMikroOrmQuery(search: string, fields: string[]): ObjectQuery<any> {
    const quotedSearch = search.replace(/([%_\\])/g, "\\$1");
    return {
        $or: fields.map((field) => {
            return {
                [field]: { $ilike: `%${quotedSearch}%` },
            };
        }),
    };
}
