import { type EntityMetadata, type FilterValue, type ObjectQuery, type OrderDefinition, raw } from "@mikro-orm/postgresql";

import { type CrudSearchField, getCrudSearchFieldsFromMetadata } from "../helper/crud-generator.helper";
import { type SortDirection } from "../sorting/sort-direction.enum";
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
export function applyFilterToMikroOrmQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc: ObjectQuery<any>,
    filterProperty:
        | StringFilter
        | NumberFilter
        | DateTimeFilter
        | DateFilter
        | BooleanFilter
        | ManyToOneFilter
        | OneToManyFilter
        | ManyToManyFilter
        | EnumFilterInterface<unknown>
        | EnumsFilterInterface<unknown>
        | IdFilter,
    propertyName: string,
    metadata?: EntityMetadata,
): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const propertyQuery: FilterValue<any> = {};
    if (filterProperty instanceof StringFilter) {
        const ilike: string[] = [];
        if (filterProperty.contains !== undefined) {
            ilike.push(`%${quoteLike(filterProperty.contains)}%`);
        }
        if (filterProperty.notContains !== undefined) {
            const condition = { [propertyName]: { $ilike: `%${quoteLike(filterProperty.notContains)}%` } };
            if (acc.$not) {
                // there is already a $not condition, combine them
                if (acc.$not.$and) {
                    //add to existing $and array
                    acc.$not.$and.push(condition);
                } else {
                    //create $and array with existing and new condition
                    acc.$not = { $and: [acc.$not, condition] };
                }
            } else {
                acc.$not = condition;
            }
        }
        if (filterProperty.startsWith !== undefined) {
            ilike.push(`${quoteLike(filterProperty.startsWith)}%`);
        }
        if (filterProperty.endsWith !== undefined) {
            ilike.push(`%${quoteLike(filterProperty.endsWith)}`);
        }
        if (ilike.length === 1) {
            propertyQuery.$ilike = ilike[0];
        } else if (ilike.length > 1) {
            acc.$and = [
                ...(acc.$and || []),
                ...ilike.map((i) => {
                    return {
                        [propertyName]: { $ilike: i },
                    };
                }),
            ];
        }
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            propertyQuery.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
        if (filterProperty.isEmpty) {
            acc.$and = [...(acc.$and || []), { $or: [{ [propertyName]: { $eq: null } }, { [propertyName]: { $eq: "" } }] }];
        }
        if (filterProperty.isNotEmpty) {
            acc.$and = [...(acc.$and || []), { [propertyName]: { $ne: null } }, { [propertyName]: { $ne: "" } }];
        }
    } else if (filterProperty instanceof NumberFilter) {
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
        if (filterProperty.lowerThan !== undefined) {
            propertyQuery.$lt = filterProperty.lowerThan;
        }
        if (filterProperty.greaterThan !== undefined) {
            propertyQuery.$gt = filterProperty.greaterThan;
        }
        if (filterProperty.lowerThanEqual !== undefined) {
            propertyQuery.$lte = filterProperty.lowerThanEqual;
        }
        if (filterProperty.greaterThanEqual !== undefined) {
            propertyQuery.$gte = filterProperty.greaterThanEqual;
        }
        if (filterProperty.notEqual !== undefined) {
            propertyQuery.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
        if (filterProperty.isEmpty) {
            propertyQuery.$eq = null;
        }
        if (filterProperty.isNotEmpty) {
            propertyQuery.$ne = null;
        }
    } else if (filterProperty instanceof DateTimeFilter || filterProperty instanceof DateFilter) {
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
        if (filterProperty.lowerThan !== undefined) {
            propertyQuery.$lt = filterProperty.lowerThan;
        }
        if (filterProperty.greaterThan !== undefined) {
            propertyQuery.$gt = filterProperty.greaterThan;
        }
        if (filterProperty.lowerThanEqual !== undefined) {
            propertyQuery.$lte = filterProperty.lowerThanEqual;
        }
        if (filterProperty.greaterThanEqual !== undefined) {
            propertyQuery.$gte = filterProperty.greaterThanEqual;
        }
        if (filterProperty.notEqual !== undefined) {
            propertyQuery.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isEmpty) {
            propertyQuery.$eq = null;
        }
        if (filterProperty.isNotEmpty) {
            propertyQuery.$ne = null;
        }
    } else if (filterProperty instanceof BooleanFilter) {
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
    } else if (filterProperty instanceof ManyToOneFilter) {
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            propertyQuery.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
        if ("filter" in filterProperty && filterProperty.filter !== undefined) {
            const propertyMetadata = metadata?.props.find((prop) => prop.name === propertyName)?.targetMeta;
            for (const [key, value] of Object.entries(filtersToMikroOrmQuery(filterProperty.filter, { metadata: propertyMetadata }))) {
                if (key === "$not") {
                    const condition = { [propertyName]: value };
                    // mikro-orm does not support nested $not, it has to be on the root level
                    if (acc.$not) {
                        //don't overwrite existing $not
                        acc.$and = [...(acc.$and || []), { $not: condition }];
                    } else {
                        acc.$not = condition;
                    }
                } else {
                    propertyQuery[key] = value;
                }
            }
        }
    } else if (filterProperty instanceof OneToManyFilter) {
        if (filterProperty.contains !== undefined) {
            propertyQuery.id = {
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
            acc.$and = [
                ...(acc.$and || []),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...searchToMikroOrmQuery(filterProperty.search, prop.targetMeta).$and!.map((item) => ({ [propertyName]: item })),
            ];
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
        if ("filter" in filterProperty && filterProperty.filter !== undefined) {
            const propertyMetadata = metadata?.props.find((prop) => prop.name === propertyName)?.targetMeta;
            for (const [key, value] of Object.entries(filtersToMikroOrmQuery(filterProperty.filter, { metadata: propertyMetadata }))) {
                if (key === "$not") {
                    const condition = { [propertyName]: value };
                    // mikro-orm does not support nested $not, it has to be on the root level
                    if (acc.$not) {
                        //don't overwrite existing $not
                        acc.$and = [...(acc.$and || []), { $not: condition }];
                    } else {
                        acc.$not = condition;
                    }
                } else {
                    propertyQuery[key] = value;
                }
            }
        }
    } else if (filterProperty instanceof ManyToManyFilter) {
        if (filterProperty.contains !== undefined) {
            propertyQuery.id = {
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
            acc.$and = [
                ...(acc.$and || []),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...searchToMikroOrmQuery(filterProperty.search, prop.targetMeta).$and!.map((item) => ({ [propertyName]: item })),
            ];
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
        if ("filter" in filterProperty && filterProperty.filter !== undefined) {
            const propertyMetadata = metadata?.props.find((prop) => prop.name === propertyName)?.targetMeta;
            for (const [key, value] of Object.entries(filtersToMikroOrmQuery(filterProperty.filter, { metadata: propertyMetadata }))) {
                if (key === "$not") {
                    const condition = { [propertyName]: value };
                    // mikro-orm does not support nested $not, it has to be on the root level
                    if (acc.$not) {
                        //don't overwrite existing $not
                        acc.$and = [...(acc.$and || []), { $not: condition }];
                    } else {
                        acc.$not = condition;
                    }
                } else {
                    propertyQuery[key] = value;
                }
            }
        }
    } else if (filterProperty instanceof IdFilter) {
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            propertyQuery.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
    } else if (isEnumFilter(filterProperty)) {
        if (filterProperty.equal !== undefined) {
            propertyQuery.$eq = filterProperty.equal;
        }
        if (filterProperty.notEqual !== undefined) {
            propertyQuery.$ne = filterProperty.notEqual;
        }
        if (filterProperty.isAnyOf !== undefined) {
            propertyQuery.$in = filterProperty.isAnyOf;
        }
    } else if (isEnumsFilter(filterProperty)) {
        if (filterProperty.contains !== undefined) {
            propertyQuery.$contains = filterProperty.contains;
        }
    } else {
        throw new Error(`Unsupported filter`);
    }
    if (Object.keys(propertyQuery).length > 0) {
        acc[propertyName] = propertyQuery;
    }
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
                        applyFilterToMikroOrmQuery(acc, filterProperty, filterPropertyName, metadata);
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
export function searchToMikroOrmQuery(search: string, fieldsOrMetadata: Array<string | CrudSearchField> | EntityMetadata): ObjectQuery<any> {
    const fields = Array.isArray(fieldsOrMetadata)
        ? fieldsOrMetadata.map((field) => {
              if (typeof field === "string") {
                  return { name: field, needsCastToText: false };
              }

              return field;
          })
        : getCrudSearchFieldsFromMetadata(fieldsOrMetadata);
    const quotedSearchParts = splitSearchString(search);

    const ands = [];

    for (const quotedSearch of quotedSearchParts) {
        const ors = [];
        for (const field of fields) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const or: any = {};
            let nestedFilter = or;
            const fieldParts = field.name.split(".");
            const column = fieldParts.pop();
            if (column === undefined) {
                continue;
            }
            for (const fieldPart of fieldParts) {
                nestedFilter = nestedFilter[fieldPart] = {};
            }
            if (field.needsCastToText) {
                nestedFilter[raw((alias) => `${alias}."${column}"::text`)] = { $ilike: quotedSearch };
            } else {
                nestedFilter[column] = { $ilike: quotedSearch };
            }
            ors.push(or);
        }
        ands.push({ $or: ors });
    }
    return {
        $and: ands,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gqlArgsToMikroOrmQuery({ search, filter }: { search?: string; filter?: any }, metadata: EntityMetadata<any>): ObjectQuery<any> {
    const andFilters = [];

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

    return andFilters.length === 1 ? andFilters[0] : andFilters.length > 0 ? { $and: andFilters } : {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gqlSortToMikroOrmOrderBy(sort: Array<{ field: string; direction: SortDirection }>): OrderDefinition<any> {
    return sort.map((sortItem) => {
        const parts = sortItem.field.split("_");
        const direction = sortItem.direction;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return parts.reduceRight((acc: any, key, index) => {
            if (index === parts.length - 1) {
                return { [key]: direction };
            }
            return { [key]: acc };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {} as OrderDefinition<any>);
    });
}
