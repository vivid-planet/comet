import { DataGrid as MuiDataGrid, type DataGridProps } from "@mui/x-data-grid";
import { DataGridPro, type DataGridProProps } from "@mui/x-data-grid-pro";
import { LicenseInfo } from "@mui/x-license";

type Props<T extends boolean> = T extends true ? DataGridProProps : DataGridProps;

export function DataGrid<T extends boolean = boolean>(props: Props<T>) {
    const muiLicenseKey = LicenseInfo.getLicenseKey();

    if (muiLicenseKey) {
        return <DataGridPro {...(props as DataGridProProps)} />;
    }

    return <MuiDataGrid {...(props as DataGridProps)} />;
}
