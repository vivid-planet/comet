import { IRow, Table } from "../Table";

export interface IExportApi<TRow extends IRow> {
    exportTable: () => void;
    attachTable: (ref: Table<TRow>) => void;
}
