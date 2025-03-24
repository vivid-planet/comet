import { type EntityMetadata, type EntityRepository, type FilterQuery, type ObjectQuery } from "@mikro-orm/postgresql";

import { getCrudSearchFieldsFromMetadata } from "../helper/crud-generator.helper";
import { BooleanFilter } from "./boolean.filter";
import { DateFilter } from "./date.filter";
import { DateTimeFilter } from "./date-time.filter";
import { type EnumFilterInterface, isEnumFilter } from "./enum.filter.factory";
import { type EnumsFilterInterface, isEnumsFilter } from "./enums.filter.factory";
import { IdFilter } from "./id.filter";
import { ManyToManyFilter } from "./many-to-many.filter";
import { ManyToOneFilter } from "./many-to-one.filter";
import { NumberFilter } from "./number.filter";
import { OneToManyFilter } from "./one-to-many.filter";
import { StringFilter } from "./string.filter";

function quoteLike(string: string): string {
    return string.replace(/([%_\\])/g, "\\$1");
}
export function filterToMikroOrmQuery(
    filterProperty:
        | StringFilter
        | NumberFilter
        | DateTimeFilter
        | DateFilter
        | BooleanFilter
        | EnumFilterInterface<unknown>
        | EnumsFilterInterface<unknown>
        | IdFilter,
    propertyName: string,
    metadata?: EntityMetadata,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): FilterQuery<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret: any = {};
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
        if (filterProperty.greaterThan !== undefined) {
            ret.$gt = filterProperty.greaterThan;
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
    } else if (filterProperty instanceof DateTimeFilter || filterProperty instanceof DateFilter) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.lowerThan !== undefined) {
            ret.$lt = filterProperty.lowerThan;
        }
        if (filterProperty.greaterThan !== undefined) {
            ret.$gt = filterProperty.greaterThan;
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
    } else if (filterProperty instanceof ManyToOneFilter) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            ret.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            ret.$in = filterProperty.isAnyOf;
        }
    } else if (filterProperty instanceof OneToManyFilter) {
        if (filterProperty.contains !== undefined) {
            ret.id = {
                $eq: filterProperty.contains,
            };
        } else if (filterProperty.search !== undefined) {
            if (!metadata) {
                throw new Error("Metadata required for search filter");
            }
            const prop = metadata.props.find((prop) => prop.name === propertyName);
            if (!prop) {
                throw new Error("Property not found");
            }
            if (prop.kind != "1:m") {
                throw new Error("Property is not a 1:m relation");
            }
            if (!prop.targetMeta) {
                throw new Error("targetMeta is not defined");
            }
            ret.$and = searchToMikroOrmQuery(filterProperty.search, prop.targetMeta).$and;
        }
    } else if (filterProperty instanceof ManyToManyFilter) {
        if (filterProperty.contains !== undefined) {
            ret.id = {
                $eq: filterProperty.contains,
            };
        } else if (filterProperty.search !== undefined) {
            if (!metadata) {
                throw new Error("Metadata required for search filter");
            }
            const prop = metadata.props.find((prop) => prop.name === propertyName);
            if (!prop) {
                throw new Error("Property not found");
            }
            if (prop.kind != "m:n") {
                throw new Error("Property is not a m:n relation");
            }
            if (!prop.targetMeta) {
                throw new Error("targetMeta is not defined");
            }
            ret.$and = searchToMikroOrmQuery(filterProperty.search, prop.targetMeta).$and;
        }
    } else if (filterProperty instanceof IdFilter) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            ret.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            ret.$in = filterProperty.isAnyOf;
        }
    } else if (isEnumFilter(filterProperty)) {
        if (filterProperty.equal !== undefined) {
            ret.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            ret.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            ret.$in = filterProperty.isAnyOf;
        }
    } else if (isEnumsFilter(filterProperty)) {
        if (filterProperty.contains !== undefined) {
            ret.$contains = filterProperty.contains;
        }
    } else {
        throw new Error(`Unsupported filter`);
    }
    return ret;
}

export function filtersToMikroOrmQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: any,
    {
        applyFilter,
        metadata,
    }: {
        applyFilter?: (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            acc: ObjectQuery<any>,
            filterValue: StringFilter | NumberFilter | DateTimeFilter | BooleanFilter | unknown,
            filterKey: string,
        ) => void;
        metadata?: EntityMetadata;
    } = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ObjectQuery<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const genericFilter = (filter: any): ObjectQuery<any> => {
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
                        const query = filterToMikroOrmQuery(filterProperty, filterPropertyName, metadata);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (Object.keys(query as any).length > 0) {
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

export const splitSearchString = (search: string) => {
    // regex to match all single tokens or quotes in a string => "This is a 'quoted string'" will result in ["This", "is", "a", "quoted string"]
    // it will also take escaped quotes (prepended with a backslash => \) into account
    const regex = /(["'])(?:(?=(\\?))\2.)*?\1|\S+/g;
    const matches = search.match(regex) || [];

    return matches.map((match) => {
        const unescaped = match.replace(/\\(['"])/g, "$1");
        const isQuoted = (unescaped.startsWith('"') && unescaped.endsWith('"')) || (unescaped.startsWith("'") && unescaped.endsWith("'"));
        const content = isQuoted ? unescaped.slice(1, -1) : unescaped;

        return `%${content.replace(/([%_\\])/g, "\\$1")}%`;
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchToMikroOrmQuery(search: string, fieldsOrMetadata: string[] | EntityMetadata): ObjectQuery<any> {
    const fields = Array.isArray(fieldsOrMetadata) ? fieldsOrMetadata : getCrudSearchFieldsFromMetadata(fieldsOrMetadata);
    const quotedSearchParts = splitSearchString(search);

    const ands = [];

    for (const quotedSearch of quotedSearchParts) {
        const ors = [];
        for (const field of fields) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const or: any = {};
            let nestedFilter = or;
            for (const fieldPart of field.split(".")) {
                nestedFilter = nestedFilter[fieldPart] = {};
            }
            nestedFilter.$ilike = quotedSearch;
            ors.push(or);
        }
        ands.push({ $or: ors });
    }
    return {
        $and: ands,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gqlArgsToMikroOrmQuery({ search, filter }: { search?: string; filter?: any }, repository: EntityRepository<any>): ObjectQuery<any> {
    const andFilters = [];

    const metadata = repository.getEntityManager().getMetadata().get(repository.getEntityName());
    if (search) {
        const crudSearchPropNames = getCrudSearchFieldsFromMetadata(metadata);
        if (crudSearchPropNames.length == 0) {
            throw new Error("Entity has no searchable fields");
        }
        andFilters.push(searchToMikroOrmQuery(search, crudSearchPropNames));
    }

    if (filter) {
        andFilters.push(filtersToMikroOrmQuery(filter, { metadata }));
    }

    return andFilters.length > 0 ? { $and: andFilters } : {};
}
