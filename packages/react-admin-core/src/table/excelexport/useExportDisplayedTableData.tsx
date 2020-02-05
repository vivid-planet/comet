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
        return new Promise<void>(async (resolve, reject) => {
            if (tableRef != null) {
                await setLoading(true);
                try {
                    createExcelExportDownload(tableRef.props.columns, tableRef.props.data, options);
                    resolve();
                } catch (e) {
                    reject(e);
                } finally {
                    await setLoading(false);
                }
            } else {
                reject("No table ref set");
            }
        });
    }

    return {
        loading,
        exportTable,
        attachTable,
    };
}
