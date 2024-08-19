import { GridFilterModel } from "@mui/x-data-grid";

import { GridColDef } from "./GridColDef";

const muiGridOperatorValueToGqlOperator: { [key: string]: string } = {
    contains: "contains",
    equals: "equal",
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
type GqlFilter = {
    [key: string]: GqlStringFilter | GqlNumberFilter; //TODO add Boolean, Date, DateTime(?), SingleSelect(??)
} & {
    and?: GqlFilter[] | null;
    or?: GqlFilter[] | null;
};

function convertValueByType(value: any, type?: string) {
    if (type === "number") {
        return parseFloat(value);
    } else if (type === "boolean") {
        if (value === "true") return true;
        if (value === "false") return false;
        return undefined;
    } else {
        return value;
    }
}

export function muiGridFilterToGql(columns: GridColDef[], filterModel?: GridFilterModel): { filter: GqlFilter; search?: string } {
    if (!filterModel) return { filter: {} };
    const filterItems = filterModel.items
        .filter((filterItem) => filterItem.value !== undefined)
        .map((filterItem) => {
            if (!filterItem.operatorValue) throw new Error("operaturValue not set");
            const gqlOperator = muiGridOperatorValueToGqlOperator[filterItem.operatorValue] || filterItem.operatorValue;
            const column = columns.find((i) => i.field == filterItem.columnField);
            const convertedValue = convertValueByType(filterItem.value, column?.type);
            return {
                [filterItem.columnField]: {
                    [gqlOperator]: convertedValue,
                } as GqlStringFilter | GqlNumberFilter,
            };
        });
    const filter: GqlFilter = {};
    const op: "and" | "or" = filterModel.linkOperator ?? "and";
    filter[op] = filterItems;

    let search: undefined | string = undefined;

    if (filterModel.quickFilterValues) {
        search = filterModel.quickFilterValues.join(" ");
    }

    return { filter, search };
}
