import { DataGrid as MuiDataGrid, type DataGridProps as MuiDataGridProps } from "@mui/x-data-grid";
import { type ComponentType, lazy, Suspense } from "react";

type DataGridComponent = ComponentType<MuiDataGridProps>;

const ResolvedDataGrid = lazy(async () => {
    try {
        const { DataGridPremium } = await import("@mui/x-data-grid-premium");
        return { default: DataGridPremium as unknown as DataGridComponent };
    } catch {
        try {
            const { DataGridPro } = await import("@mui/x-data-grid-pro");
            return { default: DataGridPro as unknown as DataGridComponent };
        } catch {
            return { default: MuiDataGrid as DataGridComponent };
        }
    }
});

export type DataGridProps = MuiDataGridProps;

function DataGrid(props: DataGridProps) {
    return (
        <Suspense fallback={null}>
            <ResolvedDataGrid {...props} />
        </Suspense>
    );
}

export { DataGrid };
