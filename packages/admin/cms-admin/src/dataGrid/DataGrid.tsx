import { DataGrid as MuiDataGrid, type DataGridProps, type GridValidRowModel } from "@mui/x-data-grid";

import { useCometConfig } from "../config/CometConfigContext";

export function DataGrid<R extends GridValidRowModel = GridValidRowModel>(props: DataGridProps<R>) {
    const { dataGrid: { component: ConfiguredDataGrid = MuiDataGrid } = {} } = useCometConfig();
    const TypedDataGrid = ConfiguredDataGrid as typeof MuiDataGrid;
    return <TypedDataGrid {...props} />;
}
