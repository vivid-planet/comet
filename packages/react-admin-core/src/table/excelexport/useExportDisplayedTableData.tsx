import * as React from "react";
import { IRow, Table } from "../Table";
import { IExportApi } from "./IExportApi";
import { createExcelExportDownload, IExcelExportOptions } from "./index";

export function useExportDisplayedTableData<TRow extends IRow>(options?: IExcelExportOptions): IExportApi<TRow> {
    let tableRef: Table<TRow> | undefined;

    function attachTable(ref: Table<TRow>) {
        tableRef = ref;
    }

    async function exportTable() {
        return new Promise<void>(async (resolve, reject) => {
            if (tableRef != null) {
                try {
                    createExcelExportDownload(tableRef.props.columns, tableRef.props.data, options);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            } else {
                reject("No table ref set");
            }
        });
    }

    return {
        exportTable,
        attachTable,
    };
}
