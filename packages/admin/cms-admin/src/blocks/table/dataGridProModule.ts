import type { GridColDef } from "@comet/admin";
import type { DataGridProProps } from "@mui/x-data-grid-pro";

type DataGridProModule = {
    DataGridPro: React.ComponentType<DataGridProProps>;
    GRID_REORDER_COL_DEF: GridColDef;
};

let dataGridProModule: DataGridProModule | undefined;

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@mui/x-data-grid-pro");
    dataGridProModule = {
        DataGridPro: mod.DataGridPro,
        GRID_REORDER_COL_DEF: mod.GRID_REORDER_COL_DEF,
    };
} catch {
    // @mui/x-data-grid-pro is not installed, fall back to community DataGrid
}

export const isDataGridProAvailable = dataGridProModule !== undefined;
export const DataGridProComponent = dataGridProModule?.DataGridPro;
export const GRID_REORDER_COL_DEF = dataGridProModule?.GRID_REORDER_COL_DEF;

export type { DataGridProProps };
