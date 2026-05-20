import { DataGrid as MuiDataGrid, type DataGridProps } from "@mui/x-data-grid";
import { type ComponentType, lazy, Suspense } from "react";

type DataGridComponent = ComponentType<DataGridProps>;

const ResolvedDataGrid = lazy(async () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { DataGridPremium } = require("@mui/x-data-grid-premium");
        return { default: DataGridPremium as unknown as DataGridComponent };
    } catch {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { DataGridPro } = require("@mui/x-data-grid-pro");
            return { default: DataGridPro as unknown as DataGridComponent };
        } catch {
            return { default: MuiDataGrid as DataGridComponent };
        }
    }
});

/**
 * DataGrid wrapper that automatically resolves to DataGridPremium or DataGridPro if available,
 * falling back to the base DataGrid from @mui/x-data-grid.
 */
function DataGrid<R extends Record<string, unknown> = Record<string, unknown>>(props: DataGridProps<R>) {
    return (
        <Suspense fallback={null}>
            <ResolvedDataGrid {...(props as DataGridProps)} />
        </Suspense>
    );
}

export { DataGrid };
