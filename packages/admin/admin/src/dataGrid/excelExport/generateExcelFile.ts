import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import * as Excel from "exceljs";

import { applyDefaultStyling } from "./applyDefaultStyling";

export interface ExcelGenerationOptions {
    worksheetName: string;
    styling?: (worksheet: Excel.Worksheet) => void;
}

export function generateExcelFile<Row extends GridValidRowModel>(
    columns: Array<GridColDef<Row>>,
    data: Row[],
    generateOptions: ExcelGenerationOptions,
) {
    const { worksheetName, styling } = generateOptions;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);

    const excelColumns: Partial<Excel.Column>[] = [];

    columns.forEach((column, columnIndex) => {
        const header = column.headerName;
        if (!column.disableExport) {
            excelColumns.push({
                header,
                key: column.field + columnIndex,
                width: 20,
                outlineLevel: 0,
                style: {},
                letter: columnIndex.toString(),
                values: [],
            });
        }
    });

    worksheet.columns = excelColumns;

    for (const row of data) {
        const excelRow: { [key: string]: string | number | null } = {};

        try {
            columns.forEach((column, columnIndex) => {
                if (!column.disableExport) {
                    let value = row[column.field];
                    if (column.valueGetter) {
                        // @ts-expect-error `valueGetter` requires more data but we don't have all that data available so we only pass in what we have and hope nothing breaks
                        value = column.valueGetter({ value, row });
                    }
                    if (column.valueFormatter) {
                        // @ts-expect-error `valueFormatter` requires more data but we don't have all that data available so we only pass in what we have and hope nothing breaks
                        value = column.valueFormatter({ value });
                    }
                    if (typeof value !== "string") {
                        throw new Error("Provided value is not a string");
                    }

                    excelRow[column.field + columnIndex] = value;
                }
            });

            worksheet.addRow({ ...excelRow });
        } catch (e) {
            throw new Error(e);
        }
    }

    if (styling != null) {
        styling(worksheet);
    } else {
        applyDefaultStyling(worksheet);
    }

    return workbook;
}
