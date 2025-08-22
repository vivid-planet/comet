import { DataGrid as MuiDataGrid, type DataGridProps } from "@mui/x-data-grid";
import { type DataGridProProps } from "@mui/x-data-grid-pro";
import { lazy, Suspense } from "react";

const DataGridProComponent = lazy(async () => {
    try {
        const module = await import("@mui/x-data-grid-pro");
        return { default: module.DataGridPro };
    } catch (error) {
        console.error("Failed to load DataGridPro:", error);
        throw error;
    }
});

type Props<T extends boolean> = T extends true ? DataGridProProps : DataGridProps;

export function DataGrid<T extends boolean = boolean>(props: Props<T>) {
    return (
        <Suspense fallback={<MuiDataGrid {...(props as DataGridProps)} />}>
            <DataGridProComponent {...(props as DataGridProProps)} />
        </Suspense>
    );
}
