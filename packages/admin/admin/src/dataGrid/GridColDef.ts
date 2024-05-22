import {
    // eslint-disable-next-line no-restricted-imports
    GridColDef as MuiGridColDef,
    GridValidRowModel,
} from "@mui/x-data-grid";

export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V> extends MuiGridColDef<R, V, F> {
    /**
     * Requires DataGridPro or DataGridPremium.
     */
    visibleMediaQuery?: string;
    /**
     * Requires DataGridPro or DataGridPremium.
     */
    sortBy?: string | string[];
}
