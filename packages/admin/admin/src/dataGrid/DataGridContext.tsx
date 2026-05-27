import { DataGrid as MuiDataGrid, type DataGridProps, type GridValidRowModel } from "@mui/x-data-grid";
import { createContext, type PropsWithChildren, useContext } from "react";

type DataGridComponent = React.ComponentType<DataGridProps<GridValidRowModel>>;

interface DataGridContextValue {
    DataGrid: DataGridComponent;
}

const DataGridContext = createContext<DataGridContextValue>({
    DataGrid: MuiDataGrid,
});

export interface DataGridProviderProps {
    /**
     * The DataGrid component to use throughout the application.
     * Defaults to `DataGrid` from `@mui/x-data-grid`.
     * Can be set to `DataGridPro` or `DataGridPremium` for additional features.
     */
    dataGrid?: DataGridComponent;
}

export function DataGridProvider({ dataGrid, children }: PropsWithChildren<DataGridProviderProps>) {
    return <DataGridContext.Provider value={{ DataGrid: dataGrid ?? MuiDataGrid }}>{children}</DataGridContext.Provider>;
}

/**
 * Returns the DataGrid component configured via `DataGridProvider`.
 * If no provider is present, falls back to the base `DataGrid` from `@mui/x-data-grid`.
 */
export function useDataGrid(): DataGridComponent {
    return useContext(DataGridContext).DataGrid;
}

/**
 * A DataGrid component that uses the DataGrid configured via context (DataGridProvider).
 * Falls back to the base `DataGrid` from `@mui/x-data-grid` if no provider is present.
 */
export function CometDataGrid<R extends GridValidRowModel = GridValidRowModel>(props: DataGridProps<R>) {
    const DataGridComponent = useDataGrid();
    return <DataGridComponent {...(props as DataGridProps)} />;
}
