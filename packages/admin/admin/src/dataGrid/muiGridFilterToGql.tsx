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
interface GqlObjectFilter {
    //for onetomany
    contains?: object | null;
    notContains?: object | null;
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
    [key: string]: GqlStringFilter | GqlNumberFilter | GqlObjectFilter; //TODO add Boolean, Date, DateTime(?), SingleSelect(??)
} & {
    and?: GqlFilter[] | null; //TODO make more flexible?
    or?: GqlFilter[] | null;
};

function convertValueByType(value: string, type?: string) {
    //change val typing?
    if (type === "number") {
        return parseFloat(value);
    } else if (type === "boolean") {
        if (value === "true") return true;
        if (value === "false") return false;
        return undefined;
    } else if (type === "object") {
        // TODO value is object
    } else {
        return value;
    }
}

export function muiGridFilterToGql(columns: GridColDef[], filterModel?: GridFilterModel): { filter: GqlFilter; search?: string } {
    if (!filterModel) return { filter: {} };

    const filterItems = filterModel.items
        .filter((filterItem) => filterItem.value !== undefined)
        .map((filterItem) => {
            if (!filterItem.operatorValue) throw new Error("operatorValue not set");

            const gqlOperator: string[] = [];
            const convertedValues: string[] | number[] | boolean[] | undefined = [];
            gqlOperator.push(muiGridOperatorValueToGqlOperator[filterItem.operatorValue]);
            const column = columns.find((i) => i.field == filterItem.columnField);

            //if no gqlOperator, use filterItem.operatorValue and filterItem.value (objects) as given?

            if (gqlOperator.length === 0) {
                column?.filterOperators?.forEach((operator) => {
                    if (operator.label === filterItem.operatorValue && !!operator.convertMUIFilterToGQLFilter) {
                        const convertedOperators = operator.convertMUIFilterToGQLFilter();

                        let index = 0;
                        for (const op of convertedOperators) {
                            gqlOperator.push(op);

                            const conv = convertValueByType(filterItem.value[index], column?.type); //return is possibly an object
                            if (!conv) {
                                throw new Error(`no value given for ${filterItem.value[index]}`);
                            }

                            convertedValues.push(conv);
                            index += 1;
                        }
                    }
                });
            }

            if (gqlOperator.length === 0) throw new Error(`unknown operator ${filterItem.operatorValue}`);

            const ret = [];

            if (gqlOperator.length === convertedValues.length) {
                for (let i = 0; i < gqlOperator.length; i++) {
                    ret.push({ [filterItem.columnField]: { [op]: convertedValues[i] } as GqlStringFilter | GqlNumberFilter | GqlObjectFilter });
                }
            }
        });

    //NIKO between:
    //gut für onetomany über contains
    // für between muss AND verknüpft werden. Was als äußeren Operator? aus der convListe
    // gqlopbejctfilter:

    const filter: GqlFilter = {};
    const op: "and" | "or" = filterModel.linkOperator ?? "and";
    filter[op] = filterItems;

    // const filter = {and: {
    //      {
    //          and: {
    //              sgdsg,
    //                sfsg,
    //                sfs
    //          }
    //      },
    //
    //      {
    //          elem
    //      },
    //  }}

    let search: undefined | string = undefined;

    if (filterModel.quickFilterValues) {
        search = filterModel.quickFilterValues.join(" ");
    }

    return { filter, search };
}

//    column?.filterOperators && column.filterOperators.forEach((operator) => {
//         if(operator.label === value.operatorValue && !!operator.convertFilterToGQLFilter){
//            const filters = operator.convertFilterToGQLFilter();
//         }
//
//     };
//     gqlOperator = column.filterOperators[`${value.operatorValue}`].convertFilterToGQLFilter(); //converts to needed filter.
// }

// return {
//     [value.columnField]: {
//         operators,
//     },
// };

// {
//     [value.columnField]: {
//     [gqlOperator]: convertedValue,
// } as GqlStringFilter | GqlNumberFilter,
// };

// const ret = [];
//
// //Return without making it an array...?
// for (const op of gqlOperator) {
//     ret.push({
//         [value.columnField]: {
//             [op]: convertedValue,
//         } as GqlStringFilter | GqlNumberFilter,
//     });
// }
//
// return ret;

// const operators = gqlOperator.map((op) => {
//     return { [value.columnField]: { [op]: convertedValue } as GqlStringFilter | GqlNumberFilter };
// });

//How to return without array?
// return gqlOperator.map((op) => {
//     return { [value.columnField]: { [op]: convertedValue } as GqlStringFilter | GqlNumberFilter };
// });
