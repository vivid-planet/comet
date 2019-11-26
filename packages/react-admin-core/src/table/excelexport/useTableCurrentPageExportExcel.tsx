import * as React from "react";
import { IRow, ITableColumn, Table } from "../Table";
import { ITableQueryHookResult } from "../useTableQuery";
import { IExportExcelApi, IExportExcelApiDocumentGenerationState } from "./IExportExcelApi";
import { createExcelExportDownload } from "./index";

export function useTableCurrentPageExportExcel<TRow extends IRow>(
    tableQueryHookResults?: ITableQueryHookResult<any, any, any>,
    variablesForPage?: (page: number) => object,
    fileName?: string,
    worksheetName?: string,
): IExportExcelApi<TRow> {
    const [generationState, setGenerationState] = React.useState<IExportExcelApiDocumentGenerationState | null>(null);

    let tableRef: Table<TRow> | undefined;

    function attachTable(ref: Table<TRow>) {
        tableRef = ref;
    }

    async function exportData(c: Array<ITableColumn<TRow>>, r: TRow[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                createExcelExportDownload(c, r, fileName, worksheetName);
                resolve();
            } catch (e) {
                reject(e);
            } finally {
                setGenerationState(null);
            }
        });
    }

    async function exportTable() {
        if (tableRef != null) {
            setGenerationState({
                generating: true,
                progress: 0,
            });
            return exportData(tableRef.props.columns, tableRef.props.data);
        }
    }

    return {
        generationState,
        exportTable,
        attachTable,
    };
}
