import { type GridFilterItem, type GridFilterModel } from "@mui/x-data-grid";

import { type GridColDef } from "./GridColDef";

const muiGridOperatorValueToGqlOperator: { [key: string]: string } = {
    contains: "contains",
    doesNotContain: "notContains",
    equals: "equal",
    doesNotEqual: "notEqual",
    ">": "greaterThan",
    ">=": "greaterThanEqual",
    "<": "lowerThan",
    "<=": "lowerThanEqual",
    "=": "equal",
    "!=": "notEqual",
    startsWith: "startsWith",
    endsWith: "endsWith",
    isAnyOf: "isAnyOf",
    isEmpty: "isEmpty",
    isNotEmpty: "isNotEmpty",
    is: "equal",
    not: "notEqual",
    after: "greaterThan",
    onOrAfter: "greaterThanEqual",
    before: "lowerThan",
    onOrBefore: "lowerThanEqual",
};

interface GqlStringFilter {
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
    equal?: string | null;
    notEqual?: string | null;
}
interface GqlNumberFilter {
    equal?: number | null;
    lowerThan?: number | null;
    greaterThan?: number | null;
    lowerThanEqual?: number | null;
    greaterThanEqual?: number | null;
    notEqual?: number | null;
}
export type GqlFilter = {
    [key: string]: GqlStringFilter | GqlNumberFilter; //TODO add Boolean, Date, DateTime(?), SingleSelect(??)
} & {
    and?: GqlFilter[] | null;
    or?: GqlFilter[] | null;
};

/**
 * Use this callback to add custom mui-grid-filter-to-gql-filter conversion logic. If for example your gql filter
 * does not need the field name, you need some more complex structure.
   @return
   + `false` to fall back to default conversion,
   + `undefined` to skip this filter item,
   + custom GqlFilter object, joining the other filter objects with the selected logic operator
 */
export type ConvertCustomFilterCallback = (
    filterItem: GridFilterItem,
    columns: GridColDef[],
    filterModel?: GridFilterModel,
) => GqlFilter | false | undefined;

export function muiGridFilterToGql(
    columns: GridColDef[],
    filterModel?: GridFilterModel,
    convertCustomFilter?: ConvertCustomFilterCallback,
): { filter: GqlFilter; search?: string } {
    if (!filterModel) return { filter: {} };
    const filterItems = filterModel.items.map((filterItem) => {
        if (convertCustomFilter) {
            const customFilter = convertCustomFilter(filterItem, columns, filterModel);
            if (customFilter) return customFilter;
        }
        if (!filterItem.operator) throw new Error("operator not set");
        const gqlOperator = muiGridOperatorValueToGqlOperator[filterItem.operator] || filterItem.operator;
        const value = ["isEmpty", "isNotEmpty"].includes(gqlOperator) ? true : filterItem.value;
        return {
            [filterItem.field]: {
                [gqlOperator]: value,
            } as GqlStringFilter | GqlNumberFilter,
        };
    });
    const filter: GqlFilter = {};
    const op: "and" | "or" = filterModel.logicOperator ?? "and";
    filter[op] = filterItems.filter((item) => item !== undefined);

    let search: undefined | string = undefined;

    if (filterModel.quickFilterValues) {
        search = filterModel.quickFilterValues.join(" ");
    }

    return { filter, search };
}
