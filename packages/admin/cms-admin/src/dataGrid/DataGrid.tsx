import { DataGrid as MuiDataGrid, type DataGridProps as MuiDataGridProps } from "@mui/x-data-grid";
import { type ComponentType, lazy, Suspense } from "react";

type DataGridComponent = ComponentType<MuiDataGridProps>;

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

export type DataGridProps<R extends Record<string, unknown> = Record<string, unknown>> = MuiDataGridProps<R>;

function DataGrid<R extends Record<string, unknown> = Record<string, unknown>>(props: DataGridProps<R>) {
    return (
        <Suspense fallback={null}>
            <ResolvedDataGrid {...(props as MuiDataGridProps)} />
        </Suspense>
    );
}

export { DataGrid };
