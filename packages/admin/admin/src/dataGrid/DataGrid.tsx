import { type ComponentType, lazy, type Ref, Suspense } from "react";

type DataGridComponent = ComponentType<any>;

const ResolvedDataGrid = lazy(async () => {
    try {
        const { DataGridPremium } = await import("@mui/x-data-grid-premium");
        return { default: DataGridPremium as DataGridComponent };
    } catch {
        try {
            const { DataGridPro } = await import("@mui/x-data-grid-pro");
            return { default: DataGridPro as DataGridComponent };
        } catch {
            const { DataGrid: MuiDataGrid } = await import("@mui/x-data-grid");
            return { default: MuiDataGrid as DataGridComponent };
        }
    }
});

export type DataGridProps = {
    [key: string]: any;
    ref?: Ref<unknown>;
};

function DataGrid(props: DataGridProps) {
    return (
        <Suspense fallback={null}>
            <ResolvedDataGrid {...props} />
        </Suspense>
    );
}

export { DataGrid };
