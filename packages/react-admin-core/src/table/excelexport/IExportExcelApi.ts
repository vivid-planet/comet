import { IRow, Table } from "../Table";

export interface IExportExcelApiDocumentGenerationState {
    generating: boolean;
    progress: number;
}
export interface IExportExcelApi<TRow extends IRow> {
    generationState: IExportExcelApiDocumentGenerationState | null;
    exportTable: () => void;
    attachTable: (ref: Table<TRow>) => void;
}
