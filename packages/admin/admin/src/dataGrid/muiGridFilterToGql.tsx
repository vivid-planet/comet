import { GridColDef, GridFilterModel } from "@mui/x-data-grid";

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

function convertValueByType(value: string, type?: string) {
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
        .filter((value) => value.value !== undefined)
        .map((value) => {
            if (!value.operatorValue) throw new Error("operaturValue not set");
            const gqlOperator = muiGridOperatorValueToGqlOperator[value.operatorValue];
            if (!gqlOperator) throw new Error(`unknown operator ${value.operatorValue}`);
            const column = columns.find((i) => i.field == value.columnField);
            const convertedValue = convertValueByType(value.value, column?.type);
            return {
                [value.columnField]: {
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
