import {
    // eslint-disable-next-line no-restricted-imports
    GridColDef as MuiGridColDef,
    GridValidRowModel,
} from "@mui/x-data-grid";

export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V> extends MuiGridColDef<R, V, F> {
    /**
     * Media query to define when the column is visible.
     * Requires DataGridPro or DataGridPremium.
     */
    visible?: string;
}
