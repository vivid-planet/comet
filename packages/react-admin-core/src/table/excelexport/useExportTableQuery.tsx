import { useApolloClient } from "@apollo/react-hooks";
import * as React from "react";
import { Table } from "../Table";
import { ITableQueryApi } from "../TableQueryContext";
import { createExcelExportDownload, IExcelExportOptions } from "./createExcelExportDownload";
import { IExportApi } from "./IExportApi";

export function useExportTableQuery<IVariables>(api: ITableQueryApi, variables: IVariables, options?: IExcelExportOptions): IExportApi<any> {
    let tableRef: Table<any> | undefined;

    function attachTable(ref: Table<any>) {
        tableRef = ref;
    }

    const client = useApolloClient();

    async function exportTable() {
        if (tableRef != null) {
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
        }
    }

    return {
        exportTable,
        attachTable,
    };
}
