import { useApolloClient } from "@apollo/react-hooks";
import * as React from "react";
import { IRow, Table } from "../Table";
import { ITableQueryHookResult } from "../useTableQuery";
import { IExportExcelApi, IExportExcelApiDocumentGenerationState } from "./IExportExcelApi";
import { createExcelExportDownload } from "./index";

export function useTableQueryAllPagesExportExcel<TRow extends IRow, IVariables>(
    tableQueryHookResults?: ITableQueryHookResult<any, any, any>,
    variablesForPage?: (page: number) => IVariables,
    fileName?: string,
    worksheetName?: string,
): IExportExcelApi<TRow> {
    const [generationState, setGenerationState] = React.useState<IExportExcelApiDocumentGenerationState | null>(null);

    let tableRef: Table<TRow> | undefined;

    function attachTable(ref: Table<TRow>) {
        tableRef = ref;
    }

    const client = useApolloClient();
    const [batchLoad, setBatchLoad] = React.useState<{ from: number; to: number } | null>(null);

    React.useEffect(() => {
        if (batchLoad != null) {
            loadData(batchLoad);
        }
    }, [batchLoad]);

    const loadData = async (loadRange: { from: number; to: number }) => {
        if (tableQueryHookResults && variablesForPage) {
            const totalPagesToLoad = Math.max(1, loadRange.to + 1 - loadRange.from); // Math.max: avoid division by zero
            if (tableRef != null) {
                const r: TRow[] = [];
                for (let i = loadRange.from; i <= loadRange.to; ++i) {
                    if (generationState != null) {
                        const progress = i / totalPagesToLoad;
                        setGenerationState({ ...generationState, progress });
                    }

                    if (tableRef) {
                        const q = tableQueryHookResults.api.getQuery();
                        const innerOptions = tableQueryHookResults.api.getInnerOptions();

                        const variables = variablesForPage(i);

                        const response = await client.query({
                            query: q,
                            ...innerOptions,
                            variables: { ...variables },
                        });
                        const tableData = tableQueryHookResults.api.getResolveTableData(response.data);
                        if (tableData.data != null) {
                            r.push(...tableData.data);
                        }
                    }
                }

                createExcelExportDownload(tableRef.props.columns, r, fileName, worksheetName);
            }
            await setBatchLoad(null);
            await setGenerationState(null);
        } else {
            throw new Error("Paged downloads are only available if you provide tableQuery and variablesForPage");
        }
    };

    async function exportAllPages() {
        await setGenerationState({ generating: true, progress: 0 });
        if (tableRef != null) {
            if (tableRef.props.pagingInfo && tableRef.props.pagingInfo.totalPages) {
                setBatchLoad({ from: 1, to: tableRef.props.pagingInfo.totalPages });
            }
        }
    }

    async function exportTable() {
        exportAllPages();
    }

    return {
        generationState,
        exportTable,
        attachTable,
    };
}
