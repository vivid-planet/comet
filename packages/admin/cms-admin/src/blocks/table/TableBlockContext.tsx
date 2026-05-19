// eslint-disable-next-line no-restricted-imports
import type { GridColDef } from "@mui/x-data-grid";
import type { DataGridPro as DataGridProComponent, GridApiPro } from "@mui/x-data-grid-pro";
import { createContext, type ReactNode, type RefObject, useContext } from "react";

import type { RichTextBlock } from "../createRichTextBlock";

export type DataGridProDependencies = {
    DataGridPro: typeof DataGridProComponent;
    GRID_REORDER_COL_DEF: GridColDef;
    useGridApiRef: () => RefObject<GridApiPro | null>;
    useGridApiContext: () => RefObject<GridApiPro>;
};

type TableBlockContextValue = {
    RichTextBlock: RichTextBlock;
    dataGrid: DataGridProDependencies;
};

const TableBlockContext = createContext<TableBlockContextValue | undefined>(undefined);

export const TableBlockContextProvider = ({ RichTextBlock, dataGrid, children }: TableBlockContextValue & { children: ReactNode }) => (
    <TableBlockContext.Provider value={{ RichTextBlock, dataGrid }}>{children}</TableBlockContext.Provider>
);

export const useTableBlockContext = (): TableBlockContextValue => {
    const context = useContext(TableBlockContext);
    if (!context) {
        throw new Error("useTableBlockContext must be used within a TableBlockContextProvider");
    }
    return context;
};
