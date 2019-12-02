import * as React from "react";
import { IRow, Table } from "../Table";
import { ITableQueryHookResult } from "../useTableQuery";
import { IExportApi } from "./IExportApi";
import { createExcelExportDownload } from "./index";

export function useExportDisplayedTableData<TRow extends IRow>(
    tableQueryHookResults?: ITableQueryHookResult<any, any, any>,
    variablesForPage?: (page: number) => object,
    fileName?: string,
    worksheetName?: string,
): IExportApi<TRow> {
    let tableRef: Table<TRow> | undefined;

    function attachTable(ref: Table<TRow>) {
        tableRef = ref;
    }

    async function exportTable() {
        return new Promise<void>(async (resolve, reject) => {
            if (tableRef != null) {
                try {
                    createExcelExportDownload(tableRef.props.columns, tableRef.props.data, fileName, worksheetName);
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
