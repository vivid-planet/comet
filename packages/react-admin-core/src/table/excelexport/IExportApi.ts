import { IRow, Table } from "../Table";

export interface IExportApi<TRow extends IRow> {
    loading: boolean;
    exportTable: () => void;
    attachTable: (ref: Table<TRow>) => void;
}
