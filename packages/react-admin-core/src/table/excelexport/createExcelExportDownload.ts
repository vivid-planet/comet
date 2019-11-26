import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import * as React from "react";
import { safeColumnGet } from "../safeColumnGet";
import { IRow, ITableColumn } from "../Table";
import { applyDefaultStyling } from "./applyDefaultStyling";

export async function createExcelExportDownload<TRow extends IRow>(
    columns: Array<ITableColumn<TRow>>,
    data: TRow[],
    fileName: string = "ExcelExport",
    worksheetName: string = "Tabelle 1",
    styling?: (worksheet: Excel.Worksheet) => void,
) {
    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(worksheetName);

    // create columns
    const excelColumns: Excel.Column[] = [];
    columns.forEach((column, columnIndex) => {
        // TODO: should we hide hidden columns or not export?
        // TODO: maybe extra property in ITableColumn? shouldExport?
        const hidden = column.visible !== undefined && column.visible != null ? !column.visible : false;

        const header = column.headerExcel != null ? column.headerExcel : safeStringFromReactNode(column.header);
        if (!hidden) {
            excelColumns.push({
                header,
                key: column.name,
                hidden,
                width: 20,
                outlineLevel: 0,
                style: {},
                letter: columnIndex.toString(),
                values: [],
            });
        }
    });
    worksheet.columns = excelColumns;

    // create Rows
    {
        data.map(row => {
            const newRow: { [key: string]: string | number | null } = {};

            columns.forEach(column => {
                if (column.renderExcel) {
                    newRow[column.name] = column.renderExcel(row);
                } else {
                    const render = column.render != null ? safeStringFromReactNode(column.render(row)) : null;
                    newRow[column.name] = render != null ? render : safeColumnGet(row, column.name);
                }
            });
            worksheet.addRow({ ...newRow });
        });
    }

    if (styling != null) {
        styling(worksheet);
    } else {
        applyDefaultStyling(worksheet);
    }

    workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(new Blob([buffer]), safeFileNameWithExtension(fileName));
    });
}

function safeFileNameWithExtension(fileName: string): string {
    const excelRegex = /^.*.xlsx?$/;
    return fileName.match(excelRegex) ? fileName : `${fileName}.xlsx`;
}

function safeStringFromReactNode(node: string | string | React.ReactNode): string {
    return typeof node === "string" ? node : "";
}
