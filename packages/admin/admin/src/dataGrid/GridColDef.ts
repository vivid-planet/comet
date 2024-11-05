import {
    // eslint-disable-next-line no-restricted-imports
    GridColDef as MuiGridColDef,
    GridValidRowModel,
    GridValueOptionsParams,
} from "@mui/x-data-grid";

import { GridPinnedColumns } from "./usePersistentColumnState";

export type ValueOption =
    | string
    | number
    | {
          value: any;
          label: string;
          cellContent?: React.ReactNode;
      };

export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V> extends MuiGridColDef<R, V, F> {
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
}
