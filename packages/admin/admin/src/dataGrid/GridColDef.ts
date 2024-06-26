import {
    // eslint-disable-next-line no-restricted-imports
    GridColDef as MuiGridColDef,
    GridFilterOperator,
    GridValidRowModel,
} from "@mui/x-data-grid";

export interface ExtendedGridFilterOperator extends GridFilterOperator {
    convertMUIFilterToGQLFilter?: () => string | string[]; //object of filter?
}

//

export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V> extends Omit<MuiGridColDef<R, V, F>, "filterOperators"> {
    /**
     * Media query to define when the column is visible.
     * Requires DataGridPro or DataGridPremium.
     */
    visible?: string;
    /**
     * Requires DataGridPro or DataGridPremium.
     */
    sortBy?: string | string[];

    filterOperators?: ExtendedGridFilterOperator[];
}
