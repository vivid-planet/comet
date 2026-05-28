import { useCometConfig } from "@comet/cms-admin";
import { DataGrid as MuiDataGrid, type DataGridProps, type GridValidRowModel } from "@mui/x-data-grid";

export function DataGrid<R extends GridValidRowModel = GridValidRowModel>(props: DataGridProps<R>) {
    const { dataGrid: { component: ConfiguredDataGrid = MuiDataGrid } = {} } = useCometConfig();

    return <ConfiguredDataGrid {...props} />;
}
