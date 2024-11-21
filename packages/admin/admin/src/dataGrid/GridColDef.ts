import {
    GridActionsColDef as MuiGridActionsColDef,
    GridSingleSelectColDef as MuiGridSingleSelectColDef,
    GridValidRowModel,
    GridValueOptionsParams,
} from "@mui/x-data-grid";
import { GridBaseColDef as MuiGridBaseColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { type GridPinnedColumns } from "@mui/x-data-grid-pro";

export type ValueOption =
    | string
    | number
    | {
          value: any;
          label: string;
          cellContent?: React.ReactNode;
      };

type GridColDefExtension<R extends GridValidRowModel = any> = {
    valueOptions?: Array<ValueOption> | ((params: GridValueOptionsParams<R>) => Array<ValueOption>);
    /**
     * Media query to define when the column is visible.
     * Requires DataGridPro or DataGridPremium.
     */
    visible?: string;
    /**
     * Requires DataGridPro or DataGridPremium.
     */
    sortBy?: string | string[];
    /**
     * Requires DataGridPro or DataGridPremium.
     */
    pinned?: keyof GridPinnedColumns;
};

export type GridBaseColDef<R extends GridValidRowModel = any, V = any, F = V> = MuiGridBaseColDef<R, V, F> & GridColDefExtension<R>;
export type GridActionsColDef<R extends GridValidRowModel = any, V = any, F = V> = MuiGridActionsColDef<R, V, F> & GridColDefExtension<R>;
export type GridSingleSelectColDef<R extends GridValidRowModel = any, V = any, F = V> = MuiGridSingleSelectColDef<R, V, F> & GridColDefExtension<R>;
export type GridColDef<R extends GridValidRowModel = any, V = any, F = V> =
    | GridBaseColDef<R, V, F>
    | GridActionsColDef<R, V, F>
    | GridSingleSelectColDef<R, V, F>;
