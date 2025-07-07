import { useApolloClient } from "@apollo/client";
import { useState } from "react";

import { Table } from "../Table";
import { ITableQueryApi } from "../TableQueryContext";
import { createExcelExportDownload, IExcelExportOptions } from "./createExcelExportDownload";
import { IExportApi } from "./IExportApi";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function useExportTableQuery<IVariables>(api: ITableQueryApi, variables: IVariables, options?: IExcelExportOptions): IExportApi<any> {
    let tableRef: Table<any> | undefined;
    const [loading, setLoading] = useState(false);
    function attachTable(ref: Table<any>) {
        tableRef = ref;
    }

    const client = useApolloClient();

    async function exportTable() {
        if (tableRef != null) {
            setLoading(true);
            try {
                const query = api.getQuery();
                const innerOptions = api.getInnerOptions();

                const response = await client.query<any, IVariables>({
                    query,
                    ...innerOptions,
                    variables: { ...variables },
                });

                const data = api.resolveTableData(response.data);

                if (data && data.data) {
                    createExcelExportDownload<any>(tableRef.props.columns, data.data, options);
                }
            } catch (e) {
                throw new Error("Error happend while exporting data");
            } finally {
                setLoading(false);
            }
        }
    }

    return {
        loading,
        exportTable,
        attachTable,
    };
}
