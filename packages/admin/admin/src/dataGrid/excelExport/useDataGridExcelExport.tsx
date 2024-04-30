import { DocumentNode, OperationVariables, useApolloClient } from "@apollo/client";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import * as React from "react";
import { useIntl } from "react-intl";

import { ExcelGenerationOptions, generateExcelFile } from "./generateExcelFile";

export interface ExportApi {
    loading: boolean;
    error?: string;
    exportGrid: () => void;
}

export type DataGridExcelExportOptions = Omit<ExcelGenerationOptions, "worksheetName"> & {
    fileName?: string;
    worksheetName?: string;
};

export function useDataGridExcelExport<Row extends GridValidRowModel, GQLQuery, GQLQueryVariables extends OperationVariables>(params: {
    columns: Array<GridColDef<Row>>;
    variables: GQLQueryVariables;
    query: DocumentNode;
    resolveQueryNodes: (queryData: GQLQuery) => Row[];
    totalCount: number;
    exportOptions?: DataGridExcelExportOptions;
}): ExportApi {
    const { columns, variables, query, resolveQueryNodes, totalCount, exportOptions } = params;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | undefined>();
    const client = useApolloClient();
    const intl = useIntl();

    const createExcelExportDownload = React.useCallback(
        async <Row extends GridValidRowModel>(columns: Array<GridColDef<Row>>, data: Row[], exportOptions: DataGridExcelExportOptions = {}) => {
            const {
                fileName = intl.formatMessage({ id: "comet.dataGrid.excelExport.defaultFileName", defaultMessage: "ExcelExport" }),
                worksheetName = intl.formatMessage({ id: "comet.dataGrid.excelExport.defaultWorksheetName", defaultMessage: "Table 1" }),
                styling,
            } = exportOptions;
            const workbook = generateExcelFile<Row>(columns, data, { worksheetName, styling });

            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), safeFileNameWithExtension(fileName));
            });
        },
        [intl],
    );

    const exportGrid = React.useCallback(async () => {
        setLoading(true);

        try {
            const data: Row[] = [];
            let offset = 0;
            do {
                const { data: pageData } = await client.query<GQLQuery, GQLQueryVariables>({
                    query,
                    variables: {
                        ...variables,
                        offset,
                        limit: 100,
                    },
                });
                offset += 100;

                data.push(...resolveQueryNodes(pageData));
            } while (data.length < totalCount);

            if (data.length > 0) {
                createExcelExportDownload<Row>(columns, data, exportOptions);
            }
        } catch (e) {
            setError("Error happend while exporting data");
        } finally {
            setLoading(false);
        }
    }, [client, columns, createExcelExportDownload, exportOptions, query, resolveQueryNodes, totalCount, variables]);

    return {
        loading,
        error,
        exportGrid,
    };
}

const safeFileNameWithExtension = (fileName: string) => {
    const excelRegex = /^.*.xlsx?$/;
    return fileName.match(excelRegex) ? fileName : `${fileName}.xlsx`;
};
