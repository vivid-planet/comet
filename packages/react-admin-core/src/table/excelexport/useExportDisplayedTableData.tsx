import * as React from "react";

import { Table } from "../Table";
import { IExportApi } from "./IExportApi";
import { createExcelExportDownload, IExcelExportOptions } from "./index";

export function useExportDisplayedTableData(options?: IExcelExportOptions): IExportApi<any> {
    let tableRef: Table<any> | undefined;

    const [loading, setLoading] = React.useState(false);
    function attachTable(ref: Table<any>) {
        tableRef = ref;
    }

    async function exportTable() {
        if (tableRef != null) {
            await setLoading(true);
            try {
                await createExcelExportDownload(tableRef.props.columns, tableRef.props.data, options);
            } finally {
                await setLoading(false);
            }
        } else {
            throw new Error("No table ref set");
        }
    }

    return {
        loading,
        exportTable,
        attachTable,
    };
}
