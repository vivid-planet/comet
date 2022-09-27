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
        if (filterProperty.eq !== undefined) {
            ret.$eq = filterProperty.eq;
        }
        if (filterProperty.neq !== undefined) {
            ret.$ne = filterProperty.neq;
        }
    } else if (filterProperty instanceof NumberFilter) {
        if (filterProperty.eq !== undefined) {
            ret.$eq = filterProperty.eq;
        }
        if (filterProperty.lt !== undefined) {
            ret.$lt = filterProperty.lt;
        }
        if (filterProperty.gt !== undefined) {
            ret.$gt = filterProperty.gt;
        }
        if (filterProperty.lte !== undefined) {
            ret.$lte = filterProperty.lte;
        }
        if (filterProperty.gte !== undefined) {
            ret.$gte = filterProperty.gte;
        }
        if (filterProperty.neq !== undefined) {
            ret.$ne = filterProperty.neq;
        }
    } else if (filterProperty instanceof DateFilter) {
        if (filterProperty.eq !== undefined) {
            ret.$eq = filterProperty.eq;
        }
        if (filterProperty.lt !== undefined) {
            ret.$lt = filterProperty.lt;
        }
        if (filterProperty.gt !== undefined) {
            ret.$gt = filterProperty.gt;
        }
        if (filterProperty.lte !== undefined) {
            ret.$lte = filterProperty.lte;
        }
        if (filterProperty.gte !== undefined) {
            ret.$gte = filterProperty.gte;
        }
        if (filterProperty.neq !== undefined) {
            ret.$ne = filterProperty.neq;
        }
    } else if (filterProperty instanceof BooleanFilter) {
        if (filterProperty.eq !== undefined) {
            ret.$eq = filterProperty.eq;
        }
    } else {
        throw new Error(`Unsupported filter`);
    }
    return ret;
}

export function mikroOrmFilter(
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
                        acc[filterPropertyName] = filterToMikroOrmQuery(filterProperty, filterPropertyName);
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
export function mikroOrmQueryFields(query: string, fields: string[]): ObjectQuery<any> {
    const quotedQuery = query.replace(/([%_\\])/g, "\\$1");
    return {
        $or: fields.map((field) => {
            return {
                [field]: { $ilike: `%${quotedQuery}%` },
            };
        }),
    };
}
